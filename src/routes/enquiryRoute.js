import express from "express"
const enquiryRoute=express();
import { sendEnquiry } from "../controller/enquiryController.js";
enquiryRoute.post('/sendEnquiryMail',sendEnquiry)
export default enquiryRoute;