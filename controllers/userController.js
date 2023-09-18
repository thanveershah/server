const { Users } = require("../models/userModel");
const { generatePasswordHash, comparePasswordHash } = require("../utils/bcrypt");
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require("../utils/jwt");

const signup = async (req, res) => {
   try {
      const { username, password } = req.body;
      // Check if user exist in the DB
      const isExist = await Users.findOne({ username });
      if (isExist) {
         return res.status(400).json({
            message: "User Already Exist",
         });
      }
      // Create new user
      const hashedPassword = await generatePasswordHash(password);
      await Users.create({ username, password: hashedPassword });

      res.json({
         message: "Account has been Created",
      });
   } catch (error) {
      res.json({
         message: error.message,
      });
   }
};

const login = async (req, res) => {
   const { username, password } = req.body;

   const accessToken = generateAccessToken(username);
   const refreshToken = "testing_refresh";

   res.cookie("refreshToken", refreshToken, {
      httpOnly: false,
      secure: true,
      sameSite: "none",
      domain: "a5a0-2001-8f8-1473-3303-a880-a31a-1023-3bdc.ngrok-free.app",
      path: "/",
   });

   res.json({ _id: username, username: username, accessToken });
};

const profile = async (req, res) => {
   const user = await Users.findById(req.userId).select("-password");
   res.json(user);
};

const refreshToken = async (req, res) => {
   const userId = verifyRefreshToken(req.cookies.refreshToken);

   if (!userId) {
      return res.status(401).json({ message: "Refresh Token is expired" });
   }

   const accessToken = generateAccessToken(userId);
   const refreshToken = generateRefreshToken(userId);

   res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
   });
   res.json({ accessToken });
};

const logout = async (req, res) => {
   res.clearCookie("refreshToken");
   res.json({ message: "Logged Out" });
};

module.exports = { login, signup, profile, refreshToken, logout };
