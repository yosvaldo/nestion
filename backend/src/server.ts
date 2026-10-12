import { app } from "./app.js";
import { APP_PORT } from "./configs/env.config.js";
import cronService from "./services/cron.service.js";

cronService.init();

const PORT = Number(process.env.PORT) || Number(APP_PORT) || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});