import nodemailer from "nodemailer";
import dotenv from 'dotenv';
// import path from "path";
import  {ClientSecretCredential} from '@azure/identity';
// import  {Client} from '@microsoft/microsoft-graph-client';

dotenv.config({path:'./.env'}); //set path

const clientId = '628517cd-d90e-4427-b4b2-899dbc660253';
const clientSecret = 'TJa8Q~EkEVOUExETwDVuGOEEqchj2re_6r0tzacl';
const tenantId = 'd65dd48f-a682-4b5f-9282-6440fdb64245';
// const redirectUri = 'http://localhost:3000/callback'; 
const userEmail = 'SMTP@aarkglobalinc.com';

// Create a Microsoft Graph client
const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
// const graphClient = Client.initWithMiddleware({
//   authProvider: async (done) => {
//     const token = await credential.getToken(['https://graph.microsoft.com/.default']);
//     console.log(token.token)
//     done(null, token.token);
//   },
// });
const getToken = async () => {
  try {
    // curl --location --request GET 
    // 'https://login.microsoftonline.com/{tenant}/oauth2/v2.0/authorize?client_id=11111111-1111-1111-1111-111111111111&response_type=code&redirect_uri=https%3A%2F%2Flocalhost%2Fmyapp%2F&response_mode=query&scope=offline_access%20User.Read%20Mail.Read&state=12345'
    const tokenResponse = await credential.getToken(['https://login.microsoftonline.com/{tenant}/oauth2/v2.0/authorize?client_id=11111111-1111-1111-1111-111111111111&response_type=code&redirect_uri=https%3A%2F%2Flocalhost%2Fmyapp%2F&response_mode=query&scope=offline_access%20User.Read%20Mail.Read&state=12345']);
    const refreshToken = tokenResponse?.token?.refreshToken;
    console.log('Refresh token:', refreshToken);
    return refreshToken;
    // Use the refresh token as needed

  } catch (error) {
    console.error('Error obtaining tokens:', error);
  }
};

const createTransporter = async () => {
  const refreshToken = await getToken();

  return nodemailer.createTransport({
    service: process.env.SERVICE,
    auth: {
      type: 'OAuth2',
      user: userEmail,
      clientId,
      clientSecret,
      refreshToken,
    },
  });
};

const transporter = await createTransporter();
let info={
  from:userEmail,
  to:"sapnadevi.1610a@gmail.com",
  subject:"Contact Inquiry by: sapna",
  text:"Contact Us",
  html:`From: sapna <br>Organization: aark<br>Designation: staff eng.<br>Phone Number:1234567890<br>
  Message: hii sdjahjd jhdbaas`,
}

transporter.sendMail(info,(err)=>{
  if (err) {
    console.log("email error:",err)
    // res.status(400).json({Response:"",Error:"Please enter a valid email"+err,Status:400});
 } else {
  console.log("sended!!")
 }
});
// let transporter = nodemailer.createTransport({
  
//   service:process.env.SERVICE,
//   // host:process.env.HOST,
//   // port:process.env.MAILPORT,//default
//   // secure: false,// true for 465,false for other ports
//   auth: {
//     type: 'OAuth2',
//     user:userEmail, 
//     clientId,
//     clientSecret,
//     refreshToken: await getToken(),
//   },
// });


 function sendContactMail(userName,bussinessEmail,organization,designation,phoneNo,message,callback){

  let info={
    from:userEmail,
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
