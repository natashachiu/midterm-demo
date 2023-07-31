const db = require('../connection');

const getUsers = () => {
  return db.query('SELECT * FROM users;')
    .then(data => {
      return data.rows;
    });
};
const getUserById = (user_id) => {
  return db.query('SELECT * FROM users WHERE id = $1', [user_id])
         .then(user=> {
          return user.rows[0];
         })
}
module.exports = { getUsers, getUserById };
