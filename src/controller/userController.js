import Jwt from "jsonwebtoken";
import Data from "../models/userModel.js";
import Role from "../models/adminModel.js";
import bcrypt, { compare, genSalt } from "bcrypt";
import {
  validateEmail,
  validatePhoneNumber,
  validatepassword,
} from "../utils/validation.js";
import envConfig from "../config/envConfig.js";
import transporter from "../middleware/emailConfig.js";

const userRegister = async (req, res) => {
  try {
    const { userName, email, password, confirmpassword, phoneNumber } =
      req.body;
    if (!userName || !email || !password || !confirmpassword || !phoneNumber) {
      return res.status(400).json({ message: "all field are requried" });
    }

    const findemail = await Data.findOne({ email });
    if (findemail) {
      return res.status(401).json({ mesage: "email already exists" });
    }
    const isemailvalid = validateEmail(email);
    if (!isemailvalid) {
      return res.status(404).json({ message: "plz enter valid email" });
    }
    const isnumbervalid = validatePhoneNumber(phoneNumber);
    if (!isnumbervalid) {
      return res
        .status(404)
        .json({ message: "phone number require 10 digits" });
    }
    const salt = await bcrypt.genSalt(15);
    const hashpassword = await bcrypt.hash(password, salt);
    const hashpasswordconfrim = await bcrypt.hash(confirmpassword, salt);

    const isvalidpassword = validatepassword(password);
    if (!isvalidpassword) {
      return res.status(404).json({
        message:
          "password at least contain 8 chracter and one uppercase letter and one special letter ",
      });
    }

    if (password !== confirmpassword) {
      return res
        .status(201)
        .json({ message: "confirmpassword is not matched with  password " });
    }

    const userRole = await Role.findOne({ role: "user" });
    const newDoc = new Data({
      userName,
      email,
      password: hashpassword,
      confirmPassword: hashpasswordconfrim,
      phoneNumber,
      role: userRole._id,
    });
    const saveUser = newDoc.save();
    if (saveUser) {
      return res.status(200).json({ message: "user register succesfully" });
    } else {
      return res.status(500).json({ message: "user not register", error });
    }
  } catch (error) {
    console.error("Error in user registration");
    return res
      .status(500)
      .json({ message: "error in user registration", error });
  }
};

// login api
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const findemail = await Data.findOne({ email }).populate("role");
    if (!findemail) {
      return res.status(404).json({ message: "user not found" });
    }
    const matchpassword = await bcrypt.compare(password, findemail.password);
    if (!matchpassword) {
      return res.status(404).json({ message: "worng password" });
    }
    const token = Jwt.sign(
      {
        _id: findemail._id,
        userName: findemail.userName,
        email: findemail.email,
        phoneNumber: findemail.phoneNumber,
        password: findemail.password,
        role: findemail.role,
      },
      envConfig.SECRET_KEY,
      { expiresIn: "1h" }
    );
    const userdata = {
      token: token,
    };
    return res.status(200).json({ message: "login succesfully", userdata });
  } catch (error) {
    console.error("Error in finding user");
    return res.status(500).json({ message: "error in  finding user ", error });
  }
};

// get all user
const getallUser = async (req, res) => {
  try {
    const finduser = await Data.find({});
    if (!finduser) {
      return res.status(404).json({ message: "user not found" });
    } else {
      return res.status(200).json({ message: "user found", finduser });
    }
  } catch (error) {
    console.error("Error in finding user");
    return res.status(500).json({ message: "error in  finding user ", error });
  }
};

// getuser by id
const getuserByid = async (req, res) => {
  try {
    const userId = req.user?._id;
    const findbyid = await Data.findById(userId);
    if (!findbyid) {
      return res.status(404).json({ message: "user not found" });
    } else {
      return res.status(200).json({ message: "user found by id", findbyid });
    }
  } catch (error) {
    console.error("Error in finding user");
    return res
      .status(500)
      .json({ message: "error in  finding user by id ", error });
  }
};

// update user by id
const upadteUserbyId = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { userName, phoneNumber } = req.body;
    const updatebyid = await Data.findByIdAndUpdate(
      userId,
      { userName, phoneNumber },
      { new: true }
    );
    if (!updatebyid) {
      return res.status(400).json({ message: "user not updated" });
    } else {
      return res
        .status(200)
        .json({ message: "user updated succesfully", updatebyid });
    }
  } catch (error) {
    console.error("Error in updating user");
    return res
      .status(500)
      .json({ message: "error in  updating user by id ", error });
  }
};

// delete user by id
const deleteUserById = async (req, res) => {
  try {
    const userId = req.user?._id;
    const deleteuser = await Data.findByIdAndDelete(userId);
    if (!deleteuser) {
      return res.status(404).json({ message: "user not delete" });
    } else {
      return res.status(200).json({ message: "user deleted succesfully" });
    }
  } catch (error) {
    console.error("Error in deleting user");
    return res
      .status(500)
      .json({ message: "error in  deleting user by id ", error });
  }
};

// forgot password
const sendEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (email) {
      const user = await Data.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "email not found" });
      } else {
        const genToken = Jwt.sign({ _id: user._id }, envConfig.SECRET_KEY, {
          expiresIn: "1h",
        });
        const link = `http://localhost:3000/reset-password/?token=${genToken}`;
        await transporter.sendMail({
          from: envConfig.EMAIL_USER,
          to: email,
          subject: "reset your passsword",
          html: `click here to reset your password <a href=${link}>click here</a>`,
        });
        return res
          .status(201)
          .json({ messgae: " email is send plese check your email" });
      }
    }
  } catch (error) {
    console.error("Error in sending mail");
    return res.status(500).json({ message: "mail not sent", error });
  }
};

// reset password
const resetPassword = async (req, res) => {
  const { newPassword, confirmPassword } = req.body;
  try {
    const token = req.query.token;
    const decode = Jwt.verify(token, envConfig.SECRET_KEY);
    const user = await Data.findById(decode._id);

    if (!newPassword) {
      return res.status(404).json({ message: "newpassword is requried " });
    }

    if (!confirmPassword) {
      return res.status(404).json({ message: "confrimpassword is requried " });
    }

    if (newPassword !== confirmPassword) {
      return res
        .status(500)
        .json({ message: "confirm password is not equal to newpassword" });
    } else {
      const salt = await bcrypt.genSalt(10);
      const newHashpassword = await bcrypt.hash(newPassword, salt);
      user.password = newHashpassword;
      await user.save();
      return res.status(200).json({ message: "passsword reset succesfully" });
    }
  } catch (error) {
    console.error("Error reset password");
    return res.status(500).json({ message: "errro in reset password", error });
  }
};

// change password
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user?._id;
    const user = await Data.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const oldpass = await bcrypt.compare(oldPassword, user.password);
    if (!oldpass) {
      return res.status(500).json({ message: "oldPassword is not matched" });
    }

    if (newPassword !== confirmPassword) {
      return res
        .status(500)
        .json({ message: "newpassword is not matched with confirmpassword " });
    }
    const salt = await bcrypt.genSalt(10);
    const newHashpassword = await bcrypt.hash(newPassword, salt);
    user.password = newHashpassword;
    const updateOne = await Data.findByIdAndUpdate(
      userId,
      { password: newHashpassword },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "oldPassword is updated", updateOne });
  } catch (error) {}
};

export {
  userRegister,
  getallUser,
  getuserByid,
  login,
  upadteUserbyId,
  deleteUserById,
  sendEmail,
  resetPassword,
  changePassword,
};
