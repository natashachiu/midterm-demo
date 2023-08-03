const express = require('express');
const router = express.Router();

const storyQueries = require('../db/queries/02_stories');

router.get('/', (req, res) => {
  const userId = req.session.userid;
  if (!userId) {
    res.render('login-error');
  } else {
    storyQueries.getFavoriteStories(userId)
      .then(stories => {
        const templateVars = { stories };
        return res.render('favorite-stories', templateVars);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  }

});




module.exports = router;