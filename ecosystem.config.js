module.exports = {
  apps: [{
    name: "koa-api-server-template",
    script: "./dist/index.js",
    exec_mode: "cluster",
    instances: "2", // Or a number of instances
    max_memory_restart: "256M",
    shutdown_with_message: true,
    wait_ready: true,
  }]
};