/*
 * All routes for User Data are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /api/users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();
// const userQueries = require('../db/queries/01_users');
const storyQueries = require('../db/queries/02_stories');


router.get('/', (req, res) => {

  storyQueries.getAllStories()
    .then(stories => {
      const templateVars = { stories };
      return res.render('home', templateVars);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

module.exports = router;
