const { default: axios } = require('axios');
var express = require('express');
var router = express.Router();
const engineName = 'hknews';
const engineTitle = 'Hacker News';


router.get('/', (req, res) => {
  res.render('engine_home', {
    title: 'Search Hacker News',
    engine:engineName,
    image:'hknews.png',
    place_holder:'Search Hacker News'
  });
});

// Dá para fazer um buscador buscando informações de duckduckgo
// https://api.duckduckgo.com/?q=github&format=json

async function searchHN(query) {
  const response = await axios.get(
    `https://hn.algolia.com/api/v1/search?query=${query}&tags=story&hitsPerPage=90`
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

    const results = await searchHN(searchQuery);

    let data = results.hits.map(story => ({ 
      id: story.objectID,
      url: story.url||'#',
      title: story.title,
      points: story.points,
      author: story.author,
      created_at: story.created_at,
      comments_size: story.num_comments    
    }));

    const newResults = {
      data: data,
      meta:{
        page: results.page,
        size: results.nbHits,
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
