// ported from https://github.com/klendi/react-top-loading-bar/blob/master/src/useInterval.ts

import { createEffect, onCleanup, on, createMemo } from "solid-js";

export function useInterval(
  fn: () => void,
  delay: number | null | false,
  immediate?: boolean
) {
  let savedFunction;
  const immediateValue = createMemo(() => immediate);
  const delayValue = createMemo(() => delay);

  // Remember the latest function.
  createEffect(() => {
    savedFunction = fn;
  });

  // Execute callback if immediate is set.
  createEffect(
    on(immediateValue, (immediate) => {
      if (!immediate) return;
      if (delay === null || delay === false) return;
      savedFunction();
    })
  );

  // Set up the interval.
  createEffect(
    on(delayValue, (delay) => {
      if (delay === null || delay === false) {
        return undefined;
      }
      const tick = () => savedFunction();
      const id = setInterval(tick, delay);
      onCleanup(() => {
        clearInterval(id);
      });
    })
  );
}

export default useInterval;
