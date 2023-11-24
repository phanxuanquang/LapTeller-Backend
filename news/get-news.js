const express = require('express');
const news = require('gnews');

const app = express();
const port = 3000;

app.use(express.json());

app.post('/news', async (req, res) => {
    const keyword = req.body.keyword | "laptop latest news";
    const result = await news.search(keyword);
    res.json(result);
});

app.listen(port, () => {
    console.log(`Server is up and running at ${port}`);
});