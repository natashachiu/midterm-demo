const db = require('../connection');

const getUsers = () => {
  return db.query('SELECT * FROM users;')
    .then(data => {
      return data.rows;
    });
};
const getUserById = (userId) => {
  return db.query('SELECT * FROM users WHERE id = $1', [userId])
    .then(user => {
      return user.rows[0];
    });
};
module.exports = { getUsers, getUserById };
