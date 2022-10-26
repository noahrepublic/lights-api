process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const express = require('express');
const app = express();
const axios = require('axios');
const { applicationKey, ipAddress } = require('./config');
const PORT = 8080;

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

app.use( express.json() );


/*axios.get('https://discovery.meethue.com/')
    .then( response => {
        bridge = response.data[0].internalipaddress;
        console.log(bridge);
    })
    .catch( error => console.error(error.message) );
*/

// Functions //

function RGBtoXY(red, green, blue) {
    red = red > 255 ? 255 : red;
    green = green > 255 ? 255 : green;
    blue = blue > 255 ? 255 : blue;

    red = red < 0 ? 0 : red;
    green = green < 0 ? 0 : green;
    blue = blue < 0 ? 0 : blue;

    R = red / 255.0;
    G = green / 255.0;
    B = blue / 255.0;

    return R, G, B;
}
   


axios.get(`https://${ipAddress}/clip/v2/resource/device`, {
        rejectUnauthorized: false,
        headers: {
            "hue-application-key": applicationKey
        },
    })
        .then( response => {
            const data = response.data.data;
            for (let i = 1; i < data.length; i++) {
                lights.set(data[i].metadata.name, data[i].id);
            }
        })
        .catch( error => res.send(error) );

const lights = new Map

app.post('/:R/:G/:B', (req, res) => {
    if (!ipAddress) {
        res.send('Bridge was not found, server is rate limited');
        return;
    }
    let { R, G, B } = req.params;
    let identifier = req.body.identifier;

    let lightId = lights.get(identifier)
    if (!lightId) {
        let firstLight = lights.values().next().value;
        lightId = firstLight;
    }
    let X, Y, Z = RGBtoXY(R, G, B);

    axios.put(`https://${ipAddress}/clip/v2/resource/light/${lightId}`, {
        rejectUnauthorized: false,
        headers: {
            "hue-application-key": applicationKey
        },
        body: {
            "on": {
                "on": true
            },
            "dimming": {
                "brightness": Z
            },
            "color": {
                "xy": {
                    "x": X,
                    "y": Y
                }
            }
        }
    })
        .then( response => res.send("Success") )
        .catch( error => res.send(error) );
    
    
    console.log(lights[0]);
})