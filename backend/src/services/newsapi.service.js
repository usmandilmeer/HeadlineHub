const axios = require("axios");

const BASE_URL = "https://newsapi.org/v2";
const API_KEY = process.env.NEWS_API_KEY;

// Fetch top headlines by category
const fetchTopHeadlines = async (category = "general", country = "us") => {
  const response = await axios.get(`${BASE_URL}/top-headlines`, {
    params: {
      category,
      country,
      apiKey: API_KEY,
      pageSize: 20,
    },
  });
  return response.data.articles;
};

// Fetch articles by search keyword
const fetchByKeyword = async (keyword) => {
  const response = await axios.get(`${BASE_URL}/everything`, {
    params: {
      q: keyword,
      apiKey: API_KEY,
      pageSize: 20,
      sortBy: "publishedAt",
    },
  });
  return response.data.articles;
};

module.exports = { fetchTopHeadlines, fetchByKeyword };