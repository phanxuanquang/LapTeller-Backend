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
const { count } = require("console");

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

const genAI = new GoogleGenerativeAI(
  atob("QUl6YVN5RFR4dkpFZEhNRzVhOGI5ejhTQ3V1czRqZ25MOTFfeWk0")
);
const apiKey =
  "98af36501d1291c96c00f97896797e371581682c32f121d5240ce75a79723168";

function GetStringFrom(inputPath) {
  try {
    const content = fs.readFileSync(inputPath, "utf8");
    return content;
  } catch (error) {
    console.error("Error reading file:", error);
    return null;
  }
}

const askGemini = async (question, res) => {
  let tryCount = 0;

  const handleError = (error) => {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  };

  const handleRetry = async (text) => {
    tryCount++;
    console.log("Trying times:", tryCount);
    console.log(text);

    if (tryCount > 5) {
      console.error("Exceeded maximum retries.");
      res.status(500).json({ error: "Exceeded maximum retries." });
    } else {
      await askGemini(
        `I want a better answer, and remember to provide response in JSON format as my example. My question: ${question}`,
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
      history: [
        {
          role: "user",
          parts: [
            {
              text:
              GetStringFrom("gemini-pro/promt.txt"),
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text:
                '{\n  "products": [],\n  "answer": "Hello! I am LapTeller, a virtual assistant ready to assist you with all your laptop-related queries. Let\'s get started. Ask me anything about laptops, and I\'ll do my best to help you find the perfect one for your needs."\n}',
            },
          ],
        },
        {
          role: "user",
          parts: [{ text: "i want to buy laptop<div><br></div>" }],
        },
        {
          role: "model",
          parts: [
            {
              text:
                '{\n  "products": [],\n  "answer": "Great choice! Whether you\'re a student, a professional, or a casual user, I can assist you in finding the best laptop that suits your specific needs and preferences. What kind of tasks do you primarily intend to perform on your new laptop?"\n}',
            },
          ],
        },
        {
          role: "user",
          parts: [{ text: "i want to buy laptop for gaming" }],
        },
        {
          role: "model",
          parts: [
            {
              text:
                '{\n  "products": [],\n  "answer": "Fantastic! Gaming laptops are designed to handle the demands of modern games with their powerful graphics cards and high-performance processors. What\'s your budget range for this gaming laptop?"\n}',
            },
          ],
        },
        {
          role: "user",
          parts: [{ text: "above 1000 usd<div><br></div>" }],
        },
        {
          role: "model",
          parts: [
            {
              text:
                '{\n  "products": [],\n  "answer": "Excellent! With a budget above $1000, you have access to a wide range of gaming laptops that offer exceptional performance. Do you have a preference for any specific screen size or features?"\n}',
            },
          ],
        },
        {
          role: "user",
          parts: [{ text: "15 inch, 16gb ram or above, 512gb ssd or above" }],
        },
        {
          role: "model",
          parts: [
            {
              text:
                '{\n  "products": [\n    {\n      "name": "ASUS ROG Strix G15 (2023)",\n      "screenSize": 15.6,\n      "processor": "AMD Ryzen 9 6900HX",\n      "memory": "16GB",\n      "storage": "1TB SSD"\n    },\n    {\n      "name": "Razer Blade 15 (2023)",\n      "screenSize": 15.6,\n      "processor": "Intel Core i9-13900H",\n      "memory": "16GB",\n      "storage": "512GB SSD"\n    },\n    {\n      "name": "MSI Stealth 15M (2023)",\n      "screenSize": 15.6,\n      "processor": "Intel Core i7-13620H",\n      "memory": "16GB",\n      "storage": "512GB SSD"\n    },\n    {\n      "name": "Lenovo Legion 5 Pro (2023)",\n      "screenSize": 16,\n      "processor": "AMD Ryzen 7 6800H",\n      "memory": "16GB",\n      "storage": "512GB SSD"\n    },\n    {\n      "name": "HP Omen 16 (2023)",\n      "screenSize": 16.1,\n      "processor": "Intel Core i7-13650HX",\n      "memory": "16GB",\n      "storage": "512GB SSD"\n    },\n    {\n      "name": "Acer Predator Helios 300 (2023)",\n      "screenSize": 15.6,\n      "processor": "Intel Core i7-13700H",\n      "memory": "16GB",\n      "storage": "512GB SSD"\n    }\n  ],\n  "answer": "Based on your preferences, here are some highly recommended gaming laptops that meet your criteria:"\n}',
            },
          ],
        },
        {
          role: "user",
          parts: [{ text: "great, how about laptops for coding" }],
        },
        {
          role: "model",
          parts: [
            {
              text:
                '{\n  "products": [\n    {\n      "name": "Apple MacBook Air (M2, 2022)",\n      "screenSize": 13.3,\n      "processor": "Apple M2",\n      "memory": "8GB",\n      "storage": "256GB SSD"\n    },\n    {\n      "name": "Microsoft Surface Laptop Studio (2022)",\n      "screenSize": 14.4,\n      "processor": "Intel Core i7-11370H",\n      "memory": "16GB",\n      "storage": "512GB SSD"\n    },\n    {\n      "name": "Dell XPS 13 (2023)",\n      "screenSize": 13.4,\n      "processor": "Intel Core i7-1360P",\n      "memory": "16GB",\n      "storage": "512GB SSD"\n    },\n    {\n      "name": "Lenovo ThinkPad X1 Carbon Gen 11 (2023)",\n      "screenSize": 14,\n      "processor": "Intel Core i7-1355U",\n      "memory": "16GB",\n      "storage": "512GB SSD"\n    },\n    {\n      "name": "HP Spectre x360 14 (2023)",\n      "screenSize": 13.5,\n      "processor": "Intel Core i7-1350U",\n      "memory": "16GB",\n      "storage": "512GB SSD"\n    },\n    {\n      "name": "Acer Swift 5 (2023)",\n      "screenSize": 14,\n      "processor": "Intel Core i5-1340P",\n      "memory": "8GB",\n      "storage": "512GB SSD"\n    }\n  ],\n  "answer": "For coding purposes, these laptops are highly recommended due to their portability, long battery life, and powerful performance:"\n}',
            },
          ],
        },
        {
          role: "user",
          parts: [{ text: "do you have any advice for me before buying" }],
        },
        {
          role: "model",
          parts: [
            {
              text:
                '{\n  "products": [],\n  "answer": "Absolutely! Before you make your purchase, here are some valuable tips to consider:\\n\\n1. **Research and Compare:** Before committing to a specific laptop, take the time to thoroughly research and compare different models. Read reviews from tech experts and users alike to gain insights into the pros and cons of each device.\\n\\n2. **Define Your Needs:** Clearly identify your primary usage requirements for the laptop. Are you a student, a professional, or a casual user? Will you be using it for gaming, video editing, or basic tasks? Once you know your needs, you can narrow down your options accordingly.\\n\\n3. **Consider Upgradability:** Think about whether you might need to upgrade your laptop\'s components in the future. Some laptops allow for easy upgrades, such as RAM or storage, which can extend their lifespan and save you money in the long run.\\n\\n4. **Pay Attention to the Display:** The display is a crucial aspect of the user experience. Consider factors like screen size, resolution, brightness, and color accuracy. Ensure that the display meets your requirements for clarity and viewing comfort.\\n\\n5. **Battery Life and Portability:** If you\'ll be using your laptop on the go, battery life and portability become essential. Look for laptops with long battery life and a lightweight design that suits your mobile lifestyle."\n}',
            },
          ],
        },
        {
          role: "user",
          parts: [{ text: "i want to buy laptop" }],
        },
        {
          role: "model",
          parts: [
            {
              text:
                '{\n  "products": [],\n  "answer": "Fantastic! To help you find the perfect laptop, I\'d like to ask you a few questions. What primary activities will you be using the laptop for? Are you a student, a professional, or a casual user? Additionally, do you have a preferred operating system, such as Windows, macOS, or Chrome OS?"\n}',
            },
          ],
        },
      ],
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
        hl: "vi",
        gl: "vn",
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

app.get("/translate", async (req, res) => {
  const inputText = req.query.text;

  try {
    const response = await axios.get(
      "https://translate.googleapis.com/translate_a/single",
      {
        params: {
          client: "gtx",
          sl: "auto", // input language
          tl: "vi", // output language
          dt: "t",
          q: inputText,
        },
      }
    );

    res.json({ translation: response.data[0][0][0] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Translating in to Vietnamese failed." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
