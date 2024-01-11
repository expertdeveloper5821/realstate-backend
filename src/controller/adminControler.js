import Role from "../models/adminModel.js";
import Data from "../models/userModel.js";
import {
  validateEmail,
  validatePhoneNumber,
  validatepassword,
} from "../utils/validation.js";
import bcrypt, { compare, genSalt } from "bcrypt";
// create role
const createRole = async (req, res) => {
  try {
    const { role } = req.body;
    console.log(role);
    const exisitingrole = await Role.findOne({ role });
    if (exisitingrole) {
      return res.status(500).json({ message: "role already exists" });
    }
    const newRole = new Role({ role });
    const saveRole = await newRole.save();
    if (saveRole) {
      return res.status(200).json({ message: "role created succesfully" });
    } else {
      return res.status(500).json({ message: "role not created" });
    }
  } catch (error) {
    console.error("Error in creating role");
    return res.status(500).json({ message: "error in create role", error });
  }
};

// create admin
const createAdmin = async (req, res) => {
  try {
    const { userName, email, password, confirmpassword, phoneNumber } =
      req.body;
    if (!userName || !email || !password || !confirmpassword || !phoneNumber) {
      return res.status(500).json({ message: "all fields are requried" });
    }
    const exitingemail = await Data.findOne({ email });
    if (exitingemail) {
      return res.status(400).json({ message: "email already exists" });
    }
    const isemailvalid = validateEmail(email);
    if (!isemailvalid) {
      return res.status(400).json({ message: "plz enter valid email" });
    }
    const isphonenumbervalid = validatePhoneNumber(phoneNumber);
    if (!isphonenumbervalid) {
      return res
        .status(400)
        .json({ message: "phone number must contain 10 digits" });
    }
    const salt = await bcrypt.genSalt(15);
    const hashpassword = await bcrypt.hash(password, salt);
    const hashpasswordconfrim = await bcrypt.hash(confirmpassword, salt);

    const ispasswordvalid = validatepassword(password);
    if (!ispasswordvalid) {
      return res.status(400).json({
        message:
          "password must contain 8 letters one uppercase letter and one special chracter",
      });
    }

    const userRole = await Role.findOne({ role: "admin" });
    const newDoc = new Data({
      userName,
      email,
      password: hashpassword,
      confirmPassword: hashpasswordconfrim,
      phoneNumber,
      role: userRole,
    });
    const saveUser = newDoc.save();
    if (saveUser) {
      return res.status(200).json({ message: "admin created succesfully" });
    } else {
      return res.status(500).json({ message: "admin not created", error });
    }
  } catch (error) {
    console.error("Error in creating admin", error);
    return res.status(500).json({ message: "error in creating admin", error });
  }
};

export { createRole, createAdmin };
