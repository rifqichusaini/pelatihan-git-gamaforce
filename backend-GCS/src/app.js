const express = require("express");
const cors = require("cors");
require("dotenv").config();

const missionRoutes = require("./routes/missionRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/missions", missionRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
