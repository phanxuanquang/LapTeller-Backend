const express = require("express");
const cors = require("cors");
const fs = require("fs");
const axios = require("axios");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const { getJson } = require("serpapi");
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const apiKey = process.env.SERP_API_KEY;
const region = "vn";
const language = "vi";
const loadHistoryFromFile = (jsonPath) => {
  try {
    const historyData = fs.readFileSync(jsonPath, "utf8");
    const history = JSON.parse(historyData);
    return history;
  } catch (error) {
    console.error("Error reading history file: ", error);
    return [];
  }
};
function UpdateConversation(role, text, JsonArray) {
  const newElement = {
    role: role,
    parts: [
      {
        text: text,
      },
    ],
  };
  JsonArray.push(newElement);
  return JsonArray;
}

let chatLog = loadHistoryFromFile("chatLog.json");

const askGemini = async (question, res) => {
  let tryCount = 0;

  const handleError = (error) => {
    console.error("Error: ", error.message);
    res.status(500).json({ error: error.message });
  };

  const handleRetry = async (text) => {
    tryCount++;
    console.log("Trying times: ", tryCount);
    console.log(text);

    if (tryCount > 5) {
      console.error("Exceeded maximum retries.");
      res.status(500).json({ error: "Exceeded maximum retries." });
    } else {
      question = `I want a better answer, and remember to provide response in JSON format as my example. My question: ${question}`;
      await askGemini(
        question,
        res
      );
    }
  };

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };

    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];
    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: chatLog,
    });

    const result = await chat.sendMessage(question);
    const response = result.response;
    const text = response
      .text()
      .replaceAll("json", "")
      .replaceAll("```", "")
      .trim();

    try {
      const jsonData = JSON.parse(text);
      res.json(jsonData);
      console.log(response.text().trim());
      chatLog = UpdateConversation("user", question, chatLog);
      chatLog = UpdateConversation("model", response.text().trim(), chatLog);
    } catch (error) {
      await handleRetry(text);
    }
  } catch (error) {
    handleError(error);
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
          "You are only allowed to answer questions related to laptop, and use English to answer. Your answer must be clear and very easy for non-tech people to understand. You can give me some useful advice if necessary if needed or provide some information related to the laptop in the image if any. My question: " +
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
        hl: language,
        gl: region,
        tbs: "mr:1,avg_rating:300",
        api_key: apiKey,
      },
    });

    if (response.data.shopping_results != null) {
      const item = response.data.shopping_results.map((item) => ({
        product_id: item.product_id,
        link: item.link,
        source: item.source,
        price: item.extracted_price,
        rating: item.rating,
        reviews: item.reviews,
        thumbnail: item.thumbnail,
        isNew: item.second_hand_condition ? false : true,
      }));

      res.json(item);
    } else {
      res.status(404).send("Invalid Product");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/getProductListPro", async (req, res) => {
  try {
    const { productName } = req.body;

    if (!productName) {
      return res.status(400).json({ error: 'Missing "q" parameter' });
    }

    const config = {
      method: "post",
      url: "https://google.serper.dev/shopping",
      headers: {
        "X-API-KEY": process.env.SERPER_API_KEY,
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        q: productName,
        gl: region,
      }),
    };
    const response = await axios(config);

    if (response.data.shopping && Array.isArray(response.data.shopping)) {
      const transformProduct = (product) => {
        const isNew = !product.price.includes("used");
        const price = product.price
          .replace(/[₫,used]/g, "")
          .replaceAll("+ tax", "")
          .trim();

        const transformedProduct = {
          product_id: product.id,
          link: product.link,
          source: product.source,
          price: price,
          thumbnail: product.imageUrl,
          isNew: isNew,
        };

        return transformedProduct;
      };
      const transformedArray = response.data.shopping.map(transformProduct);
      res.json(transformedArray);
    } else {
      res.json(response.data);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/getProductDetail", async (req, res) => {
  try {
    const { product_id } = req.body;
    getJson(
      {
        engine: "google_product",
        product_id,
        hl: language,
        gl: region,
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

app.post("/getLocalStoreLocations", (req, res) => {
  const { storeName } = req.body;
  const queryParams = {
    engine: "google_local",
    q: storeName,
    google_domain: "google.com.vn",
    location: "Vietnam",
    hl: language,
    gl: region,
    api_key: apiKey,
  };

  getJson(queryParams, (json) => {
    res.json(json["local_results"]);
  });
});

app.get("/news", async (req, res) => {
  try {
    const { q } = req.query;

    const apiUrl = "https://newsapi.org/v2/everything";
    const response = await axios.get(apiUrl, {
      params: {
        q,
        sortBy: "popularity",
        pageSize: 30,
        apiKey: process.env.NEWS_API_KEY,
      },
    });

    res.json(response.data.articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
