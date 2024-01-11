import mongoose from "mongoose";

const roleschema = new mongoose.Schema({
  role: {
    type: String,
    require: false,
    enum: ["admin", "user"],
    default: "user",
  },
});

const Role = mongoose.model("Role", roleschema);
export default Role;
