const fs = require("fs");

module.exports = {
  development: {
    username: process.env.API_MYSQL_USER,
    password: process.env.API_MYSQL_PASSWORD,
    database: process.env.API_MYSQL_DATABASE,
    host: process.env.API_MYSQL_HOST,
    port: Number(process.env.API_MYSQL_PORT),
    dialect: "mysql",
    dialectOptions: {
      bigNumberStrings: true,
    },
  },
  test: {
    username: process.env.API_MYSQL_USER,
    password: process.env.API_MYSQL_PASSWORD,
    database: process.env.API_MYSQL_DATABASE,
    host: process.env.API_MYSQL_HOST,
    port: Number(process.env.API_MYSQL_PORT),
    dialect: "mysql",
    dialectOptions: {
      bigNumberStrings: true,
    },
  },
  production: {
    username: process.env.API_MYSQL_USER,
    password: process.env.API_MYSQL_PASSWORD,
    database: process.env.API_MYSQL_DATABASE,
    host: process.env.API_MYSQL_HOST,
    port: Number(process.env.API_MYSQL_PORT),
    dialect: "mysql",
    dialectOptions: {
      bigNumberStrings: true,
      //   ssl: {
      //     ca: fs.readFileSync(__dirname + "/mysql-ca-main.crt"),
      //   },
    },
  },
};
