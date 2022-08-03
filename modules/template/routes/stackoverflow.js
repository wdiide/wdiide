const { default: axios } = require('axios');
var express = require('express');
var router = express.Router();
const engineName = 'stackoverflow';
const engineTitle = 'StackOverFlow';


router.get('/', (req, res) => {
  res.render('engine_home', {
    title: 'Search StackOverFlow',
    engine:engineName,
    image:'stackoverflow.png',
    place_holder:'Search StackOverFlow'
  });
});

// Dá para fazer um buscador buscando informações de duckduckgo
// https://api.duckduckgo.com/?q=github&format=json
// https://hn.algolia.com/api/v1/search?query=${query}&tags=story&hitsPerPage=90

async function searchAPI(query) {
  const response = await axios.get(
    `https://api.stackexchange.com/search/advanced?site=stackoverflow.com&q=${query}`
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


    // creation_date:1558425529
    // is_answered:true
    // last_activity_date:1581627111
    // last_edit_date:1567786116

    let data = results.items.map(result => ({
      id: result.question_id,
      url: result.link||'#',
      title: result.title,
      points: result.score,
      author: result.owner.display_name,
      created_at: new Date(result.creation_date*1000).toISOString(),
      comments_size: result.answer_count
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
