const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoute = require("./routes/userRoute");
const connectDb = require("./config/db");

const app = express();

require("dotenv").config();
// connectDb();

app.use(
   cors({
      methods: "GET, POST, PUT",
      origin: "https://a5a0-2001-8f8-1473-3303-a880-a31a-1023-3bdc.ngrok-free.app",
      credentials: true,
   })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api", userRoute);

app.use("*", (req, res) => {
   res.json("This is a 404 page");
});

const port = 3004;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
