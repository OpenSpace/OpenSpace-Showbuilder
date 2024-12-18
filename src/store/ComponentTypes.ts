import { StateCreator } from 'zustand';

export type LayoutType = 'row' | 'column' | 'grid';

export type ComponentType =
  | 'fade'
  | 'flyto'
  | 'statuspanel'
  | 'timepanel'
  | 'navpanel'
  | 'recordpanel'
  | 'sessionplayback'
  | 'settime'
  | 'setnavstate'
  | 'setfocus'
  | 'richtext'
  | 'title'
  | 'video'
  | 'image'
  | 'default'
  | 'boolean'
  | 'number'
  | 'trigger'
  | 'page'
  | 'multi';

export type Toggle = 'on' | 'off' | 'toggle';
export type MultiState = 'false' | 'pendingDelete' | 'pendingSave' | 'true';

export type Page = {
  components: Array<ComponentBase['id']>;
  id: string;
  x: number;
  y: number;
};

export interface ComponentBase {
  id: string;
  parentPage?: Page['id'];
  parentLayout?: LayoutBase['id'];
  isMulti: MultiState;
  type: ComponentType;
  lockName?: boolean;
  gui_name: string;
  gui_description: string;
}

export interface TimeComponent extends ComponentBase {
  type: 'timepanel';
}
export interface NavComponent extends ComponentBase {
  type: 'navpanel';
}
export interface StatusComponent extends ComponentBase {
  type: 'statuspanel';
}

export interface RecordComponent extends ComponentBase {
  type: 'recordpanel';
}

export interface RichTextComponent extends ComponentBase {
  type: 'richtext';
  text: string;
}

export interface TitleComponent extends ComponentBase {
  type: 'title';
  text: string;
}
export interface VideoComponent extends ComponentBase {
  type: 'video';
  url: string;
}

export interface ImageComponent extends ComponentBase {
  type: 'image';
  url: string;
}

export interface SessionPlaybackComponent extends ComponentBase {
  type: 'sessionplayback';
  file: string;
  loop: boolean;
  forceTime: boolean;
  backgroundImage: string;
  triggerAction: () => void;
}

export interface FlyToComponent extends ComponentBase {
  type: 'flyto';
  target?: string;
  geo?: boolean;
  intDuration?: number;
  lat?: number;
  long?: number;
  alt?: number;
  backgroundImage: string;
  triggerAction: () => void;
}

export interface FadeComponent extends ComponentBase {
  type: 'fade';
  property: string;
  intDuration: number;
  action: Toggle;
  backgroundImage: string;
  triggerAction: () => void;
}

export interface SetTimeComponent extends ComponentBase {
  type: 'settime';
  time: Date | string;
  intDuration: number;
  interpolate: boolean;
  fadeScene: boolean;
  backgroundImage: string;
  triggerAction: () => void;
}

export interface SetNavComponent extends ComponentBase {
  type: 'setnavstate';
  navigationState: any;
  time: Date | string;
  setTime: boolean;
  fadeScene: boolean;
  backgroundImage: string;
  intDuration: number;
  triggerAction: () => void;
}
export interface SetFocusComponent extends ComponentBase {
  type: 'setfocus';
  property: string;
  backgroundImage: string;
  triggerAction: () => void;
}

export interface BooleanComponent extends ComponentBase {
  type: 'boolean';
  property: string;
  action: Toggle;
  backgroundImage: string;
  triggerAction: () => void;
}
export interface NumberComponent extends ComponentBase {
  type: 'number';
  min: number;
  max: number;
  step: number;
  exponent: number;
  property: string;
  backgroundImage: string;
  triggerAction: (value: number) => void;
}
export interface TriggerComponent extends ComponentBase {
  type: 'trigger';
  property: string;
  backgroundImage: string;
  triggerAction: () => void;
}

export interface PageComponent extends ComponentBase {
  type: 'page';
  page: number;
  backgroundImage: string;
  triggerAction: () => void;
}

export interface LayoutBase {
  id: string;
  parentPage?: Page['id'];
  type: LayoutType;
  rows: number;
  columns: number;
  children: (string | null)[]; // Array of component IDs
  padding: number;
  childWidth: number;
  childHeight: number;
}

export type MultiOption =
  | TriggerComponent
  | BooleanComponent
  | FadeComponent
  | SetFocusComponent
  | FlyToComponent
  | SetTimeComponent
  | SessionPlaybackComponent
  | PageComponent;

export const staticComponents = [
  { value: 'richtext', label: 'Rich Text' },
  { value: 'title', label: 'Title' },
  { value: 'video', label: 'Video' },
  { value: 'image', label: 'Image' },
];
export const presetComponents = [
  { value: 'fade', label: 'Fade' },
  { value: 'setfocus', label: 'Set Focus' },
  { value: 'setnavstate', label: 'Set Navigation' },
  { value: 'flyto', label: 'Fly To' },
  { value: 'settime', label: 'Set Time' },
  { value: 'multi', label: 'Multi' },
  { value: 'sessionplayback', label: 'Session Playback' },
  { value: 'page', label: 'Go To Page' },
];

export const propertyComponents = [
  { value: 'boolean', label: 'Boolean' },
  { value: 'number', label: 'Number' },
  { value: 'trigger', label: 'Trigger' },
];

export const allComponentLabels = [
  ...presetComponents,
  ...staticComponents,
  ...propertyComponents,
];

export const multiOptions = [
  { value: 'trigger', label: 'Trigger' },
  { value: 'boolean', label: 'Boolean' },
  { value: 'fade', label: 'Fade' },
  { value: 'setfocus', label: 'Set Focus' },
  { value: 'flyto', label: 'Fly To' },
  { value: 'settime', label: 'Set Time' },
  { value: 'sessionplayback', label: 'Session Playback' },
  { value: 'setnavstate', label: 'Set Navigation' },
  { value: 'page', label: 'Go To Page' },
];

//create typeguard to determing if opbject is of type MultiOption
export const isMultiOption = (option: any): option is MultiOption => {
  return (
    option.type === 'trigger' ||
    option.type === 'boolean' ||
    option.type === 'fade' ||
    option.type === 'setfocus' ||
    option.type === 'flyto' ||
    option.type === 'settime' ||
    option.type === 'sessionplayback' ||
    option.type === 'setnavstate' ||
    option.type === 'page'
  );
};

export interface MultiComponent extends ComponentBase {
  type: 'multi';
  components: {
    component: MultiOption['id'];
    buffer: number;
    startTime: number;
    endTime: number;
    chained: boolean;
  }[];
  backgroundImage: string;
  triggerAction: () => void;
}

export type Component =
  | ComponentBase
  | FadeComponent
  | SetFocusComponent
  | FlyToComponent
  | SetTimeComponent
  | SetNavComponent
  | RichTextComponent
  | TitleComponent
  | VideoComponent
  | ImageComponent
  | BooleanComponent
  | TriggerComponent
  | NumberComponent
  | SessionPlaybackComponent
  | PageComponent
  | MultiComponent;

export type ImmerStateCreator<T, TBase> = StateCreator<
  T,
  [['zustand/immer', never], never],
  [],
  TBase
>;
