const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   "asdf1234",
//   {
//     host: process.env.DB_HOST,
//     dialect: "mysql",
//   }
// );

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
});


// const sequelize = new Sequelize('aabb', 'root', 'asdf1234', {
//   host: 'localhost',
//   dialect: 'mysql',
// });

module.exports = sequelize;
