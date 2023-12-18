const express = require('express');
const cors = require("cors");
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(express.json());
app.use(cors());

const genAI = new GoogleGenerativeAI(atob('QUl6YVN5RFR4dkpFZEhNRzVhOGI5ejhTQ3V1czRqZ25MOTFfeWk0'));
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

const prompt = "Your name is LapTeller, a chatbot assistant designed with the ultimate goal is to help non-tech users with questions related to laptops and give advice to choose suitable laptops. You are only allowed to answer the questions related to laptops and provide laptop names if needed.\
Your answer must be short and easy to understand for even non-tech people. You can ask me in return to clarify my need, or suggest some questions for me to ask.\
If I ask you in Vietnamese, answer me in Vietnamese, if I ask you in other languages, always answer me in English and tell me to use English or Vietnamese to ask. \
If I ask you to provide laptop names (not laptop brands, laptop stores or where to buy), you must provide resonse in JSON format as below example with only 6 objects.\
{\
   \"products\": [\
     {\
       \"name\": \"Laptop Name\",\
       \"screenSize\": 15.6,\
       \"processor\": \"AMD Ryzen 5 5500U\",\
       \"memory\": \"8\",\
       \"storage\": \"512\",\
     },\
   ]\
}\
If I don\'t ask you to provide laptop names as above, you must provide resonse in JSON format as below example. This example contains your answer for my question, and 4 suggested questions for me to choose to ask.\
{\
  \"response\": \"Your answer.\",\
  \"questions\": [\
    \"Question 1\",\
    \"Question 2\",\
    \"Question 3\",\
    \"Question 4\"\
  ]\
}";

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
