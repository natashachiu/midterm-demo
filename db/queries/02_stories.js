const db = require('../connection');

const getAllStories = () => {
  return db.query('SELECT * FROM stories;')
    .then(data => {
      return data.rows;
    });
};
const getIndividualStories = (story_id) => {
  return db.query('SELECT * FROM stories WHERE id = $1', [story_id])
         .then(story=> {
          return story.rows[0];
         })
}
module.exports = { getAllStories, getIndividualStories };