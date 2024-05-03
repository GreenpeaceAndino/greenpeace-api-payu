import "reflect-metadata";
import * as config from "@/config/config";
import logger from "@/config/logger";
import app from "@/app";
import sequelize from "@/config/db-config";
import Logs from "./modules/logs/logs.model";
logger.info("Starting");
console.info(`Environment: ${config.ENVIRONMENT}`);

const port: number = config.API_PORT;
const publishPort: number = config.API_PUBLISH_PORT;

// Sync the models with the database
sequelize
  .sync({ force: false }) // If you set force to true, it will drop the tables and re-create them. Use with caution in production.
  .then(() => {
    console.log("Database and tables synced successfully.");
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });
 
// Scheduled app
const cronJob = require("./modules/scheduled_app/scheduledFunction");
// Start the server
app.listen(port, () => {
  console.log(
    `[server]: Server is running at https://localhost:${publishPort || port}!`
  );
});
