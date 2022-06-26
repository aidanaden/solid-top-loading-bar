// import type { Component } from 'solid-js';

// const App: Component = () => {
//   return (
//     <p class="text-4xl text-green-700 text-center py-20">Hello tailwind!</p>
//   );
// };

// export default App;

import {
  Component,
  createEffect,
  createSignal,
  JSX,
  mergeProps,
  onCleanup,
  onMount,
  Setter,
  on,
  createMemo,
} from "solid-js";
// import {
//   CSSProperties,
//   useEffect,
//   useState,
//   forwardRef,
//   useImperativeHandle,
//   useRef,
// } from "react";
import { useInterval } from "./useInterval";
import { randomInt } from "./utils";
// import { randomInt } from "./utils";

type IProps = {
  progress?: number;
  color?: string;
  shadow?: boolean;
  background?: string;
  height?: number;
  onLoaderFinished?: () => void;
  className?: string;
  containerClassName?: string;
  loaderSpeed?: number;
  transitionTime?: number;
  waitingTime?: number;
  style?: JSX.CSSProperties;
  containerStyle?: JSX.CSSProperties;
  shadowStyle?: JSX.CSSProperties;
};

export type LoadingBarRef = {
  continuousStart: (startingValue?: number, refreshRate?: number) => void;
  staticStart: (startingValue?: number) => void;
  complete: () => void;
};

type Props = {
  loadingBar?: LoadingBarRef;
  setLoadingBar?: Setter<LoadingBarRef>;
} & IProps;

const LoadingBar: Component<Props> = (_props) => {
  const defaultProps = {
    height: "2px",
    className: "",
    color: "red",
    background: "transparent",
    transitionTime: 300,
    loaderSpeed: 500,
    waitingTime: 1000,
    shadow: true,
    containerStyle: {},
    style: {},
    shadowStyle: {},
    containerClassName: "",
  };
  const props = mergeProps(defaultProps, _props);
  const color = createMemo(() => props.color);
  const loadingBar = createMemo(() => props.loadingBar);
  const progress = createMemo(() => props.progress);
  const shadow = createMemo(() => props.shadow);

  let isMounted = false;
  const [localProgress, setLocalProgress] = createSignal<number>(0);
  const [pressedContinuous, setPressedContinuous] = createSignal<{
    active: boolean;
    startingValue: number;
    refreshRate: number;
  }>({ active: false, startingValue: 20, refreshRate: 1000 });
  const [usingProps, setUsingProps] = createSignal(false);
  const continuousActive = createMemo(() => pressedContinuous().active);
  const continuousRefreshRate = createMemo(
    () => pressedContinuous().refreshRate
  );

  const [pressedStaticStart, setStaticStartPressed] = createSignal<{
    active: boolean;
    value: number;
  }>({ active: false, value: 20 });

  const initialLoaderStyle: JSX.CSSProperties = {
    height: "100%",
    background: color(),
    transition: `all ${props.loaderSpeed}ms ease`,
    width: "0%",
  };

  const loaderContainerStyle: JSX.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    height: props.height,
    background: props.background,
    zIndex: 99999999999,
    width: 100 + "%",
  };

  const initialShadowStyles: JSX.CSSProperties = {
    boxShadow: `0 0 10px ${color()}, 0 0 10px ${color()}`,
    width: "5%",
    opacity: 1,
    position: "absolute",
    height: "100%",
    transition: `all ${props.loaderSpeed}ms ease`,
    transform: "rotate(3deg) translate(0px, -4px)",
    left: "-10rem",
  };

  const [loaderStyle, setLoaderStyle] = createSignal(initialLoaderStyle);
  const [shadowStyle, setShadowStyle] = createSignal(initialShadowStyles);

  onMount(() => {
    isMounted = true;
    onCleanup(() => {
      isMounted = false;
    });
  });

  props.setLoadingBar?.({
    continuousStart(startingValue?: number, refreshRate: number = 1000) {
      if (pressedStaticStart().active) return;
      if (usingProps()) {
        console.warn(
          "react-top-loading-bar: You can't use both controlling by props and ref methods to control the bar!"
        );
        return;
      }
      const val = startingValue || randomInt(10, 20);
      const pressedContinuosValue = {
        active: true,
        refreshRate,
        startingValue,
      };
      setPressedContinuous(pressedContinuosValue);
      setLocalProgress(val);
      checkIfFull(val);
    },
    staticStart(startingValue?: number) {
      if (pressedContinuous().active) return;
      if (usingProps()) {
        console.warn(
          "react-top-loading-bar: You can't use both controlling by props and ref methods to control the bar!"
        );
        return;
      }
      const val = startingValue || randomInt(30, 50);
      setStaticStartPressed({
        active: true,
        value: val,
      });
      setLocalProgress(val);
      checkIfFull(val);
    },
    complete() {
      if (usingProps()) {
        console.warn(
          "react-top-loading-bar: You can't use both controlling by props and ref methods to control the bar!"
        );
        return;
      }
      setLocalProgress(100);
      checkIfFull(100);
    },
  });

  createEffect(
    on(color, (color) => {
      setLoaderStyle({
        ...loaderStyle(),
        background: color,
      });
      setShadowStyle({
        ...shadowStyle(),
        boxShadow: `0 0 10px ${color}, 0 0 5px ${color}`,
      });
    })
  );

  createEffect(
    on(progress, (progress) => {
      if (loadingBar()) {
        if (loadingBar() && progress !== undefined) {
          console.warn(
            'react-top-loading-bar: You can\'t use both controlling by props and ref methods to control the bar! Please use only props or only ref methods! Ref methods will override props if "ref" property is available.'
          );
          return;
        }
        checkIfFull(localProgress());
        setUsingProps(false);
      } else {
        if (progress) checkIfFull(progress);
        setUsingProps(true);
      }
    })
  );

  const checkIfFull = (_progress: number) => {
    if (_progress >= 100) {
      // now it should wait a little bit
      setLoaderStyle({
        ...loaderStyle(),
        width: "100%",
      });
      if (shadow()) {
        setShadowStyle({
          ...shadowStyle(),
          left: _progress - 10 + "%",
        });
      }
      setTimeout(() => {
        if (!isMounted) {
          return;
        }
        // now it can fade out
        setLoaderStyle({
          ...loaderStyle(),
          opacity: 0,
          width: "100%",
          transition: `all ${props.transitionTime}ms ease-out`,
          color: color(),
        });
        setTimeout(() => {
          if (!isMounted) {
            return;
          }
          // here we wait for it to fade
          if (pressedContinuous().active) {
            // if we have continous loader just ending, we kill it and reset it
            setPressedContinuous({
              ...pressedContinuous(),
              active: false,
            });
            setLocalProgress(0);
            checkIfFull(0);
          }
          if (pressedStaticStart().active) {
            setStaticStartPressed({
              ...pressedStaticStart(),
              active: false,
            });
            setLocalProgress(0);
            checkIfFull(0);
          }
          if (props.onLoaderFinished) props.onLoaderFinished();
          setLocalProgress(0);
          checkIfFull(0);
        }, props.transitionTime);
      }, props.waitingTime);
    } else {
      const widthStyleValue = _progress + "%";
      setLoaderStyle({
        ...loaderStyle(),
        width: widthStyleValue,
        opacity: 1,
        transition: _progress > 0 ? `all ${props.loaderSpeed}ms ease` : "",
      });
      if (shadow()) {
        setShadowStyle({
          ...shadowStyle(),
          left: _progress - 5.5 + "%",
          transition: _progress > 0 ? `all ${props.loaderSpeed}ms ease` : "",
        });
      }
    }
  };

  createEffect(
    on(continuousActive, (active) =>
      useInterval(
        () => {
          const random = randomInt(10, 20);

          if (localProgress() + random < 90) {
            setLocalProgress(localProgress() + random);
            checkIfFull(localProgress() + random);
          }
        },
        active ? continuousRefreshRate() : null
      )
    )
  );

  return (
    <div
      class={props.containerClassName}
      style={{
        ...loaderContainerStyle,
      }}
    >
      <div
        class={props.className}
        style={{
          ...loaderStyle(),
          ...props.style,
        }}
      >
        {shadow() ? <div style={{ ...shadowStyle() }} /> : null}
      </div>
    </div>
  );
};

export type { IProps };

export default LoadingBar;
