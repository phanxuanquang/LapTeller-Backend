# LapTeller Building Guidance

A brief of step-by-step command lines to re-build LapTeller project.
## 1.1. Set up project:

Step 1. Install Node.js and npm (skip if you had it already):

- [**Node.js**](https://nodejs.org/en/download/package-manager)
- [**npm**](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

Step 2: Clone sub-module for frontend.
```console
git submodule update --init --recursive
```

Step 3: Install Node.js modules for backend project.
```console
npm i
```

Step 4: Install Node.js modules for frontend project.
```console
cd lapteller
```
```console
npm i
```
## 1.2. Usage:
#### 1.2.1. Start Node.js server:
```console
node gemini-pro/gemini.js
```
#### 1.2.1. Start React application:
```console
cd lapteller
```
```console
npm start
```
