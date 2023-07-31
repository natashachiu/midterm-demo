const db = require('../connection');

const getAllContributions = () => {
  return db.query('SELECT * FROM contributions;')
    .then(data => {
      return data.rows;
    });
};
const getIndividualContribution = (contributionId) => {
  return db.query('SELECT * FROM contributions WHERE id = $1', [contributionId])
    .then(contribution => {
      return contribution.rows[0];
    });
};
module.exports = { getAllContributions, getIndividualContribution };
