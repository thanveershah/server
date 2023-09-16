const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoute = require("./routes/userRoute");
const connectDb = require("./config/db");

const app = express();

require("dotenv").config();
connectDb();

app.use(
   cors({
      origin: "http://localhost:5173",
      credentials: true,
   })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api", userRoute);

app.use("*", (req, res) => {
   res.json("This is a 404 page");
});

const port = 3003;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
