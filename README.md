# 1. DialogFlow Chatbot Intergration

A brief of step-by-step command lines to setup DialogFlow API using Node.js and Express.js
## 1.1. Set up project:

#### 1.1.1 Create Node.js modules:
```console
npm init
```
#### 1.1.2. Install Dialogflow API client for Node.js and Express.js:
```console
npm install @google-cloud/dialogflow express
```
## 1.2. Usage:
#### 1.2.1. Start Node.js server:
```console
node chatbot/handle-response.js
```
#### 1.2.2. Usage of the API:
Request endpoint (POST Method):
```yaml
http://localhost:5000/dialogflow
```
Request body:
```json
{
    "queryText":"Hello!"
}
```
