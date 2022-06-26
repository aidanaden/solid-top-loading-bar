# solid-top-loading-bar

>

[![NPM](https://img.shields.io/npm/v/solid-top-loading-bar.svg)](https://www.npmjs.com/package/solid-top-loading-bar) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![npm download][download-image]][download-url]

[download-image]: https://img.shields.io/npm/dm/solid-top-loading-bar.svg
[download-url]: https://npmjs.org/package/solid-top-loading-bar

[![solid-top-loading-bar](https://nodei.co/npm/solid-top-loading-bar.png)](https://npmjs.org/package/solid-top-loading-bar)

## Install

- using npm

```bash
npm install --save solid-top-loading-bar
```

- using yarn

```bash
yarn add solid-top-loading-bar
```

- CDN

```
https://unpkg.com/solid-top-loading-bar
```

## Usage

### With ref

```jsx
import LoadingBar, { LoadingBarRef } from "solid-top-loading-bar";

const App = () => {
  const [loadingBar, setLoadingBar] = createSignal<LoadingBarRef>()

  return (
    <div>
      <LoadingBar color="#f11946" loadingBar={loadingBar()} setLoadingBar={setLoadingBar} />
      <button onClick={() => loadingBar()?.continuousStart()}>
        Start Continuous Loading Bar
      </button>
      <button onClick={() => loadingBar()?.staticStart()}>
        Start Static Loading Bar
      </button>
      <button onClick={() => loadingBar()?.complete()}>Complete</button>
      <br />
    </div>
  );
};

export default App;
```

### With state

```jsx
import { createSignal } from "solid";
import LoadingBar from "solid-top-loading-bar";

const App = () => {
  const [progress, setProgress] = createSignal(0);

  return (
    <div>
      <LoadingBar
        color="#f11946"
        progress={progress()}
        onLoaderFinished={() => setProgress(0)}
      />
      <button onClick={() => setProgress((p) => p + 10)}>Add 10%</button>
      <button onClick={() => setProgress((p) => p + 20)}>Add 20%</button>
      <button onClick={() => setProgress(100)}>Complete</button>
      <br />
    </div>
  );
};

export default App;
```

## Demo

[Click here for demo](https://solid-top-loading-bar.vercel.app/)

## Built-in Methods

| Methods                                     |             Parameters              | Descriptions                                                                                                                                                                                                                |
| ------------------------------------------- | :---------------------------------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| add(value)                                  |               Number                | Adds a value to the loading indicator.                                                                                                                                                                                      |
| decrease(value)                             |               Number                | Decreases a value to the loading indicator.                                                                                                                                                                                 |
| continuousStart(startingValue, refreshRate) | Number (optional), Number(optional) | Starts the loading indicator with a random starting value between 20-30, then repetitively after an refreshRate, increases it by a random value between 2-10. This continues until it reaches 90% of the indicator's width. |
| staticStart(startingValue)                  |          Number (optional)          | Starts the loading indicator with a random starting value between 30-50.                                                                                                                                                    |
| complete()                                  |                                     | Makes the loading indicator reach 100% of his width and then fade.                                                                                                                                                          |

## Properties

| Property           | Type          | Default | Description                                                                                                                       |
| :----------------- | :------------ | :------ | :-------------------------------------------------------------------------------------------------------------------------------- |
| progress           | Number        | `0`     | The progress/width indicator, progress prop varies from `0` to `100`.                                                             |
| color              | String        | `red`   | The color of the loading bar, color take values like css property `background:` do, for example `red`, `#000` `rgb(255,0,0)` etc. |
| shadow             | Boolean       | `true`  | Enables / Disables shadow underneath the loader.                                                                                  |
| height             | Number        | `2`     | The height of the loading bar in pixels.                                                                                          |
| background         | String        | `3`     | The loader parent background color.                                                                                               |
| style              | CSSProperties |         | The style attribute to loader's div                                                                                               |
| containerStyle     | CSSProperties |         | The style attribute to loader's container                                                                                         |
| shadowStyle        | CSSProperties |         | The style attribute to loader's shadow                                                                                            |
| transitionTime     | Number        | `300`   | Fade transition time in miliseconds.                                                                                              |
| loaderSpeed        | Number        | `500`   | Loader transition speed in miliseconds.                                                                                           |
| waitingTime        | Number        | `1000`  | The delay we wait when bar reaches 100% before we proceed fading the loader out.                                                  |
| className          | String        |         | You can provide a class you'd like to add to the loading bar to add some styles to it                                             |
| containerClassName | String        |         | You can provide a class you'd like to add to the loading bar container to add some css styles                                     |
| onLoaderFinished   | Function      |         | This is called when the loading bar completes, reaches 100% of his width.                                                         |

## Projects using solid-top-loading-bar

Add your own project. Make a PR

## Code Style

[![js-standard-style](https://cdn.rawgit.com/standard/standard/master/badge.svg)](http://standardjs.com)

## License

MIT © aidanaden
