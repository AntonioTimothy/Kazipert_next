module.exports = {
  apps: [
    {
      name: "kazipert-system",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      cwd: "./",
      instances: "2", // or 1 for single instance
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
};
