require('dotenv').config();
const router = require("express").Router();
const { google } = require('googleapis');
const {axios} = require('axios');//promise based http client  for node.js and browser
const dayjs  = require('dayjs');//parses, validates, and manipulates dates and times 
const express = require('express');
const app = express();
const cors = require("cors");

const { GoogleTokenModel } = require('../models/googletoken');
const { User } = require('../models/user');

const calendar = google.calendar({
    version: 'v3',
    auth: process.env.GOOGLE_CALENDAR_API_KEY,
})
const oauth2Client = new google.auth.OAuth2(//using OAuth2 to grant users access to the calendar
    //used my own personal email as the user support & developer contact email, this should be changed to someone else's
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
);
//Generating a url that asks permission for Google Calendar
const scopes = [
    'https://www.googleapis.com/auth/calendar'
];

//google calendar route
router.get("/google", (req, res) => {//
   const url = oauth2Client.generateAuthUrl({//will be used for logging users in, redirect users to the url
        access_type : "offline", 
        scope : scopes //only one scope so can pass it as a string
   });
   return res.json({url: url});
	
});
//redirect route
router.get("/google/redirect", async (req,res)=>{
    const code = req.query.code;//getting code from the query
    const email_user = req.query.emailuser;//getting email from query
   // console.log(email_user,"this is the email of the user");

    const { tokens } = await oauth2Client.getToken(code);//using the code to retrieve token
    oauth2Client.setCredentials(tokens);
    
    var expiryDateAccessToken;
    try{
        let user_found = await User.findOne({email: email_user});
       
        const userId_for_token =  user_found._id;
        if(userId_for_token){//found user
            const token_google =  await GoogleTokenModel.findOne({userId: userId_for_token});
           // console.log("this is tokkkkkkkkkken in redirect", token_google);
            
            if(!token_google){
               
                let tokenSaved = await new GoogleTokenModel({
                    userId: userId_for_token,
                    accessToken: tokens.access_token,
                    refreshToken: tokens.refresh_token,
                    accessTokenExpiresAt: tokens.expiry_date
                }).save();
                expiryDateAccessToken = tokens.expiry_date;
            }
            else if(tokens.refresh_token){
                token_google.refreshToken = tokens.refresh_token;
                token_google.accessToken = tokens.access_token;
                token_google.accessTokenExpiresAt = tokens.expiry_date;
                expiryDateAccessToken = tokens.expiry_date;
                await token_google.save();
            }
            else{
                token_google.accessToken = tokens.access_token;
                token_google.accessTokenExpiresAt = tokens.expiry_date;
                expiryDateAccessToken = tokens.expiry_date;
                await token_google.save();
            }
            console.log(token_google.accessTokenExpiresAt < Date.now());
        }
        else {
            console.log("this user doesnt exist");               
        }
        res.json({accessTokenExpiry: expiryDateAccessToken})
    }
    catch(error){
        console.error("This is the error while trying to find user in google redirect", error);
    }
});

router.post('/schedule_event', async (req, res)=>{//route to schedule events
    var { savedEvent, email, type } = req.body;
    var savedEventParsed = JSON.parse(savedEvent);

    //get user refresh token
    let user = await User.findOne({email: email});
    
    const userId =  user._id;

    let token = await GoogleTokenModel.findOne({userId: userId});

    oauth2Client.setCredentials({ refresh_token: token.refreshToken});
    console.log(savedEventParsed.description," this is description")
    var colorID = matchColor(savedEventParsed.label);
    
    var hour_event_s=12;
    var minute_event_s = 12;
    if(savedEventParsed.startTime.includes(":")){
        var time_event = savedEventParsed.startTime.split(':');
        hour_event_s = parseInt(time_event[0]);
        minute_event_s = parseInt(time_event[1]);

    }
    else if(savedEventParsed.startTime == ""){
        hour_event_s=12;
        minute_event_s = 12;
    }
    else {
        hour_event_s = parseInt(savedEventParsed.startTime);
        minute_event_s = 0;
    }

    var hour_event_e=12;
    var minute_event_e = 12;
    if(savedEventParsed.endTime.includes(":")){
        var time_event = savedEventParsed.endTime.split(':');
        hour_event_e = parseInt(time_event[0]);
        minute_event_e = parseInt(time_event[1]);

    }
    else if(savedEventParsed.endTime == ""){
        hour_event_e=12;
        minute_event_e = 12;
    }
    else {
        hour_event_e = parseInt(savedEventParsed.endTime);
        minute_event_e = 0;
    }

    if(type == "create"){
        calendar.events.insert({
            calendarId : "primary",
            auth: oauth2Client,
            eventId: savedEventParsed.id,
            requestBody : {
                summary : `${savedEventParsed.title}`,
                description : `${savedEventParsed.description}`,
                colorId: colorID,
                start : {
                    dateTime : dayjs(savedEventParsed.day).hour(hour_event_s).minute(minute_event_s).toISOString(),//using current date and adding 1 day
                    timeZone : "EST", //setting timezone to eastern standard time
                },
                end :{ 
                    dateTime : dayjs(savedEventParsed.day).hour(hour_event_e).minute(minute_event_e).toISOString(),
                    timeZone : "EST",
                }
            } 
        })
        .then((response)=>{
            const returned_event = response.data;
            res.json({event_saved_id: returned_event.id});

        })
        
   }
   else if(type=="update"){
        var colorID = matchColor(savedEventParsed.label);
        await calendar.events.update({
            calendarId: 'primary',
            eventId: `${savedEventParsed.id}`,
            auth: oauth2Client,
            requestBody: {
                summary : `${savedEventParsed.title}`,
                description : `${savedEventParsed.description}`,
                colorId: `${colorID}`,
                start : {
                    dateTime :  dayjs(savedEventParsed.day).hour(hour_event_s).minute(minute_event_s).toISOString(),//using current date and adding 1 day
                    timeZone : "EST", //setting timezone to eastern standard time
                },
                end :{ 
                    dateTime :  dayjs(savedEventParsed.day).hour(hour_event_e).minute(minute_event_e).toISOString(),
                    timeZone : "EST",
                }
            }
        });
    res.json("Done Updated");
   }
});
router.post('/delete_event', async (req, res)=>{
    var { savedEvent, email, type } = req.body;

    var savedEventParsed = JSON.parse(savedEvent);

    console.log("in deleted");
    //get user refresh token
    let user = await User.findOne({email: email});
    
    const userId =  user._id;

    let token = await GoogleTokenModel.findOne({userId: userId});

    oauth2Client.setCredentials({ refresh_token: token.refreshToken});
    console.log(savedEventParsed[0]);

    await calendar.events.delete({
            calendarId: 'primary',
            eventId: `${savedEventParsed[0].id}`,
            auth: oauth2Client
    })
})


function matchColor(colorID){
    if(colorID == "indigo"){
        return '1';
    }
    if(colorID == "red"){
        return '11';
    }
    if(colorID == "green"){
        return '10';
    }
    if(colorID == "blue"){
        return '9';
    }
    if(colorID == "purple"){
        return '3';
    }
    if(colorID == "gray"){
        return '8';
    }
}
module.exports = router;