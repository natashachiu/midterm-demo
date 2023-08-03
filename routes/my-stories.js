/* eslint-disable camelcase */
/*
 * All routes for User Data are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /api/users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();

const storyQueries = require('../db/queries/02_stories');

router.get('/', (req, res) => {
  const userId = req.session.userid;
  if (!userId) {
    if (!req.session.userid) {
      const templateVars = {
        userId: null,
        username: null
      };
      return res.render('login-error', templateVars);
    }
  }
  storyQueries.getAllStoriesByUserId(userId)
    .then(stories => {
      const templateVars = {
        stories,
        userId: parseInt(req.session.userid),
        username: stories[0].username
      };
      return res.render('my-stories', templateVars);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });


});




module.exports = router;
