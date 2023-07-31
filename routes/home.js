/*
 * All routes for User Data are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /api/users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();
const userQueries = require('../db/queries/01_users');

router.get('/', (req, res) => {

  // return res.render('home');
  userQueries.getUsers()
    .then(users => {
      const templateVars = { users };
      console.log(users);
      return res.render('home', templateVars);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});
router.get('/:id',(req,res)=>{
  userQueries.getUserById(req.params.id)
      .then(user=>{
       console.log(res.json(user));
      })
})

module.exports = router;
