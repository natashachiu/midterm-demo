const express = require('express');
const router = express.Router();
const newStories= require('../db/queries/02_stories');

router.get('/',(req,res)=>{
  res.render('newStory');
});
router.post('/', async (req, res) => {
    const user_id = req.session.userid;
    const { title, description, content } = req.body;
  
    try {
      const result = await newStories.createNewStories({
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
  
});

module.exports = router;