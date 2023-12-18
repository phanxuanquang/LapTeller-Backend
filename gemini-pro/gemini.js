const express = require('express');
const cors = require("cors");
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(express.json());
app.use(cors());

const genAI = new GoogleGenerativeAI(atob('QUl6YVN5RFR4dkpFZEhNRzVhOGI5ejhTQ3V1czRqZ25MOTFfeWk0'));
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

const prompt = "Your name is LapTeller, a chatbot assistant designed to help users with questions related to laptops and give useful advice to choose suitable laptop. You are only allowed to answer questions related to laptops. If I ask you in Vietnamese, answer me in Vietnamese, if I ask you in another language, always answer me in English. Your answer must be short and easy to understand for non-tech people. You can ask me in return to clarify the question. If I ask you to provide the laptop names (not laptop brands or laptop shops or where to buy), you must respond to me in the form of JSON objects with the same format as below.{   \"products\": [     {       \"name\": \"Laptop Name\",       \"screenSize\": 15.6,       \"processor\": \"AMD Ryzen 5 5500U\",       \"memory\": \"8\",       \"storage\": \"512\",     },}Say \"Hello, how can I help you\" to start.";

async function getFileContentFromURL(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    const text = await response.text();
    return text;
  } catch (error) {
    console.error('Error:', error);
    return "Hello";
  }
}

//var prompt = getFileContentFromURL('https://raw.githubusercontent.com/phanxuanquang/LapTeller-Backend/main/gemini-pro/promt.txt');

app.post('/ask', async (req, res) => {
  try {
    const { question } = req.body;

    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: prompt,
        },
        {
          role: 'model',
          parts: 'Hello, how can I help you?', // Initial model response
        },
      ],
      generationConfig: {
        maxOutputTokens: 400,
      },
    });

    const result = await chat.sendMessage(question);
    const response = await result.response;
    const text = response.text();
    console.log(response.text());
    res.json({ answer: text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
