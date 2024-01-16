**© 2023 University of Information Technology / LapTeller Project**
------------
![alt text](https://i.imgur.com/pXOoTDe.jpeg)
## 0. Our team:
| NO. | NAME | RESPONSIBILITY |
| --- | --- | --- |
| 1 | [Phan Xuan Quang](https://github.com/phanxuanquang "Phan Xuân Quang") | Backend Development, AI Model Fine-Tuning, DevOps |
| 2 | [Bui Minh Tuan](https://github.com/tuan20520342 "Bùi Minh Tuấn") | Web Application Development |
| 3 | [Din Hien Dung](https://github.com/dung-ovl "Dín Hiền Dũng") | Mobile Application Development |
## 1. Overview
### 1.1. The use cases:
### 1.2. Our solution:
## 2. Re-building Guidance
A brief of step-by-step command lines to re-build LapTeller project.
### 2.1. Set up project:

Step 1. Install Node.js and npm (skip if you had it already):

- [**Node.js**](https://nodejs.org/en/download/package-manager)
- [**npm**](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

Step 2: Clone repository for backend.
```console
git clone https://github.com/phanxuanquang/LapTeller-Backend
```

Step 2: Clone sub-module for frontend.
```console
cd LapTeller-Backend
```
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
### 2.2. Usage:
##### 2.2.1. Start Node.js server:
```console
node gemini-pro/gemini.js
```
##### 2.2.1. Start React application:
```console
cd lapteller
```
```console
npm start
```
