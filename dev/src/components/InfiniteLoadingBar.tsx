import { useIsRouting } from "@solidjs/router";
import { Component, createEffect, on } from "solid-js";

import { LoadingBar, startLoadingBar, endLoadingBar } from "../../../src/";

export const InfinitePageLoader: Component = () => {
  const isRouting = useIsRouting();
  createEffect(
    on(isRouting, (isRouting) => {
      if (isRouting) {
        startLoadingBar();
      } else {
        endLoadingBar();
      }
    }),
  );
  return <LoadingBar />;
};
