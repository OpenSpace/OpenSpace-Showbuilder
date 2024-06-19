import DateComponent from '@/components/timepicker/DateComponent';
import {
  usePropertyStore,
  useOpenSpaceApiStore,
  ConnectionState,
} from '@/store';
import { SetTimeComponent as SetTimeType } from '@/store';
import { dateStringWithTimeZone } from '@/utils/time';
import React, { useEffect, useState } from 'react';

interface SetTimeComponentProps {
  component: SetTimeType;
}

const SetTimeComponent: React.FC<SetTimeComponentProps> = ({ component }) => {
  function isDate(time: Date | string): boolean {
    return time instanceof Date;
  }

  const content: string = isDate(component?.time)
    ? (component?.time as Date).toUTCString()
    : (component?.time as string);

  const luaApi = useOpenSpaceApiStore((state) => state.luaApi);
  const time = usePropertyStore(
    (state) => state.properties['time']?.['timeCapped'],
  );
  const connectionState = useOpenSpaceApiStore(
    (state) => state.connectionState,
  );

  const subscribeToTopic = usePropertyStore((state) => state.subscribeToTopic);
  const unsubscribeFromTopic = usePropertyStore(
    (state) => state.unsubscribeFromTopic,
  );
  useEffect(() => {
    if (connectionState != ConnectionState.CONNECTED) return;
    subscribeToTopic('time');
    return () => {
      unsubscribeFromTopic('time');
    };
  }, [connectionState]);

  //   const goToTime = (time: Date, interpolate: boolean, intDuration: number) => {
  //     if (interpolate) {
  //       luaApi.time.interpolateTime(time, intDuration);
  //     } else {
  //       luaApi.time.set(time, intDuration);
  //     }
  //   };

  // Fadetime is in seconds
  async function jumpToTime(
    timeNow: Date,
    newTime: Date,
    interpolate: boolean,
    fadeTime: number,
  ) {
    // console.log(timeNow);
    // console.log(newTime);

    const timeDiffSeconds = Math.round(
      //@ts-ignore
      Math.abs(timeNow - new Date(newTime)) / 1000,
    );
    console.log(timeDiffSeconds);
    const diffBiggerThanADay = timeDiffSeconds > 86400; // No of seconds in a day
    if (diffBiggerThanADay && interpolate) {
      const promise = new Promise((resolve) => {
        luaApi.setPropertyValueSingle(
          'RenderEngine.BlackoutFactor',
          0,
          fadeTime,
          'QuadraticEaseOut',
        );
        setTimeout(() => resolve('done!'), fadeTime * 1000);
      });
      await promise;
      luaApi.time.setTime(newTime);
      luaApi.setPropertyValueSingle(
        'RenderEngine.BlackoutFactor',
        1,
        fadeTime,
        'QuadraticEaseIn',
      );
    } else if (!interpolate) {
      luaApi.time.setTime(newTime);
    } else {
      luaApi.time.interpolateTime(newTime, fadeTime);
    }
  }

  return (
    <div
      className="absolute right-0 top-0 flex h-full w-full flex-col items-center justify-center"
      onClick={() => {
        console.log('CLICK');
        jumpToTime(
          time,
          component.time as Date,
          component.interpolate,
          component.intDuration,
        );
      }}
    >
      <h1 className="text-2xl"> GO TO {content}</h1>
      <h2>Interpolate: {component.interpolate ? 'Yes' : 'No'}</h2>
      <h3>Duration: {component.intDuration}</h3>
    </div>
  );
};

interface SetTimeModalProps {
  component: SetTimeType | null;
  handleComponentData: (data: Partial<SetTimeType>) => void;
  isOpen: boolean;
}

const SetTimeModal: React.FC<SetTimeModalProps> = ({
  component,
  handleComponentData,
  isOpen,
}) => {
  const time = usePropertyStore(
    (state) => state.properties['time']?.['timeCapped'],
  );
  const [componentTime, setCompontentTime] = useState(component?.time || time);
  const [interpolate, setInterpolate] = useState(
    component?.interpolate || false,
  );
  const [intDuration, setIntDuration] = useState(component?.intDuration || 0);

  //   console.log(component);

  useEffect(() => {
    handleComponentData({ time: componentTime, interpolate, intDuration });
  }, [componentTime, interpolate, intDuration, handleComponentData]);

  //   useEffect(() => {
  //     if (component) {
  //       setText(component?.text);
  //     } else {
  //       setText('');
  //     }
  //   }, [component, setText]);

  //   useEffect(() => {
  //     if (!isOpen) {
  //       setText('');
  //     }
  //   }, [isOpen, setText]);

  return (
    <>
      <div className="mb-4">
        <div className="mb-1 block flex flex-col gap-4">
          {time && (
            <DateComponent
              date={componentTime}
              onChange={(data: any) => {
                console.log(data);
                setCompontentTime(data.time);
              }}
            />
          )}
          <button
            className="rounded bg-blue-500 p-2 text-white"
            onClick={() => {
              const newTime = new Date();
              console.log(newTime.toJSON());
              try {
                const fixedTimeString = newTime.toJSON().replace('Z', '');
                setCompontentTime(fixedTimeString);
                // luaApi.time.setTime(fixedTimeString);
              } catch {
                setCompontentTime(newTime);
                // luaApi.time.setTime(time);
              }
            }}
          >
            Set Time to Now
          </button>
          <div className="flex flex-row items-center justify-between">
            <div className="text-sm font-medium text-black">
              Interpolation Duration:
            </div>
            <input
              type="number"
              className="w-half rounded border p-2"
              value={intDuration}
              onChange={(e) => setIntDuration(parseInt(e.target.value))}
            />
          </div>
          <label className="flex cursor-pointer flex-row items-center items-center justify-between">
            <span className="text-sm font-medium text-black">Interpolate</span>
            <div className="flex flex-row items-center gap-2">
              <input
                type="checkbox"
                // value={sPresentMode}
                className="peer sr-only"
                onChange={() => setInterpolate(!interpolate)}
                checked={interpolate}
              />
              <div className="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
              <span className="mx-3 text-sm font-medium text-black">
                {interpolate ? 'on' : 'off'}
              </span>
            </div>
          </label>
        </div>
      </div>
    </>
  );
};

export { SetTimeModal, SetTimeComponent };