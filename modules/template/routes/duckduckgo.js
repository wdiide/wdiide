const { default: axios } = require('axios');
var express = require('express');
var router = express.Router();
const engineName = 'duckduckgo';
const engineTitle = 'DuckDuckGo';


router.get('/', (req, res) => {
  res.render('engine_home', {
    title: 'Search DuckDuckGo',
    engine:engineName,
    image:'duckduckgo.png',
    place_holder:'Search DuckDuckGo'
  });
});

async function searchAPI(query) {
  const response = await axios.get(
    `https://api.duckduckgo.com/?format=json&q=${query}`
  );
  return response.data;
}

router.get('/search', async (req, res, next) => {
  try {
    const searchQuery = req.query.q;
    if (!searchQuery) {
      res.redirect(302, res.locals.appContext+engineName);
      return;
    }

    const results = await searchAPI(searchQuery);

    let data = results.RelatedTopics.map(result => ({
      id: undefined,
      url: result.FirstURL||'#',
      title: result.Text,
      points: undefined,
      author: '',
      created_at: new Date().toISOString(),
      comments_size: undefined
    }));

    const newResults = {
      data: data,
      meta:{
        page: results.page,
        size: data.length,
        pageSize: results.hitsPerPage,
      }
    }

    res.render('engine_search', {
      title: `Search results for: ${searchQuery}`,
      searchResults: newResults,
      searchQuery,
      engine:engineName,
      engineTitle: engineTitle,
      place_holder:'Enter a search term'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
