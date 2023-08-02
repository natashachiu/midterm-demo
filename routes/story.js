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
const contributionQueries = require('../db/queries/03_contributions');
const upvotedContsQueries = require('../db/queries/04_upvoted_contributions');

const { formatDate } = require('../helpers');


router.get('/', (req, res) => {
  res.render('newStory');
});
router.post('/', async (req, res) => {
  const user_id = req.session.userid;
  if (user_id) {
    const { title, description, content } = req.body;

    try {
      const result = await storyQueries.createNewStories({
        user_id,
        title,
        description,
        content,
        completed: false, // Or any default value for completed.
        created_at: new Date(), // Or the actual creation date.
        completed_at: null, // Or any default value for completed_at.
        is_fav: false, // Or any default value for is_fav.

      });

      console.log("Successful insertion:", result);
      res.redirect('/home'); // Redirect to a success page or any other page after successful insertion.
    } catch (error) {
      console.error("Error inserting story:", error.message);
      res.redirect('/error'); // Redirect to an error page in case of an error.
    }
  } else {
    res.send("Please Log in❌❌❌");
  }


});


router.get('/:id/toggle', (req, res) => {
  res.redirect(`/story/${req.params.id}`);
});
router.post('/:id/toggle', (req, res) => {
  const storyId = req.params.id;
  const user_id = req.session.userid;
  console.log('user_Id : ' + user_id, 'storyId: ' + storyId);
  // Update the database with the new completed status
  storyQueries.toggleCompleted(storyId, user_id)
    .then(result => {
      res.sendStatus(200); // Send a success response to the client
      console.log('user: ' + user_id, 'story: ' + storyId);
    })
    .catch(error => {
      console.error('Error updating story status:', error);
      res.sendStatus(500);
      // Send a server error response to the client
    });
});

router.get('/:id', (req, res) => {
  storyQueries.getIndividualStories(req.params.id)
    .then(story => {
      story.created_at = formatDate(story.created_at);

      const templateVars = { story, storyId: req.params.id };
      res.render('story', templateVars);
    });
});


router.get('/:id/contribute', (req, res) => {
  let story = {};
  let contributions = {};
  console.log(req.params.id);

  storyQueries.getIndividualStories(req.params.id)
    .then(data => {
      data.created_at = formatDate(data.created_at);
      story = data;
    })
    .then(() => {
      return contributionQueries.getContributionsForStory(req.params.id);
    })
    .then(data => {
      contributions = data;
      return upvotedContsQueries.getUpvotedContributions(req.session.userid);
    })
    .then(data => {
      const upvotedContributions = [];
      for (const upvotedCont of data) {
        upvotedContributions.push(upvotedCont.contribution_id);
      }

      console.log(upvotedContributions);
      const templateVars = {
        story,
        contributions,
        upvotedContributions
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

router.get('/:id', (req, res) => {
  storyQueries.getIndividualStories(req.params.id)
    .then(story => {
      story.created_at = formatDate(story.created_at);

      const templateVars = { story, storyId: req.params.id };
      res.render('story', templateVars);
    });
});

router.post('/:id/append', (req, res) => {
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
    .then(() => res.redirect(`/story/${req.params.id}/contribute`));
});

router.post('/:id/upvote/add', (req, res) => {
  const contributionId = parseInt(req.body.upvote);

  contributionQueries.getIndividualContribution(contributionId)
    .then(data => {
      const upvotes = data.up_vote + 1;
      contributionQueries.addUpvote(upvotes, contributionId);
    })
    .then(() => {
      upvotedContsQueries.addUpvotedContribution(req.session.userid, contributionId);
    })
    .then(() => res.redirect(`/story/${req.params.id}/contribute`));
});

router.post('/:id/upvote/remove', (req, res) => {
  const contributionId = parseInt(req.body.upvote);

  contributionQueries.getIndividualContribution(contributionId)
    .then(data => {
      const upvotes = data.up_vote - 1;
      contributionQueries.removeUpvote(upvotes, contributionId);
    })
    .then(() => {
      upvotedContsQueries.removeUpvotedContribution(req.session.userid, contributionId);
    })
    .then(() => res.redirect(`/story/${req.params.id}/contribute`));
});


module.exports = router;
