const db = require('../connection');

const getContributionsForStory = (storyId) => {
  return db.query('SELECT * FROM contributions WHERE story_id = $1;', [storyId])
    .then(data => {
      return data.rows;
    });
};
const getIndividualContribution = (contributionId) => {
  return db.query('SELECT * FROM contributions WHERE id = $1;', [contributionId])
    .then(data => {
      return data.rows[0];
    });
};

const addContribution = (newCont) => {
  const queryString = `INSERT INTO contributions (story_id, user_id, contribution_content)
  VALUES ($1, $2, $3)
  RETURNING *;`;

  const queryParams = [parseInt(newCont.storyId), parseInt(newCont.userId), newCont.content];
  return db.query(queryString, queryParams)
    .then(result => result.rows[0]);
};

const removeContribution = (contributionId) => {
  return db.query('DELETE FROM contributions WHERE id = $1 RETURNING *;', [contributionId])
    .then(result => result.rows);
};

const addUpvote = (upvotes, contributionId) => {
  return db.query('UPDATE contributions SET up_vote = $1 WHERE id = $2 RETURNING *;', [upvotes, contributionId])
    .then(result => result.rows[0]);
};

const removeUpvote = (upvotes, contributionId) => {
  return db.query('UPDATE contributions SET up_vote = $1 WHERE id = $2 RETURNING *;', [upvotes, contributionId])
    .then(result => result.rows[0]);
};

module.exports = { getContributionsForStory, getIndividualContribution, addContribution, removeContribution, addUpvote, removeUpvote };
