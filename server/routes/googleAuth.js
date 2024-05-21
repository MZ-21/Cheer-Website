const axios = require("axios");
const cred = require("./cred.json").web;

function getLoginUrl() {
    const url = `https://accounts.google.com/o/oauth2/auth?client_id=${cred.client_id}&redirect_uri=${cred.redirect_uris[2]}&access_type=offline&response_type=code&scope=https://www.googleapis.com/auth/photoslibrary.readonly&state=new_access_token&include_granted_scopes=true&prompt=consent`;
    return url;
}



async function getNewRefreshedToken(code) {
    const data = {
        client_id: cred.client_id,
        client_secret: cred.client_secret,
        code: code,
        grant_type: "authorization_code",
        redirect_uri: cred.redirect_uris[2]
    };

    const response = await axios.post("https://oauth2.googleapis.com/token", data);
    
    return response.data
}
module.exports = {
    getLoginUrl,
    getNewRefreshedToken
};
