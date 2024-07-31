import { useEffect, useState } from 'react';
import {
  useOpenSpaceApiStore,
  useComponentStore,
  usePropertyStore,
  BooleanComponent,
  Toggle,
  ConnectionState,
} from '@/store';
import SelectableDropdown from '@/components/common/SelectableDropdown';
import Information from '@/components/common/Information';
import { triggerBool } from '@/utils/triggerHelpers';
import ImageUpload from '@/components/common/ImageUpload';
import { VirtualizedCombobox } from '@/components/common/VirtualizedCombobox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ButtonLabel from '@/components/common/ButtonLabel';

interface BoolGUIProps {
  component: BooleanComponent;
  shouldRender?: boolean;
}

const BoolGUIComponent: React.FC<BoolGUIProps> = ({
  component,
  shouldRender = true,
}) => {
  const luaApi = useOpenSpaceApiStore((state) => state.luaApi);
  const connectionState = useOpenSpaceApiStore(
    (state) => state.connectionState,
  );
  const updateComponent = useComponentStore((state) => state.updateComponent);
  const subscribeToProperty = usePropertyStore(
    (state) => state.subscribeToProperty,
  );
  const unsubscribeFromProperty = usePropertyStore(
    (state) => state.unsubscribeFromProperty,
  );
  const property = usePropertyStore(
    (state) => state.properties[component.property],
  );

  useEffect(() => {
    if (connectionState !== ConnectionState.CONNECTED) return;
    console.log('Subscribing to property', component.property);
    subscribeToProperty(component.property, 500);
    return () => {
      unsubscribeFromProperty(component.property);
    };
  }, [
    component.property,
    connectionState,
    subscribeToProperty,
    unsubscribeFromProperty,
  ]);

  useEffect(() => {
    if (luaApi) {
      console.log('Registering trigger action');
      console.log(component);
      updateComponent(component.id, {
        triggerAction: () => {
          triggerBool(component.property, component.action);
        },
      });
    }
  }, [
    component.id,
    component.action,
    component.action,
    component.property,
    luaApi,
  ]);

  return shouldRender ? (
    <div
      className={`absolute right-0 top-0 flex h-full w-full items-center justify-center rounded border-8 transition-colors  hover:cursor-pointer ${
        property?.value ? 'border-green-500' : 'border-red-500'
      }`}
      style={{
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundImage: `url(${component.backgroundImage})`,
      }}
      onClick={() => component.triggerAction?.()}
    >
      <ButtonLabel>
        <div className="flex gap-2">
          {component.gui_name}
          <Information content={component.gui_description} />
        </div>
      </ButtonLabel>
    </div>
  ) : null;
};

interface BoolModalProps {
  component: BooleanComponent | null;
  handleComponentData: (data: Partial<BooleanComponent>) => void;
}

const BoolModal: React.FC<BoolModalProps> = ({
  component,
  handleComponentData,
}) => {
  const connectionState = useOpenSpaceApiStore(
    (state) => state.connectionState,
  );

  const properties = usePropertyStore((state) => state.properties);
  const [property, setProperty] = useState<string>(component?.property || '');

  const [gui_name, setGuiName] = useState<string>(component?.gui_name || '');
  const [gui_description, setGuiDescription] = useState<string>(
    component?.gui_description || '',
  );
  const [action, setAction] = useState<string>(component?.action || 'toggle');
  const [backgroundImage, setBackgroundImage] = useState<string>(
    component?.backgroundImage || '',
  );

  useEffect(() => {
    // console.log(properties);
    const propertyData = usePropertyStore.getState().properties[property];
    if (!propertyData) return;
    const name = propertyData.uri
      //only exacly '.Layers' should be removed
      .replace(/Scene.|.Renderable|\.Layers/g, '')
      .split('.')
      .slice(0, -1)
      .join('.')
      .replace(/\./g, ' > ')
      .trim();
    // let name = propertyData.uri.split('.')[1];
    setGuiName(`${name} > ${propertyData.description.Name} > ${action}`);
    setGuiDescription(propertyData.description.description);
  }, [property, action]);

  useEffect(() => {
    handleComponentData({
      property,
      action: action as Toggle,
      gui_name,
      gui_description,
      backgroundImage,
    });
  }, [
    property,
    action,
    gui_name,
    gui_description,
    handleComponentData,
    backgroundImage,
  ]);

  useEffect(() => {
    if (connectionState !== ConnectionState.CONNECTED) return;
  }, []);

  const sortedKeys: Record<string, string> = Object.keys(properties)
    .filter((a) => properties[a].type === 'Bool')
    .sort((a, b) => {
      const periodCountA = (a.match(/\./g) || []).length;
      const periodCountB = (b.match(/\./g) || []).length;

      if (periodCountA !== periodCountB) {
        return periodCountA - periodCountB;
      }

      return a.localeCompare(b);
    })
    .reduce((acc: Record<string, string>, key) => {
      //   const newValue = key
      // .replace(/Scene.|.Renderable|.Opacity/g, '')
      // .replace(/\./g, ' > ')
      // .trim();
      const newValue = key;
      acc[newValue] = key;
      return acc;
    }, {});

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="grid gap-2">
            <div className="text-sm font-medium text-black">Property</div>
            <VirtualizedCombobox
              options={Object.keys(sortedKeys)}
              selectOption={(v: string) => setProperty(sortedKeys[v])}
              selectedOption={
                Object.keys(sortedKeys).find(
                  (key) => sortedKeys[key] === property,
                ) || ''
              }
              searchPlaceholder="Search the Scene..."
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label>Action Type</Label>
            <SelectableDropdown
              options={['toggle', 'on', 'off']}
              selected={action}
              setSelected={setAction}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="gioname">Component Name</Label>
            <Input
              id="guiname"
              placeholder="Name of Component"
              type="text"
              value={gui_name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setGuiName(e.target.value)
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <ImageUpload
            value={backgroundImage}
            onChange={(v) => setBackgroundImage(v)}
          />
          <div className="grid gap-2">
            <Label htmlFor="description"> Gui Description</Label>
            <Textarea
              className="w-full"
              id="description"
              value={gui_description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setGuiDescription(e.target.value)
              }
              placeholder="Type your message here."
            />
          </div>
        </div>
      </div>
    </>
  );
};

export { BoolModal, BoolGUIComponent };
