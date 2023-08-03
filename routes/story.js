/* eslint-disable camelcase */
/*
 * All routes for User Data are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /api/users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();

const userQueries = require('../db/queries/01_users');
const storyQueries = require('../db/queries/02_stories');
const contributionQueries = require('../db/queries/03_contributions');
const upvotedContsQueries = require('../db/queries/04_upvoted_contributions');
const favoriteQueries = require('../db/queries/05_favorite_stories');

const { formatDate } = require('../helpers');


router.get('/', (req, res) => {
  const userId = parseInt(req.session.userid);

  if (!userId) {
    const templateVars = {
      userId: null,
      username: null
    };
    return res.render('login-error', templateVars);
  }

  userQueries.getUserById(parseInt(req.session.userid))
    .then(data => {
      const templateVars = {
        userId,
        username: data.username
      };
      return res.render('newStory', templateVars);
    });
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

      // console.log("Successful insertion:", result);
      res.redirect('/home'); // Redirect to a success page or any other page after successful insertion.
    } catch (error) {
      console.error("Error inserting story:", error.message);
      res.redirect('/error'); // Redirect to an error page in case of an error.
    }
  }
  // else {
  //   res.render('"Please Log in❌❌❌"');
  // }


});

router.get('/:id/favorite', (req, res) => {
  //
});
router.post('/:id/favorite', (req, res) => {
  const storyId = req.params.id;
  const user_id = req.session.userid;
  if (!user_id) {
    res.render('login-error');
  } else {
    favoriteQueries.addFavoriteStories(storyId, user_id)
      .then(result => {
        res.redirect('/favorite-stories');
        // res.render('favorite-stories-success');
      });
  }
});


router.get('/:id/toggle', (req, res) => {
  res.redirect(`/story/${req.params.id}`);
});
router.post('/:id/toggle', (req, res) => {
  const storyId = req.params.id;
  const user_id = req.session.userid;
  // console.log('user_Id : ' + user_id, 'storyId: ' + storyId);
  // Update the database with the new completed status
  storyQueries.toggleCompleted(storyId, user_id)
    .then(() => {
      //res.sendStatus(200); // Send a success response to the client
      res.redirect(`/story/${req.params.id}`);
      // console.log('user: ' + user_id, 'story: ' + storyId);
    })
    .catch(error => {
      console.error('Error updating story status:', error);
      res.sendStatus(500);
      // Send a server error response to the client
    });
});
router.get('/:id', (req, res) => {
  let story = {};
  let addedContributions = {};
  storyQueries.getIndividualStories(req.params.id)
    .then(data => {
      data.created_at = formatDate(data.created_at);
      story = data;
      return contributionQueries.getCompletedContsForStory(req.params.id);

    }).then(data => {
      addedContributions = data;
      return userQueries.getUserById(req.session.userid);

    })
    .then(data => {
      let templateVars = {};
      if (!req.session.userid) {
        templateVars = {
          story,
          addedContributions,
          userId: null,
          username: null
        };
      } else {
        templateVars = {
          story,
          addedContributions,
          userId: parseInt(req.session.userid),
          username: data.username
        };
      }



      res.render('story', templateVars);
    });
});

router.get('/:id/contribute', (req, res) => {
  if (!req.session.userid) {
    const templateVars = {
      userId: null,
      username: null
    };
    return res.render('login-error', templateVars);
  }
  let story = {};
  let contributions = {};
  const upvotedContributions = [];

  storyQueries.getIndividualStories(req.params.id)
    .then(data => {
      data.created_at = formatDate(data.created_at);
      story = data;
      return contributionQueries.getContributionsForStory(req.params.id);
    })
    .then(data => {
      // console.log(data);
      contributions = data;
      return upvotedContsQueries.getUpvotedContributions(req.session.userid);
    })
    .then(data => {
      // console.log(data);
      for (const upvotedCont of data) {
        upvotedContributions.push(upvotedCont.contribution_id);
      }
      console.log('upvotedContributions', upvotedContributions);

      return userQueries.getUserById(req.session.userid);
    })
    .then(data => {
      const templateVars = {
        story,
        contributions,
        upvotedContributions,
        storyId: req.params.id,
        userId: parseInt(req.session.userid),
        username: data.username
      };
      res.render('contribute', templateVars);
    }

    );
});


router.post('/:id/contribute', (req, res) => {

  const newContribution = req.body;
  newContribution.storyId = req.params.id;
  newContribution.userId = req.session.userid;

  // console.log('newContribution', newContribution);

  contributionQueries.addContribution(newContribution)
    .then(() => res.redirect(`/story/${req.params.id}/contribute`));
});



router.post('/:id/append', (req, res) => {
  const contributionId = parseInt(req.body.contribution);
  const storyId = req.params.id;
  let story = {};

  storyQueries.getIndividualStories(req.params.id)
    .then(data => {
      story = data;
      return contributionQueries.getIndividualContribution(contributionId);
    })
    .then(data => {
      const content = story.content + " " + data.contribution_content;
      storyQueries.appendToStory(storyId, content);
      return contributionQueries.markAddedToStory(contributionId);

    })
    .then(() => {

      // return contributionQueries.removeContribution(contributionId);
    })
    .then(() => res.redirect(`/story/${req.params.id}/contribute`));
});


router.post('/:id/upvote/add', (req, res) => {
  const contributionId = parseInt(req.body.upvote);
  const userId = parseInt(req.session.userid);

  contributionQueries.getIndividualContribution(contributionId)
    .then(data => {
      const upvotes = data.up_vote + 1;
      contributionQueries.addUpvote(upvotes, contributionId);
      return upvotedContsQueries.addUpvotedContribution(userId, contributionId);
    })
    .then(() => res.redirect(`/story/${req.params.id}/contribute`));
});

router.post('/:id/upvote/remove', (req, res) => {
  const contributionId = parseInt(req.body.upvote);

  contributionQueries.getIndividualContribution(contributionId)
    .then(data => {
      const upvotes = data.up_vote - 1;
      contributionQueries.removeUpvote(upvotes, contributionId);
      return upvotedContsQueries.removeUpvotedContribution(req.session.userid, contributionId);
    })
    .then(() => res.redirect(`/story/${req.params.id}/contribute`));
});


module.exports = router;
