const db = require('../connection');

const getAllStories = () => {
  return db.query('SELECT * FROM stories;')
    .then(data => {
      return data.rows;
    });
};
const getIndividualStories = (storyId) => {
  return db.query('SELECT * FROM stories JOIN users ON user_id = users.id WHERE stories.id = $1', [storyId])
    .then(story => {
      return story.rows ? story.rows[0] : null;
    });
};

const createNewStories = (values) => {
  const query = 'INSERT INTO stories (user_id,title, description, content, completed, created_at, completed_at, is_fav) VALUES ($1, $2, $3, $4, $5, $6, $7,$8) RETURNING *';

  // Use the `db.query` method with the SQL query and values.
  return db.query(query, [values.user_id, values.title, values.description, values.content, values.completed, values.created_at, values.completed_at, values.is_fav])
    .then(result => {
      // Return the result to the caller.
      return result.rows[0]; // Assuming we are returning the first row (the newly inserted story).
    });
};

const appendToStory = (storyId, content) => {
  const queryString = 'UPDATE stories SET content = $1 WHERE id = $2 RETURNING *;';
  return db.query(queryString, [content, storyId])
    .then(story => {
      return story.rows ? story.rows[0] : null;
    });
};
 const toggleCompleted = (storyId,user_id) => {
 return db.query('UPDATE stories SET completed_at = $1, completed = $2 WHERE id = $3 AND user_id = $4 RETURNING *', [new Date(),true, storyId, user_id])
  .then(result => {
       console.log('updated data');
  })

 }


module.exports = { getAllStories, getIndividualStories, appendToStory, createNewStories, toggleCompleted };
