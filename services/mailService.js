
import nodemailer from "nodemailer";
import dotenv from 'dotenv';
// import path from "path";

dotenv.config({path:'./.env'}); //set path

let transporter = nodemailer.createTransport({
  
  service:process.env.SERVICE,
  host:process.env.HOST,
  port:process.env.MAILPORT,//default
  secure: false,// true for 465,false for other ports
  auth: {
    user:process.env.EMAIL, // generated ethereal user
    pass:process.env.EMAILPASSWORD, // generated ethereal password
  },
});



 function sendContactMail(userName,bussinessEmail,organization,designation,phoneNo,message,callback){

  let info={
    from:process.env.EMAIL,
    to:process.env.INFO_MAIL,
    subject:"Contact Inquiry by: "+userName,
    text:"Contact Us",
    html:`From: ${userName} (${bussinessEmail})<br>Organization: ${organization}<br>Designation: ${designation}<br>Phone Number:${phoneNo}<br>
    Message: ${message}`,
  }

  transporter.sendMail(info,callback);
}

function sendApplyMail(userName,email,phoneNo,jobRole,cv,callback){
  let info={
    from:process.env.EMAIL,
    to:process.env.CAREERS_MAIL,
    subject:"Job Apply by: "+userName,
    text:"Apply for job",
    html:`From: ${userName} (${email})<br>Phone Number: ${phoneNo}<br>Job Role: ${jobRole}<br>Resume: `,
    attachments:[
      {
        filename:cv.originalname,
        path:"./"+cv.path,
        contentType:cv.mimetype
      }
    ]
  }

  transporter.sendMail(info,callback);
}

export default {sendContactMail,sendApplyMail};