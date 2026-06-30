const path = require("path");

const PROJECT_ROOT = path.resolve(__dirname, "..");

module.exports = {
  apps: [
    {
      name: "claude-rc-xaolonist",
      script: "claude",
      args: "remote-control --name xaolonist.eth --permission-mode acceptEdits",
      cwd: PROJECT_ROOT,
      interpreter: "none",
      autorestart: true,
      restart_delay: 10000,
      max_restarts: 50,
      watch: false,
      out_file: path.join(PROJECT_ROOT, "logs", "claude-rc.log"),
      error_file: path.join(PROJECT_ROOT, "logs", "claude-rc.err.log"),
      merge_logs: true,
    },
  ],
};
