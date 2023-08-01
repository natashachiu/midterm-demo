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

const appendToStory = (storyId, content) => {
  const queryString = 'UPDATE stories SET content = $1 WHERE id = $2 RETURNING *;';
  return db.query(queryString, [content, storyId])
    .then(story => {
      return story.rows ? story.rows[0] : null;
    });
};


module.exports = { getAllStories, getIndividualStories, appendToStory };
