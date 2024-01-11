// userModel
// code of user schema
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userName: { type: String, require: false },
  email: { type: String, require: false },
  password: { type: String, require: false },
  confirmpassword: { type: String, require: false },
  phoneNumber: { type: Number, require: false },
  role: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: false },
});

const Data = mongoose.model("Data", userSchema);
export default Data;
