const db = require('../connection');

const getContributionsForStory = (storyId) => {
  return db.query('SELECT * FROM contributions WHERE story_id = $1;', [storyId])
    .then(data => {
      return data.rows;
    });
};
// const getIndividualContribution = (contributionId) => {
//   return db.query('SELECT * FROM contributions WHERE id = $1', [contributionId])
//     .then(contribution => {
//       return contribution.rows[0];
//     });
// };

const addContribution = (newCont) => {
  const queryString = `INSERT INTO contributions (story_id, user_id, contribution_content)
  VALUES ($1, $2, $3)
  RETURNING *;`;

  const queryParams = [parseInt(newCont.storyId), parseInt(newCont.userId), newCont.content];
  return db.query(queryString, queryParams)
    .then(result => result.rows[0]);
};
module.exports = { getContributionsForStory, addContribution };
