import { Sequelize } from "sequelize";
import * as config from "@/config/config";
// Create a Sequelize instance with MySQL connection details
const sequelize = new Sequelize(
  String(config.API_MYSQL.NAME),
  String(config.API_MYSQL.USER),
  config.API_MYSQL.PASSWORD,
  {
    host: config.API_MYSQL.HOST, // Change to your MySQL host if it's not running locally (db-mysql) "db-mysql"
    port: config.API_MYSQL.PORT,
    dialect: "mysql",
  }
);

export default sequelize;
