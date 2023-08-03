/*
 * All routes for User Data are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /api/users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();
const storyQueries = require('../db/queries/02_stories');
const userQueries = require('../db/queries/01_users');

router.get('/', (req, res) => {
  const userId = req.session.userid;
  let stories = {};
  let templateVars = {};

  storyQueries.getAllStories()
    .then(data => {
      stories = data;
      return userQueries.getUserById(userId);
    })
    .then(data => {
      if (!userId) {
        templateVars = {
          stories,
          userId: null,
          username: null
        };
      } else {
        templateVars = {
          stories,
          userId: parseInt(userId),
          username: data.username
        };
      }

      return res.render('home', templateVars);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});




module.exports = router;
