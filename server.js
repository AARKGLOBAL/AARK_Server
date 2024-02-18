import dotenv from 'dotenv';
dotenv.config({path:'./.env'}); //set path

import express from "express";
import cors from 'cors';
import {IndexRoutes} from "./Routes/IndexRoutes.js";
import {Message} from "./Routes/Message.js";
import {Client} from "./Routes/Client.js";

const app = express();
const port =process.env.PORT || 3000;
// app.use(express.static(path.join(__dirname, 'media')));

app.use(express.static('./media/timeline'));
app.use(express.static('./media'));
app.use(express.static('./'));

// production script
app.use(express.static('./View/dist'));

app.use(express.json());
app.use(express.urlencoded({extended:true}))
// app.use(cors());

const allowedOrigins = ['https://aark-website.onrender.com','https://aarkwebsite.azurewebsites.net','http://localhost:3000'];
const corsOptions = {
    origin: function (origin, callback) {
        // Check if the origin is allowed or if it's a same-origin request (null)
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
    methods: 'POST',
    credentials: true, // enable passing credentials (cookies, HTTP authentication) across domains
  };

  // Custom CORS error handling middleware
const handleCorsError = (err, req, res, next) => {
    if (err.message === 'Not allowed by CORS') {
        console.log("cors")
      res.status(400).json({Response:"",Error:"Not allowed by CORS",Status:400});
    } else {
      next(err);
    }
  };

app.use(cors(corsOptions));
app.use(handleCorsError);

app.use('/',Message);
app.use('/User',IndexRoutes);
app.use('*',Client);
// console.log(app.get('env'))
// console.log(process.env.PORT)

app.listen(port,()=>{console.log("port no.: ",port);});
