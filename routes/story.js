/* eslint-disable camelcase */
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
const contributionQueries = require('../db/queries/03_contributions');

const { formatDate } = require('../helpers');


router.get('/:id', (req, res) => {
  storyQueries.getIndividualStories(req.params.id)
    .then(story => {
      story.created_at = formatDate(story.created_at);

      const templateVars = { story };
      res.render('story', templateVars);
    });
});


router.get('/:id/contribute', (req, res) => {
  let story = {};

  storyQueries.getIndividualStories(req.params.id)
    .then(data => {
      data.created_at = formatDate(data.created_at);
      story = data;
    })
    .then(() => {
      return contributionQueries.getContributionsForStory(req.params.id);
    })
    .then(data => {
      return data;
    })
    .then(contributions => {
      const templateVars = {
        story,
        contributions
      };
      res.render('contribute', templateVars);
    });
});


router.post('/:id/contribute', (req, res) => {

  const newContribution = req.body;
  newContribution.storyId = req.params.id;
  newContribution.userId = req.session.userid;

  console.log(newContribution);

  contributionQueries.addContribution(newContribution)
    .then(() => res.redirect(`/story/${req.params.id}/contribute`));
});


router.post('/:id', (req, res) => {

  const contributionId = parseInt(req.body.contribution);
  let story = {};

  storyQueries.getIndividualStories(req.params.id)
    .then(data => {
      story = data;
    })
    .then(() => contributionQueries.getIndividualContribution(contributionId))
    .then(data => {
      const content = story.content + " " + data.contribution_content;
      const storyId = req.params.id;
      storyQueries.appendToStory(storyId, content);
    })
    .then(() => contributionQueries.removeContribution(contributionId))
    .then(() => res.redirect(`/story/${req.params.id}`));
});

module.exports = router;
