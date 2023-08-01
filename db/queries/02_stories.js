const db = require('../connection');

const getAllStories = () => {
  return db.query('SELECT * FROM stories;')
    .then(data => {
      return data.rows;
    });
};
const getIndividualStories = (storyId) => {
  return db.query('SELECT * FROM stories WHERE stories.id = $1', [storyId])
    .then(story => {
      return story.rows ? story.rows[0] : null;
    });
};

const createNewStories = (values)=>{
  const query = 'INSERT INTO stories (title, description, content, completed, created_at, completed_at, is_fav) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';

  // Use the `db.query` method with the SQL query and values.
  return db.query(query, [values.title, values.description, values.content, values.completed, values.created_at, values.completed_at, values.is_fav])
    .then(result => {
      // Return the result to the caller.
      return result.rows[0]; // Assuming we are returning the first row (the newly inserted story).
    })
}

module.exports = { getAllStories, getIndividualStories, createNewStories };
