module.exports = {
    apps: [
      {
        name: "server",
        script: "server.js",
        instances: "max",
        exec_mode: "cluster",
        env_production: {
          NODE_ENV: "production",
          PORT: 3000,
        },
      },
    ],
  };