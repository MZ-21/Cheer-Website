const router = require("express").Router();
const axios = require("axios")
const { getLoginUrl, getNewRefreshedToken } = require("./googleAuth");
const ImagesGallery = require('../models/galleryImages')
const TokenG = require('../models/galleryTokens')
const cred = require("./cred.json").web;

async function refreshAccessToken(clientId, clientSecret, refreshToken) {
  const tokenEndpoint = 'https://oauth2.googleapis.com/token';
  const payload = {
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token'
  };

  try {
      const response = await axios.post(tokenEndpoint, payload);
      const tokenData = response.data;
      const newAccessToken = tokenData.access_token;
      const expiresIn = tokenData.expires_in;
      // Optionally, handle and store the new access token and its expiration time
      return { newAccessToken, expiresIn };
  } catch (error) {
      console.error('Error refreshing access token:', error.response ? error.response.data : error.message);
      return null;
  }
}



// Endpoint to redirect users to Google OAuth2 login page
router.get('/images', (req, res) => {
    try {
        const loginUrl = getLoginUrl();
        //res.redirect(loginUrl);
        //instead or redirecting sending the login back to frontend
        res.json({ loginUrl });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Function to fetch photos from Google Photos using access token
async function fetchPhotos(accessToken) {
  try {
    if (!accessToken) {
      throw new Error('Access token is missing or invalid');
    }

    // Make a GET request to the Google Photos API
    const response = await axios.get('https://photoslibrary.googleapis.com/v1/mediaItems', {
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    });

    // Parse the response and extract the photos
    const photos = response.data.mediaItems;

    return photos;
  } catch (error) {
    if (error.response) {
      console.error('API Error:', error.response.data.error);
      //throw new Error('Failed to fetch photos from Google Photos API');
    } else {
      console.error('Request Error:', error.message);
      //throw new Error('Failed to fetch photos: ' + error.message);
    }
  }
}



// Endpoint to handle Google OAuth2 callback
router.get('/gimages', async (req, res) => {
  try {
      const code = req.query.code;
      const token= await getNewRefreshedToken(code);//the refresh token
      const photos = await fetchPhotos(token.access_token);
  
      const newToken = await TokenG({
        accessToken : token.access_token,
        refreshToken: token.refresh_token,
        accessTokenExpiresAt: token.expires_in

      }).save();
      // Store the fetched photos in the MongoDB database
      const storedPhotos = await Promise.all(photos.map(async (photo) => {
          try {
              // Check if the photo already exists in the database based on imageId
              const existingPhoto = await ImagesGallery.findOne({ imageId: photo.id });

              if (!existingPhoto) {
                  // If the photo doesn't exist, save it to the database
                  const newImage = new ImagesGallery({
                      baseUrl: photo.baseUrl,
                      filename: photo.filename,
                      imageId: photo.id,
                      creationTime: photo.creationTime,
                      height: photo.height,
                      width: photo.width,
                      mimeType: photo.mimeType,
                      productUrl: photo.productUrl
                      // Store other relevant image metadata here
                  });

                  // Save the new image to the database
                  return await newImage.save();
              }
          } catch (error) {
              console.error("Error saving photo:", error);
              // You can choose to handle this error differently, depending on your use case
          }
      }));

      // Filter out any null values (photos that already existed)
      const newPhotos = storedPhotos.filter(photo => photo !== null);



      res.json({ message: "Images have been uploaded to the database" });
  } catch (error) {
      console.error("Error fetching photos:", error);
      res.status(500).json({ error: error.message });
  }
});


//fetching images from the database
router.get('/fetchImages', async (req, res) => {
  try {
     
    const token = await TokenG.find();
    const expiresAtDate = new Date(token[0].accessTokenExpiresAt);

// Convert the Date object to a numeric timestamp
    const expiresAtTimestamp = expiresAtDate.getTime();
    if(expiresAtTimestamp< Date.now()){
   
        refreshAccessToken(cred.client_id, cred.client_secret, token[0].refreshToken)
        .then((result) => {
        if (result) {
            console.log('New Access Token:', result.newAccessToken);
            console.log('Expires In:', result.expiresIn);
            // Use the new access token for making authorized requests to the Google Photos API
        } else {
        console.log('Failed to refresh access token.');
    }
})
.catch((error) => {
    console.error('Error:', error);
});      
    }

     // fetchPhotos("1//05YaHiFP3RbaiCgYIARAAGAUSNwF-L9Iryq9VK1DlFgwqpppgc7FrHGtNvqI3ARMs-zlQKphkce3akzSnjrKw4rBPmfVvHrixWM0");
      // Query the database to retrieve all stored images
      const images = await ImagesGallery.find();
      // Send the retrieved images as a response
      res.json({ images });
  } catch (error) {
      // Handle errors
      res.status(500).json({ error: error.message });
  }
});
module.exports = router;


