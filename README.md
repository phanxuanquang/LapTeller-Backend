# 1. DialogFlow Chatbot Intergration

A brief of step-by-step command lines to setup DialogFlow API using Node.js and Express.js
## 1.1. Set up project:

#### 1.1.1 Create Node.js modules:
```
npm init
```
#### 1.1.2. Install Dialogflow API client for Node.js and Express.js:
```
npm install @google-cloud/dialogflow express dotenv --save
```
## 1.2. Usage:
#### 1.2.1. Start Node.js server:
```
node chatbot/handle-response.js
```
#### 1.2.2. Usage of the API:
Request endpoint (POST Method):
```
http://localhost:5000/dialogflow
```
Request body:
```
{
    "queryText":"Hello!"
}
```
