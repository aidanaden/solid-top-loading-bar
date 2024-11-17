// ported from voby https://github.com/vobyjs/voby/blob/master/src/hooks/use_scheduler.ts
import { Accessor } from "solid-js";

type FN<Arguments extends unknown[], Return extends unknown = void> = (
  ...args: Arguments
) => Return;
function isFunction(value: unknown): value is (...args: unknown[]) => unknown {
  return typeof value === "function";
}

type MaybeAccessor<T = unknown> = Accessor<T> | T;
function unwrap<T>(maybeValue: MaybeAccessor<T>): T {
  return isFunction(maybeValue) ? maybeValue() : maybeValue;
}

/**
 * Function that runs a given `callback` using a given `schedule` and `cancel` function.
 *
 * @argument callback - function to run according to a schedule specified by the `schedule` function parameter provided
 * @argument schedule - function that determines when the given `callback` function should run
 * @argument loop - boolean to indicate if `callback` fn should be run in a loop
 */
export function createScheduler<T, U>({
  loop,
  callback,
  cancel,
  schedule,
}: {
  loop?: MaybeAccessor<boolean>;
  callback: MaybeAccessor<FN<[U]>>;
  cancel: FN<[T]>;
  schedule: (callback: FN<[U]>) => T;
  interval?: number;
}): () => void {
  let tickId: T;

  function tick(): void {
    tickId = schedule(work);
  }

  function work(): void {
    const shouldLoop = unwrap(loop);
    if (shouldLoop) {
      tick();
    }
    unwrap(callback);
  }

  function dispose(): void {
    cancel(tickId);
  }

  tick();
  return dispose;
}

export function createAnimationLoop(callback: FrameRequestCallback) {
  if (isSSR()) {
    return;
  }
  return createScheduler({
    callback,
    schedule: requestAnimationFrame,
    cancel: cancelAnimationFrame,
    loop: true,
  });
}

export function isSSR(): boolean {
  return "SSR" in import.meta.env && !!import.meta.env.SSR;
}

/**
 * Generate random number between `min` and `max`
 */
export function randomInt(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
