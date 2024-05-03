import createScheduledAppRG from "./scheduled.service";

var cron = require("node-cron");
const time = String(process.env.API_NODECRON_SCHEDULED_APP_TIME);
cron.schedule(time, async () => {
  console.log("running every minute.");
  console.log("Se ejecuta Scheduled app Regular Giving.");
  // Scheduled app Regular Giving
  const createAppRG = await createScheduledAppRG();
});
