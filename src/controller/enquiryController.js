import EnquiryData from "../models/enquiryModels.js";
import envConfig from "../config/envConfig.js";
import transporter from "../middleware/emailConfig.js";

const sendEnquiry = async (req, res) => {
   try {
    const { userName, email, phoneNumber, message } = req.body;

    if (!userName || !email || !phoneNumber || !message) {
        return res.status(400).json({ message: "All fields are required" });
    }
    console.log("userName",userName)
    console.log("message",message)
    const enquiry = new EnquiryData({ userName, email, phoneNumber, message });

    // Save the enquiry and wait for the promise to resolve
    const enquirySaved = await enquiry.save();

    if (!enquirySaved) {
        return res.status(500).json({ message: "Enquiry not saved" });
    }

    const mailOptions = {
        from: envConfig.EMAIL_USER,
        to: email,
        subject: "Thankful Email",
        html: "Thank you for making an enquiry. We will get back to you shortly."
    };

    // Send the mail and wait for the promise to resolve
    const mailSend = await transporter.sendMail(mailOptions);

    if (!mailSend) {
        // If mail is not sent, you may want to handle this differently
        return res.status(500).json({ message: 'Enquiry saved but mail not sent' });
    } else {
        return res.status(200).json({ message: 'Enquiry saved and mail sent successfully' });
    }
   } catch (error) {
        return res.status(500).json({ message: "Data not sent", error });
   }
};

export { sendEnquiry };
