const path = require("path");

const PROJECT_ROOT = path.resolve(__dirname, "..");
const BRAIN_DIR = path.join(PROJECT_ROOT, "brain");

module.exports = {
  apps: [
    {
      name: "aethery-brain",
      script: path.join(BRAIN_DIR, "dist", "main.js"),
      cwd: BRAIN_DIR,
      // Env comes from brain/.env (loaded by dotenv in main.ts)
      autorestart: true,
      restart_delay: 5000,
      max_restarts: 50,
      watch: false,
      out_file: path.join(PROJECT_ROOT, "logs", "aethery-brain.log"),
      error_file: path.join(PROJECT_ROOT, "logs", "aethery-brain.err.log"),
      merge_logs: true,
    },
  ],
};
