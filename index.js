process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const express = require('express');
const app = express();
const axios = require('axios');
const { username, ipAddress } = require('./config');
const PORT = 8080;

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

app.use( express.json() );

let last_request_time = null;
const rate_limit = 15 * 1000;


axios.get(`https://${ipAddress}/api/${username}/lights/`)
    .then( response => {
        for (const [key, value] of Object.entries(response.data)) {
            lights.set(key, key)
        }
    })

const lights = new Map

app.post('/:H/:S/:B', (req, res) => {
    if (last_request_time && Date.now() - last_request_time < rate_limit) {
        res.error('Server is rate limited');
        return;
    }
    last_request_time = Date.now();
    if (!ipAddress) {
        res.send('Bridge was not found, server is rate limited');
        return;
    }
    let { H, S, B } = req.params;
    let identifier = req.body.identifier;

    let lightId = lights.get(identifier)
    if (!lightId) {
        let firstLight = lights.values().next().value;
        lightId = firstLight;
    }


    let on = true;

    axios.get(`https://${ipAddress}/api/${username}/lights/`)
    axios.put(`https://${ipAddress}/api/${username}/lights/${lightId}/state/${lightId}`, {
        on,
        ... (H && { hue: parseInt(H) }),
        ... (S && { sat: parseInt(S) }),
        ... (B && { bri: parseInt(B) }),

    }) 
        .then( response => res.send(response) )
        .catch( error => res.send(error) );
})

app.post('/off', (req, res) => {
    if (last_request_time && Date.now() - last_request_time < rate_limit) {
        res.error('Server is rate limited');
        return;
    }
    last_request_time = Date.now();
    if (!ipAddress) {
        res.send('Bridge was not found, server is rate limited');
        return;
    }
    let identifier = req.body.identifier;

    let lightId = lights.get(identifier)
    if (!lightId) {
        let firstLight = lights.values().next().value;
        lightId = firstLight;
    }

    let on = false;

    axios.put(`https://${ipAddress}/api/${username}/lights/${lightId}/state/${lightId}`, {
        on,
    }) 
        .then( response => res.send(response) )
        .catch( error => res.send(error) );
})