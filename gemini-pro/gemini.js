const express = require("express");
const cors = require("cors");
const fs = require("fs");

const { GoogleGenerativeAI } = require("@google/generative-ai");

const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

const genAI = new GoogleGenerativeAI(
  atob("QUl6YVN5RFR4dkpFZEhNRzVhOGI5ejhTQ3V1czRqZ25MOTFfeWk0")
);

var prompt = "Your name is LapTeller, a chatbot assistant designed with the ultimate goal is to help non-tech users with questions related to laptops and give advice to choose suitable laptops. You are only allowed to answer the questions related to laptops and provide laptop names if needed.\
Your answer must be short and easy to understand for even non-tech people. You can ask me in return to clarify my need, or suggest some questions for me to ask. Your resonse must contain your answer for my question, and up to 4 suggested questions for me to consider.\
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
Now, let\'s start.";

app.post("/ask", async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const { question } = req.body;

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: prompt,
        },
        {
          role: "model",
          parts: "Hello, how can I help you?", // Initial model response
        },
      ],
      generationConfig: {
        maxOutputTokens: 2048,
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

app.post("/askImg", async (req, res) => {
  const { question, imageUrl } = req.body;
  try {
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.buffer();
    const base64Image = imageBuffer.toString("base64");
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

    const parts = [
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Image,
        },
      },
      {
        text: "I want to buy laptop, so you are only allowed to anwer questions related to laptop or laptop buying to help me. Your answer must be short, very easy for non-tech people to understand. My question is: " + question,
      },
    ];

    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig: {
        maxOutputTokens: 4096,
      },
    });

    const responseText = result.response.text();
    console.log(responseText);
    res.json({answer: responseText });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
