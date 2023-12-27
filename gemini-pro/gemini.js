const express = require("express");
const cors = require("cors");
const fs = require("fs");
const axios = require("axios");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const { getJson } = require("serpapi");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

const genAI = new GoogleGenerativeAI(
  atob("QUl6YVN5RFR4dkpFZEhNRzVhOGI5ejhTQ3V1czRqZ25MOTFfeWk0")
);
const apiKey = atob(
  "MDQzYmUzNDA2YjJjZWI2NmE3MTQ3OTQ2NWU0MzY1ZTY0OWE2YjM2OTkyOTE5MzJiMWQ0OTE5OWEwNDY0MGJkZg=="
);

function GetStringFrom(inputPath) {
  try {
    const content = fs.readFileSync(inputPath, "utf8");
    return content;
  } catch (error) {
    console.error("Error reading file:", error);
    return null;
  }
}

app.post("/ask", async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const { question } = req.body;

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: GetStringFrom("gemini-pro/promt.txt"),
        },
        {
          role: "model",
          parts: "Hello, how can I help you?",
        },
      ],
      generationConfig: {
        maxOutputTokens: 2048,
      },
    });

    const result = await chat.sendMessage(question);
    const response = await result.response;
    const text = response
      .text()
      .trim()
      .replace("json", "")
      .replaceAll("```", "");
    const jsonData = JSON.parse(text);
    console.log(response.text().trim());
    res = jsonData;
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
        text:
          "I want to buy laptop, so you are only allowed to anwer questions related to laptop. Your answer must be short, very easy for non-tech people to understand. My question is: " +
          question,
      },
    ];

    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig: {
        maxOutputTokens: 4096,
      },
    });

    const responseText = result.response.text().trim();
    console.log(responseText);
    res.json({ answer: responseText });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.post("/getProductList", async (req, res) => {
  try {
    const { productName } = req.body;
    const response = await axios.get("https://serpapi.com/search.json", {
      params: {
        engine: "google_shopping",
        q: productName,
        hl: "en",
        gl: "vn",
        tbs: "mr:1,avg_rating:300,new:1,new:3",
        api_key: apiKey,
      },
    });

    res.json(response.data.shopping_results);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/getProductDetail", async (req, res) => {
  try {
    const { product_id } = req.body;

    getJson(
      {
        engine: "google_product",
        product_id,
        hl: "en",
        gl: "vn",
        api_key: apiKey,
      },
      (json) => {
        res.json(json["product_results"]);
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/getStoreLocations", (req, res) => {
  const { storeName, lat, long } = req.body;

  if (!storeName || !lat || !long) {
    return res.status(400).json({
      error: "Please provide store name, latitude, and longitude parameters.",
    });
  }
  const ll = `@${lat},${long}`;
  const queryParams = {
    engine: "google_maps",
    q: storeName,
    ll,
    type: "search",
    api_key: apiKey,
  };

  getJson(queryParams, (json) => {
    res.json(json);
  });
});

app.post("/getLocalStoreLocations", (req, res) => {
  const { storeName } = req.body;
  const queryParams = {
    engine: "google_local",
    q: storeName,
    google_domain: "google.com.vn",
    location: "Ho Chi Minh City, Ho Chi Minh City, Vietnam",
    hl: "en",
    gl: "vn",
    api_key: apiKey,
  };

  getJson(queryParams, (json) => {
    res.json(json["local_results"]);
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
