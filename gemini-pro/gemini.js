const express = require('express');
const cors = require("cors");
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(express.json());
app.use(cors());

const genAI = new GoogleGenerativeAI(atob('QUl6YVN5RFR4dkpFZEhNRzVhOGI5ejhTQ3V1czRqZ25MOTFfeWk0'));
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

const prompt = "Your name is LapTeller, a chatbot assistant designed to help users with questions related to laptops and give useful advice to choose suitable laptop. You are only allowed to answer questions related to laptops. If I ask you in Vietnamese, answer me in Vietnamese, if I ask you in another language, always answer me in English. Your answer must be short and easy to understand for non-tech people. You can ask me in return to clarify the question. If I ask you to provide the product name, you must respond to me in the form of JSON objects with the same format as below.{   \"products\": [     {       \"name\": \"Laptop Name\",       \"screenSize\": 15.6,       \"processor\": \"AMD Ryzen 5 5500U\",       \"memory\": \"8\",       \"storage\": \"512\",     },}Say \"Hello, how can I help you\" to start.";
//const prompt = "Hello";

function removeMarkdownFrom(text) {
  // Remove bold formatting: **bold**
  text = text.replace(/\*\*(.*?)\*\*/g, '$1');

  // Remove italic formatting: *italic*
  text = text.replace(/\*(.*?)\*/g, '$1');

  // Remove inline code formatting: `code`
  text = text.replace(/`(.*?)`/g, '$1');

  // Remove headers: # Header
  text = text.replace(/^#+\s*(.*)/gm, '$1');

  // Remove unordered list: - item
  text = text.replace(/^\s*-\s*(.*)/gm, '$1');

  // Remove ordered list: 1. item
  text = text.replace(/^\s*\d+\.\s*(.*)/gm, '$1');

  // Remove blockquote: > quote
  text = text.replace(/^\s*>\s*(.*)/gm, '$1');

  return text;
}

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
    res.json({ answer: removeMarkdownFrom(text) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
