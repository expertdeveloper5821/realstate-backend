import express from "express";
const app = express();
import "./src/config/db.js";

import userRoutes from "./src/routes/userRoute.js";
import roleRoutes from "./src/routes/adminRoute.js";
app.use(express.json());
app.use("/api/v1", userRoutes);
app.use("/api/v1",roleRoutes );

app.get("/", (req, res) => {
  res.send("welcome");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log("server is running 👍👍👍👍👍👍");
  const error = false;
  if (error) {
    console.log("error in running server", error);
  }
});
