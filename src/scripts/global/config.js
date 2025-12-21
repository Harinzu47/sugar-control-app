const CONFIG = {
  KEY: process.env.SPOONACULAR_API_KEY,
  BASE_URL: 'https://api.spoonacular.com/',
  BASE_IMG_URL: 'https://spoonacular.com/cdn/ingredients_100x100/',
  PROXYURL: "https://cors-anywhere.herokuapp.com/",

  KEY2: process.env.GNEWS_API_KEY,
  BASE_URL2: 'https://gnews.io/api/v4/',
  CACHE_NAME: new Date().toISOString(),
};

export default CONFIG;
