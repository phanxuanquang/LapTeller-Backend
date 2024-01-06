const express = require("express");
const cors = require("cors");
const fs = require("fs");
const axios = require("axios");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const { getJson } = require("serpapi");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { count } = require("console");

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

const genAI = new GoogleGenerativeAI(
  atob("QUl6YVN5RFR4dkpFZEhNRzVhOGI5ejhTQ3V1czRqZ25MOTFfeWk0")
);
const apiKey = '98af36501d1291c96c00f97896797e371581682c32f121d5240ce75a79723168';

function GetStringFrom(inputPath) {
  try {
    const content = fs.readFileSync(inputPath, "utf8");
    return content;
  } catch (error) {
    console.error("Error reading file:", error);
    return null;
  }
}

var tryCount = 0;
const askGemini = async (question, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: GetStringFrom("gemini-pro/promt.txt"),
        },
        {
          role: "model",
          parts: "I got it. I will always use English for my answers, and provide response with your JSON format exactly. My mission is to help users to choose suitable laptops and give them useful advice about buying laptop. Let's start.",
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
      .replace("json", "")
      .replaceAll("```", "")
      .trim();
    
      try{
        const jsonData = JSON.parse(text);
        res.json(jsonData);
        console.log(response.text().trim()); 
      }
      catch (error) {
        tryCount++;
        console.log("Trying times: ", tryCount);
        console.log(text);

        if(tryCount > 5){
          console.error("Error:", error.message);
          res.status(500).json({ error: error.message });
        }
        else {
          await askGemini("Remember to provide in JSON format as my example. My question: " + question, res);
        }
      }
      tryCount = 0;
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message.replace('[GoogleGenerativeAI Error]: Text not available. ', '') });
  }
};

app.post("/ask", async (req, res) => {
  const { question } = req.body;
  await askGemini(question, res);
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
          "I want to buy laptop, so you are only allowed to anwer questions related to laptop. Your answer must be short, very easy for non-tech people to understand. My question: " +
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
    res.status(500).json({ error: error.message });
  }
});

app.post("/getProductList", async (req, res) => {
  try {
    const { productName } = req.body;
    const response = await axios.get("https://serpapi.com/search.json", {
      params: {
        engine: "google_shopping",
        q: productName,
        hl: "vi",
        gl: "vn",
        tbs: "mr:1,avg_rating:300",
        api_key: apiKey,
      },
    });

    if (response.data.shopping_results != null){
      res.json(response.data.shopping_results);
    }
    else{
      res.json({ error: "Empty product list" }); 
    }
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
        hl: "vi",
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
    hl: "vi",
    gl: "vn",
    api_key: apiKey,
  };

  getJson(queryParams, (json) => {
    res.json(json["local_results"]);
  });
});

app.get('/translate', async (req, res) => {
  const inputText = req.query.text; 

  try {
    const response = await axios.get('https://translate.googleapis.com/translate_a/single', {
      params: {
        client: 'gtx',
        sl: 'auto', // input language
        tl: 'vi', // output language
        dt: 't',
        q: inputText,
      },
    });

    res.json({ translation : response.data[0][0][0] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Translating in to Vietnamese failed.' });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
