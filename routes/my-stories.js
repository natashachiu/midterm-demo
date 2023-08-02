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
    res.render('login-error');
  } else {
    storyQueries.getAllStoriesByUserId(userId)
      .then(stories => {
        const templateVars = { stories };
        return res.render('my-stories', templateVars);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  }

});




module.exports = router;
