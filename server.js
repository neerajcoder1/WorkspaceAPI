require("dotenv").config();

const app = require("./src/app");
const { testConnection } = require("./src/config/db");

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await testConnection();

    app.listen(PORT, () => {
      console.log(`WorkSphere API running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start WorkSphere API.");
    process.exit(1);
  }
}

startServer();
