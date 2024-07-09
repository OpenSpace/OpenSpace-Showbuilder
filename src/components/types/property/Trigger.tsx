import { useEffect, useState } from 'react';
import {
  useOpenSpaceApiStore,
  useComponentStore,
  usePropertyStore,
  TriggerComponent,
  ConnectionState,
} from '@/store';
import Autocomplete from '@/components/common/AutoComplete';
import Information from '@/components/common/Information';
import { triggerTrigger } from '@/utils/triggerHelpers';

interface TriggerGUIProps {
  component: TriggerComponent;
}

const TriggerGUIComponent: React.FC<TriggerGUIProps> = ({ component }) => {
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
          triggerTrigger(component.property);
        },
      });
    }
  }, [component.id, component.property, luaApi]);

  return (
    <div
      className="absolute right-0 top-0 flex h-full w-full items-center justify-center hover:cursor-pointer"
      onClick={() => component.triggerAction?.()}
    >
      <div className="flex flex-row gap-4">
        <h1 className="text-2xl"> {component.gui_name}</h1>
        <Information content={component.gui_description} />
      </div>
    </div>
  );
};

interface TriggerModalProps {
  component: TriggerComponent | null;
  handleComponentData: (data: Partial<TriggerComponent>) => void;
}

const TriggerModal: React.FC<TriggerModalProps> = ({
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

  useEffect(() => {
    handleComponentData({
      property,
      //   action: action as Toggle,
      gui_name,
      gui_description,
    });
  }, [property, gui_name, gui_description, handleComponentData]);

  useEffect(() => {
    if (connectionState !== ConnectionState.CONNECTED) return;
  }, []);

  const sortedKeys: Record<string, string> = Object.keys(properties)
    .filter((a) => properties[a].type === 'Trigger')
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
    <div className="mb-4">
      <div className="mb-1 flex flex-col gap-2">
        <div className="flex flex-row items-center justify-between gap-8">
          <div className="text-sm font-medium text-black">Property</div>
          <Autocomplete
            options={sortedKeys}
            onChange={(v) => setProperty(sortedKeys[v])}
            initialValue={
              Object.keys(sortedKeys).find(
                (key) => sortedKeys[key] === property,
              ) as string
            }
          />
        </div>
        <div className="flex flex-row items-center justify-between">
          <div className="text-sm font-medium text-black">Gui Name</div>
          <input
            type="text"
            className="w-[50%] rounded border p-2"
            value={gui_name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setGuiName(e.target.value)
            }
          />
        </div>
        <div className="flex flex-row items-center justify-between">
          <div className="text-sm font-medium text-black">Gui Description</div>
          <input
            type="textbox"
            className="w-[50%] rounded border p-2"
            value={gui_description}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setGuiDescription(e.target.value)
            }
          />
        </div>
      </div>
    </div>
  );
};

export { TriggerModal, TriggerGUIComponent };