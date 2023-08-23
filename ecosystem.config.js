module.exports = {
  apps: [
    {
      name: "app-instance-1", // Give a unique name to each instance
      script: "main", // Replace with your entry script
      instances: 2, // Number of instances you want to run
      exec_mode: "cluster",
      env: {
        PORT: 3000, // Set the port for the first instance
      },
    },
    {
      name: "app-instance-2",
      script: "main",
      instances: 2,
      exec_mode: "cluster",
      env: {
        PORT: 3001, // Set the port for the second instance
      },
    },
    {
      name: "app-instance-3",
      script: "main",
      instances: 2,
      exec_mode: "cluster",
      env: {
        PORT: 3002, // Set the port for the third instance
      },
    },
  ],
};
