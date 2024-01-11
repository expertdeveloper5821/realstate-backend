// code of routes
import express from "express";
const userRoutes = express();
import { authmiddleware } from "../middleware/authmiddleware.js";
import {
  userRegister,
  getallUser,
  login,
  getuserByid,
  upadteUserbyId,
  deleteUserById,
  sendEmail,
  resetPassword,
  changePassword,
} from "../controller/userController.js";

userRoutes.post("/register", userRegister);
userRoutes.get("/getalluser", getallUser);
userRoutes.get("/login", login);
userRoutes.get("/getUserById", authmiddleware, getuserByid);
userRoutes.post("/updateUserById", authmiddleware, upadteUserbyId);
userRoutes.delete("/deleteUserById", authmiddleware, deleteUserById);
userRoutes.post("/sendmail", sendEmail);
userRoutes.post("/resetpassword", resetPassword);
userRoutes.post("/changepassword", authmiddleware, changePassword);

export default userRoutes;
