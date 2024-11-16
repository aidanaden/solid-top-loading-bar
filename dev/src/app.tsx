import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";

import Nav from "~/components/Nav";
import "./app.css";
import { InfinitePageLoader } from "./components/InfiniteLoadingBar";

export default function App() {
  return (
    <Router
      root={(props) => (
        <>
          <InfinitePageLoader />
          <Nav />
          <Suspense>{props.children}</Suspense>
        </>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
