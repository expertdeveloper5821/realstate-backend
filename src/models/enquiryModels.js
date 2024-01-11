import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema({
    userName: { type: String, require: false },
    email: { type: String, require: false },
    phoneNumber: { type: Number, require: false },
    message:{type:String, require:false},
  });
  
  const EnquiryData = mongoose.model("EnquiryData", enquirySchema);
  export default EnquiryData;