const dialogflow = require('@google-cloud/dialogflow').v2beta1;
const express = require("express");
const cors = require("cors");


const fs = require("fs");
const CREDENTIALS = JSON.parse(fs.readFileSync("service-account.json"));

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
  return {
    response: result.intent.displayName, // change the response here
  };
};

const chatbot = express();
chatbot.use(cors());

chatbot.use(
  express.urlencoded({
    extended: true,
  })
);
chatbot.use(express.json());

const PORT = process.env.PORT || 5000;

chatbot.listen(PORT, () => {
  console.log(`Server is up and running at ${PORT}`);
});

chatbot.get("/", (req, res) => {
  res.send(`Hello, this is LapTeller!`);
});

chatbot.post("/dialogflow", async (req, res) => {
  let languageCode = req.body.languageCode || "en";
  let queryText = req.body.queryText;
  let sessionId = req.body.sessionId || "lapteller-project";

  let responseData = await detectIntent(languageCode, queryText, sessionId);

  res.send(responseData.response);
});
