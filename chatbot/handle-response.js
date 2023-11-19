const dialogflow = require('@google-cloud/dialogflow').v2beta1;
require("dotenv").config();
const express = require("express");
const cors = require("cors");


const fs = require("fs");
const CREDENTIALS = JSON.parse(fs.readFileSync("chatbot/service-account.json"));

const PROJECID = CREDENTIALS.project_id;

const CONFIGURATION = {
  credentials: {
    private_key: CREDENTIALS["private_key"],
    client_email: CREDENTIALS["client_email"],
  },
}; 

const sessionClient = new dialogflow.SessionsClient(CONFIGURATION);

const detectIntent = async (languageCode, queryText, sessionId) => {
  let sessionPath = sessionClient.projectAgentSessionPath(PROJECID, sessionId);

  let request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: queryText,
        languageCode: languageCode,
      },
    },
  };

  const responses = await sessionClient.detectIntent(request);
  const result = responses[0].queryResult;
  console.log(result);
  return {
    response: result.fulfillmentText.trim(), // change the response here
  };
};

const webApp = express();
webApp.use(cors());

webApp.use(
  express.urlencoded({
    extended: true,
  })
);
webApp.use(express.json());

const PORT = process.env.PORT || 5000;

webApp.listen(PORT, () => {
  console.log(`Server is up and running at ${PORT}`);
});

webApp.get("/", (req, res) => {
  res.send(`Hello, this is LapTeller!`);
});

// Dialogflow route
webApp.post("/dialogflow", async (req, res) => {
  let languageCode = req.body.languageCode || "en";
  let queryText = req.body.queryText;
  let sessionId = req.body.sessionId || "lapteller-project";

  let responseData = await detectIntent(languageCode, queryText, sessionId);

  res.send(responseData.response);
});
