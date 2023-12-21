# 1. LapTeller Backend Intergration Guidance

A brief of step-by-step command lines to setup DialogFlow API using Node.js and Express.js
## 1.1. Set up project:
Download and install Node.js modules.
```console
npm i
```
## 1.2. Usage:
#### 1.2.1. Start Node.js server:
```console
node gemini-pro/gemini.js
```
#### 1.2.2. Usage of the API:
Endpoint:
```yaml
POST http://localhost:5000/ask
```
Request body:
```json
{
    "question" : "Hello!"
}
```
