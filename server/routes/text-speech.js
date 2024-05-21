const express = require('express');
const router = express.Router();
const textToSpeech = require('@google-cloud/text-to-speech');

const client = new textToSpeech.TextToSpeechClient();

router.post('/text-to-speech', async (req, res) => {
    const text = req.body.text;
    const request = {
        input: { text },
        voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
        audioConfig: { audioEncoding: 'MP3' },
    };

    try {
        const [response] = await client.synthesizeSpeech(request);
        res.send({ audioContent: response.audioContent.toString('base64') });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send('Error generating speech.');
    }
});

module.exports = router;