const express = require('express');
const router = express.Router();

const storyQueries = require('../db/queries/05_favorite_stories');
const userQueries = require('../db/queries/01_users');

// router.get('/', (req, res) => {
//   const userId = req.session.userid;
//   if (!userId) {
//     const templateVars = {
//       userId: null,
//       username: null
//     };
//     return res.render('login-error', templateVars);
//     // }
//     // if (!userId) {
//     //
//   } else {
//     storyQueries.getFavoriteStories(userId)
//       .then(stories => {
//         const templateVars = { stories };
//         return res.render('favorite-stories', templateVars);
//       })
//       .catch(err => {
//         res
//           .status(500)
//           .json({ error: err.message });
//       });
//   }

// });


router.get('/', (req, res) => {
  const userId = req.session.userid;
  let stories = {};
  if (!userId) {
    const templateVars = {
      userId: null,
      username: null
    };
    return res.render('login-error', templateVars);
    // }
    // if (!userId) {
    //   res.render('login-error');
  } else {
    storyQueries.getFavoriteStories(userId)
      .then(data => {
        stories = data;
        return userQueries.getUserById(userId);

      })
      .then(data => {
        const templateVars = { stories, userId, username: data.username };
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
