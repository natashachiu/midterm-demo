const db = require('../connection');

const getUpvotedContributions = function(userId) {
  return db.query('SELECT * FROM upvoted_contributions WHERE user_id = $1;', [userId])
    .then(data => {
      return data.rows;
    });
};

const addUpvotedContribution = (userId, contributionId) => {
  return db.query('INSERT INTO upvoted_contributions (user_id, contribution_id) VALUES ($1, $2) RETURNING *;', [userId, contributionId])
    .then(result => result.rows[0]);
};

const removeUpvotedContribution = (userId, contributionId) => {
  return db.query('DELETE FROM upvoted_contributions WHERE user_id = $1 AND contribution_id = $2 RETURNING *;', [userId, contributionId])
    .then(result => result.rows);
};


module.exports = { getUpvotedContributions, addUpvotedContribution, removeUpvotedContribution };
