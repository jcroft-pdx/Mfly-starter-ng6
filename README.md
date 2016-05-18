<p align="center">
  <img src="https://cloud.githubusercontent.com/assets/1016365/9864650/93a5660a-5b00-11e5-8716-a0d538d12913.png" alt="ng6-starter" width="480px;" >
</p>

> The de facto starter repo for building scalable apps with [Angular](https://angularjs.org), [ES6](https://git.io/es6features), and [Webpack](http://webpack.github.io/)

This repo serves as a minimal starter for those looking to get up-and-running with Angular and ES6, using [Gulp](http://gulpjs.com/) and [Webpack](http://webpack.github.io/) for the build process.
**This seed is not a Yeoman generator.** It's a minimal starter with tasks for building the boilerplate. **These are its features**:
* The best practice in directory/file organization for Angular (allowing for infinite horizontal app scaling)
* A ready-to-go build system for working with [ES6](https://git.io/es6features)
* Tasks for generating additional boilerplate Angular components
* A full testing system in place
* SASS support

___

# Table of Contents
* [Walkthrough](#walkthrough)
    * [Build System](#build-system)
    * [File Structure](#file-structure)
    * [Testing Setup](#testing-setup)
* [Getting Started](#getting-started)
    * [Dependencies](#dependencies)
    * [Installing](#installing)
    * [Running the App](#running-the-app)
        * [Gulp Tasks](#gulp-tasks)
        * [Testing](#testing)
    * [Generating Components](#generating-components)
* [Starter Kit Support and Questions](#starter-kit-support-and-questions)

# Walkthrough
## Build System
NG6 uses Gulp and Webpack together for its build system. Yes, you don't need Gulp if you're using Webpack. This is true if your build system is only responsible for file manipulation. However, ours is not.

`Webpack` handles all file-related concerns:
* Transpiling from ES6 to ES5 with `Babel`
* Loading HTML files as modules
* Transpiling stylesheets and appending them to the DOM
* Refreshing the browser and rebuilding on file changes
* Hot module replacement for transpiled stylesheets
* Bundling the app
* Loading all modules
* Doing all of the above for `*.spec.js` files as well

`Gulp` is the orchestrator:
* Starting and calling Webpack
* Starting a development server (yes, Webpack can do this too)
* Generating boilerplate for the Angular app

**Check out the [JSPM version](https://github.com/angularclass/NG6-starter/tree/jspm)--an alternative to Webpack as an ES6 build system.**

## File Structure
We use a componentized approach with NG6. This will be the eventual standard (and particularly helpful, if using Angular's new router) as well as a great way to ensure a tasteful transition to Angular 2, when the time is ripe. Everything--or mostly everything, as we'll explore (below)--is a component. A component is a self-contained concern--may it be a feature or strictly-defined, ever-present element of the UI (such as a header, sidebar, or footer). Also characteristic of a component is that it harnesses its own stylesheets, templates, controllers, routes, services, and specs. This encapsulation allows us the comfort of isolation and structural locality. Here's how it looks:
```
client
⋅⋅app/
⋅⋅⋅⋅app.component.js * app component definition
⋅⋅⋅⋅app.config.js * global CONFIG service
⋅⋅⋅⋅app.controller.js * central app controller for app component
⋅⋅⋅⋅app.js * app entry file
⋅⋅⋅⋅app.html * app template
⋅⋅⋅⋅app.scss * general app styles, central SASS includes
⋅⋅⋅⋅app.service.js * baseline Angular app service
⋅⋅⋅⋅assets * for static assets like images and fonts
⋅⋅⋅⋅classes * a place for es6 interfaces you might want to extend in your controller or service classes
⋅⋅⋅⋅components/ * functionality pertinent to several components propagate into this directory
⋅⋅⋅⋅⋅⋅components.js * components entry file
⋅⋅⋅⋅⋅⋅common/ * where non page, reused components live
⋅⋅⋅⋅⋅⋅pages/ * where page components live
⋅⋅⋅⋅⋅⋅⋅⋅home/ * home component
⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅home.js * home entry file (routes, configurations, and declarations occur here)
⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅home.component.js * home "directive"
⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅home.controller.js * home controller
⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅home.scss * home styles
⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅home.html * home template
⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅home.spec.js * home specs (for entry, component, and controller)
⋅⋅⋅⋅directives/ * where angular directives live
⋅⋅⋅⋅styles/ * a place for global stylesheets.
```

## Testing Setup
All tests are also written in ES6. We use Webpack to take care of the logistics of getting those files to run in the various browsers, just like with our client files. This is our testing stack:
* Karma
* Webpack + Babel
* Mocha
* Chai

To run tests, type `npm test` or `karma start` in the terminal. Read more about testing [below](#testing).

# Getting Started
## Dependencies
Tools needed to run this app:
* `node` and `npm`
Once you have these, install the following as globals:
`npm install -g gulp karma karma-cli webpack`

## Installing
* `fork` this repo
* `clone` your fork
* `npm install -g gulp karma karma-cli webpack` install global cli dependencies
* `npm install` to install dependencies

## Running the App
NG6 uses Gulp to build and launch the development environment. After you have installed all dependencies, you may run the app. Running `gulp` will bundle the app with `webpack`, launch a development server, and watch all files. The port will be displayed in the terminal.

### Gulp Tasks
Here's a list of available tasks:
 - `webpack`
 - `build`
 --- runs Webpack, which will transpile, concatenate, and compress (collectively, "bundle") all assets and modules into `dist/bundle.js`. It also prepares `index.html` to be used as application entry point, links assets and created dist version of our application. Takes an argument `--target` which can be any one of `dev|qa|prod` which will pull in different configuration based on the target environment for testing a compiled version of the application.
 - `serve`
 --- starts a dev server via `webpack-dev-server`, serving the client folder.
 - `watch`
 --- alias of `serve`
 - `default` (which is the default task that runs when typing `gulp` without providing an argument)
--- runs `serve`.
 - `component`
 - `common`
 - `page`
 - `directive`
 --- scaffolds a new Angular component, page or directive. [Read below](#generating-components) for usage details.

### Testing
To run the tests, run `npm test` or `karma start`.

`Karma` combined with Webpack runs all files matching `*.spec.js` inside the `app` folder. This allows us to keep test files local to the component--which keeps us in good faith with continuing to build our app modularly. The file `spec.bundle.js` is the bundle file for **all** our spec files that Karma will run.

Be sure to define your `*.spec.js` files within their corresponding component directory. You must name the spec file like so, `[name].spec.js`. If you don't want to use the `.spec.js` suffix, you must change the `regex` in `spec.bundle.js` to look for whatever file(s) you want.
`Mocha` is the testing suite and `Chai` is the assertion library. If you would like to change this, see `karma.conf.js`.

### Generating Components
Following a consistent directory structure between components offers us the certainty of predictability. We can take advantage of this certainty by creating a gulp task to automate the "instantiation" of our components.

There are three supported boilerplate generators in this repo:

`gulp component --name myCommonlyUsedComponent`
--- For components that are reused throughout the application as building blocks. Also can be used as `gulp common` (to match the name of the folder the output goes into)

`gulp page --name myPageName`
--- For components that are routable pages

`gulp directive --name myAttributeName`
--- For generating an Angular attribute based directive

These boilerplate generators build differing output based on which one you use and they each place their output in a corresponding folder:

* component|common - `client/app/components/common`
* page - `client/app/components/pages`
* directive - `client/app/directives`

You can override the containing folder for the boilerplate pod by specifying `--parent` when running the generator, but this is not recommended.

For example, running `gulp component --name signup --parent auth` will create a `signup` component at `client/app/components/common/auth/signup`.

Because the argument to `--name` applies to the folder name **and** the actual component name, make sure to camelCase the component names.

Any components you add will need to be made available to Angular by editing the corresponding .js file at the root of each container folder -- by importing the component and adding it to the angular.module export.
