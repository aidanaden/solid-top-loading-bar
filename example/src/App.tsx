import { createEffect, createSignal, Show } from "solid-js";

import LoadingBar, { LoadingBarRef } from "solid-top-loading-bar";
import "./index.css";
import { changeColor } from "./changeColor";

const App = () => {
  const [progress, setProgress] = createSignal(0);
  const [barColor, setBarColor] = createSignal("#f11946");
  const [buttonsColor, setButtonsColor] = createSignal("red");
  const [loadingBar, setLoadingBar] = createSignal<LoadingBarRef>();
  const [usingRef, setUsingRef] = createSignal(false);

  const saveToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      window.alert("Copied To Clipboard");
    });
  };

  const changeMode = (refMode: boolean) => {
    if (refMode) {
      setProgress(0);
    }
    setUsingRef(refMode);
  };

  return (
    <div>
      <Show
        when={usingRef()}
        fallback={
          <LoadingBar
            color={barColor()}
            progress={progress()}
            onLoaderFinished={() => setProgress(0)}
          />
        }
      >
        <LoadingBar
          color={barColor()}
          shadow={true}
          loadingBar={loadingBar()}
          setLoadingBar={setLoadingBar}
        />
      </Show>
      <div class="text-container">
        <h1 class="header">solid-top-loading-bar</h1>
        <div class="inline">
          <code
            class="package-install-text"
            onClick={() => saveToClipboard("npm i solid-top-loading-bar")}
          >
            npm i solid-top-loading-bar
          </code>
          <br />
          or
          <br />
          <code
            class="package-install-text"
            onClick={() => saveToClipboard("yarn add solid-top-loading-bar")}
          >
            yarn add solid-top-loading-bar
          </code>
        </div>
      </div>
      <div class="buttons-group">
        <code class="code-highlighter">
          {usingRef()
            ? `const [loadingBar, setLoadingBar] = createSignal();\n<LoadingBar color={barColor} loadingBar={loadingBar()} setLoadingBar={setLoadingBar} />\nloadingBar().continuousStart()`
            : `const [progress, setProgress] = createSignal(0);\n<LoadingBar color={barColor} progress={progress()}
    onLoaderFinished={() => setProgress(100)} />`}
        </code>
        <br />
        <br />
        {usingRef() ? (
          <div>
            <button
              class={"btn " + buttonsColor()}
              onClick={() => loadingBar()?.continuousStart()}
            >
              Start Continuous Loading Bar
            </button>
            <button
              class={"btn " + buttonsColor()}
              onClick={() => loadingBar()?.staticStart()}
            >
              Start Static Loading Bar
            </button>
            <button
              class={"btn " + buttonsColor()}
              onClick={() => loadingBar()?.complete()}
            >
              Complete
            </button>
            <br />
          </div>
        ) : (
          <div>
            <button
              class={"btn " + buttonsColor()}
              onClick={() => setProgress((prog) => prog + 10)}
            >
              Add 10%
            </button>
            <button
              class={"btn " + buttonsColor()}
              onClick={() => setProgress((prog) => prog + 30)}
            >
              Add 30%
            </button>
            <button
              class={"btn " + buttonsColor()}
              onClick={() => setProgress((prog) => prog + 50)}
            >
              Add 50%
            </button>

            <br />
          </div>
        )}
        <button
          class={"btn " + buttonsColor()}
          onClick={() => {
            const colors = changeColor(buttonsColor());
            setBarColor(colors.barColor);
            setButtonsColor(colors.color);
          }}
        >
          Change Color
        </button>
        <button
          class={"btn " + buttonsColor()}
          onClick={() => changeMode(!usingRef())}
        >
          Change to {usingRef() ? "State" : "Refs"} Mode
        </button>
        <br />
        <br />
        <div class="github-buttons">
          <a
            class="github-button"
            href="https://github.com/aidanaden/solid-top-loading-bar"
            data-color-scheme="no-preference: light; light: light; dark: dark;"
            data-size="large"
            data-show-count="true"
            aria-label="Star klendi/react-top-loading-bar on GitHub"
          >
            Star library
          </a>{" "}
          -{" "}
          <a
            class="github-button"
            href="https://github.com/aidanden"
            data-color-scheme="no-preference: light; light: light; dark: dark;"
            data-size="large"
            data-show-count="true"
            aria-label="Follow @aidanaden on GitHub"
          >
            Follow @aidanaden
          </a>
        </div>
        <br />
        <div></div>
        <div>
          Ported to Solid by{" "}
          <a
            href="https://github.com/aidanaden"
            style={{ color: barColor() }}
            target="_blank"
          >
            aidanaden
          </a>
        </div>
        <br />
        <div>
          <a
            href="https://github.com/klendi/react-top-loading-bar"
            style={{ "text-decoration-underline": "underline" }}
            target="_blank"
          >
            Original react library by{" "}
          </a>
          <a
            href="https://klendi.dev"
            style={{ color: barColor() }}
            target="_blank"
          >
            Klendi Gocci
          </a>
        </div>
      </div>
    </div>
  );
};

export default App;
