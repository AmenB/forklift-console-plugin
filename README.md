# virt-ui

OpenShift VM Migration UI

## TODO: replace patternfly-react-seed readme contents with a real readme

---

# Patternfly Seed

Patternfly Seed is an open source build scaffolding utility for web apps. The primary purpose of this project is to give developers a jump start when creating new projects that will use patternfly. A secondary purpose of this project is to serve as a reference for how to configure various aspects of an application that uses patternfly, webpack, react, typescript, etc.

Out of the box you'll get an app layout with chrome (header/sidebar), routing, build pipeline, test suite, and some code quality tools. Basically, all the essentials.

<img width="1058" alt="Out of box dashboard view of patternfly seed" src="https://user-images.githubusercontent.com/5942899/82119580-b4cf9380-974d-11ea-9f13-fa10471c5c73.png">

## Quick-start

```bash
git clone https://github.com/patternfly/patternfly-react-seed
cd patternfly-react-seed
yarn install && yarn start:dev
```

## Development Scripts

```sh
# Install development/build dependencies
yarn install

# Start the development server
yarn start:dev

# Run a production build (outputs to "dist" dir)
yarn build

# Run the test suite
yarn test

# Run the linter
yarn lint

# Run the code formatter
yarn format

# Launch a tool to inspect the bundle size
yarn bundle-profile:analyze

# Start the express server (run a production build first)
yarn start
```

## Configurations

- [TypeScript Config](./tsconfig.json)
- [Webpack Config](./webpack.common.js)
- [Jest Config](./jest.config.js)
- [Editor Config](./.editorconfig)

## Raster Image Support

To use an image asset that's shipped with PatternFly core, you'll prefix the paths with "@assets". `@assets` is an alias for the PatternFly assets directory in node_modules.

For example:

```js
import imgSrc from '@assets/images/g_sizing.png';
<img src={imgSrc} alt="Some image" />;
```

You can use a similar technique to import assets from your local app, just prefix the paths with "@app". `@app` is an alias for the main src/app directory.

```js
import loader from '@app/assets/images/loader.gif';
<img src={loader} alt="Content loading />
```

## Vector Image Support

Inlining SVG in the app's markup is also possible.

```js
import logo from '@app/assets/images/logo.svg';
<span dangerouslySetInnerHTML={{ __html: logo }} />;
```

You can also use SVG when applying background images with CSS. To do this, your SVG's must live under a `bgimages` directory (this directory name is configurable in [webpack.common.js](./webpack.common.js#L5)). This is necessary because you may need to use SVG's in several other context (inline images, fonts, icons, etc.) and so we need to be able to differentiate between these usages so the appropriate loader is invoked.

```css
body {
  background: url(./assets/bgimages/img_avatar.svg);
}
```

## Code Quality Tools

- For accessibility compliance, we use [react-axe](https://github.com/dequelabs/react-axe)
- To keep our bundle size in check, we use [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)
- To keep our code formatting in check, we use [prettier](https://github.com/prettier/prettier)
- To keep our code logic and test coverage in check, we use [jest](https://github.com/facebook/jest)
- To ensure code styles remain consistent, we use [eslint](https://eslint.org/)

## Multi environment configuration

This project uses [dotenv-webpack](https://www.npmjs.com/package/dotenv-webpack) for exposing environment variables to your code. Either export them at the system level like `export MY_ENV_VAR=http://dev.myendpoint.com && yarn start:dev` or simply drop a `.env` file in the root that contains your key-value pairs like below:

```sh
ENV_1=http://1.myendpoint.com
ENV_2=http://2.myendpoint.com
```

With that in place, you can use the values in your code like `console.log(process.env.ENV_1);`
