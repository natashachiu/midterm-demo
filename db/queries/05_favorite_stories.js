const db = require('../connection');
const addFavoriteStories = (storyId,user_Id) => {
  return db.query('INSERT INTO favorites (story_id,user_id) VALUES($1,$2) RETURNING *',[storyId,user_Id])
  .then(result => {
    return result.rows[0];
  })
};
const getFavoriteStories = (userId) => {
return db.query(`SELECT s.id, s.title, s.description, s.content, s.completed, s.created_at, s.completed_at,s.user_id,u.username
  FROM stories s
  INNER JOIN favorites f ON s.id = f.story_id
  INNER JOIN users u ON s.user_id = u.id
  WHERE f.user_id = $1`, [userId])
.then(data => {
  return data.rows;
});
};

module.exports = {addFavoriteStories, getFavoriteStories}