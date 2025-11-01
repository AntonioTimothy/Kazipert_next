module.exports = {
  apps: [
    {
      name: "kazipert-live",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      cwd: "./",
      instances: "2",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
};