import {
  batch,
  Component,
  ComponentProps,
  createSignal,
  onCleanup,
  splitProps,
} from "solid-js";
import { Portal } from "solid-js/web";

import { createAnimationLoop, isSSR, randomInt } from "./utils";

export const DEFAULT_TRANSITION_DURATION = 500;

type LoadingBarState = {
  defaultDuration: number;
  duration: number;
  width: number;
  active: boolean;
};

const [state, setState] = createSignal<LoadingBarState>({
  duration: DEFAULT_TRANSITION_DURATION,
  defaultDuration: DEFAULT_TRANSITION_DURATION,
  width: 0,
  active: false,
});
const [opacity, setOpacity] = createSignal<number>(0);

export function setProgress(progress: number) {
  setState((state) => ({
    ...state,
    width: progress,
  }));
}

type Dispose = (() => void) | undefined;
const timers: Dispose[] = [];

function clearTimers() {
  while (timers.length > 0) {
    const dispose = timers.pop();
    dispose?.();
  }
}

const MAX_INTERVAL = 80;

/**
 * Iteration 1: starting width: 7, max increment: 0.7125
 * Iteration 2: starting width: 7.7125, max increment: 0.7035
 * Iteration 3: starting width: 8.416, max increment: 0.6948
 *
 */
export async function startLoadingBar() {
  if (isSSR()) {
    return;
  }
  clearTimers();
  batch(() => {
    setOpacity(1);
    setProgress(7);
  });
  const timer = createAnimationLoop(() => {
    const limit = 0.8 - state().width / MAX_INTERVAL;
    let num = limit;
    // Current width has overshot, stop incrementing width
    // By default, this happens once width = 64% (64/80 = 0.8)
    if (limit < 0) {
      timer?.();
      num = 0;
    }
    const random = randomInt(num * 0.8, num);
    setProgress(state().width + random);
  });
  timers.push(timer);
}

export const endLoadingBar = () => {
  if (isSSR()) {
    return;
  }

  setProgress(100);
  const start = new Date().getTime();
  const timer = createAnimationLoop(() => {
    const current = new Date().getTime();
    if (current - start <= 200) {
      return;
    }
    // After 200ms, begin reducing opacity over 100 fps (1/0.01 = 100)
    // Note: `requestAnimationFrame` runs 1 fps
    if (opacity() > 0) {
      setOpacity((opacity) => opacity - 0.01);
    } else {
      clearTimers();
    }
  });
  timers.push(timer);
};

export const LoadingBar: Component<ComponentProps<"div">> = (props) => {
  const [local, rest] = splitProps(props, ["style"]);
  onCleanup(clearTimers);
  return (
    <Portal>
      <div
        id="loading-bar"
        class="bg-lime-300"
        style={{
          background: "red",
          position: "fixed",
          top: 0,
          left: 0,
          "z-index": 50,
          height: "4px",
          transition: "all",
          animation: "ease-out",
          "transition-duration": "50ms",
          opacity: opacity(),
          width: `${state().width}%`,
          ...(typeof local.style === "object" ? local.style : {}),
        }}
        {...rest}
      />
    </Portal>
  );
};
