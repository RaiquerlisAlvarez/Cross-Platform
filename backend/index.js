const express = require('express');
const axios = require('axios');
const cors = require('cors');

const bodyparser = require('body-parser');

const app = express();

const cors_initial = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
}

app.use(express.json());
app.use(cors(cors_initial));

const API_KEY = '6969063d-4905-4144-88c9-c07e9b9120ba';

app.get('/getprice', async(req, res) => {
    const url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest';
    
    // Set query parameters
    const params = {
        symbol: 'BTC',
        convert: 'USD'
    };

    const headers = {
        'Accepts': 'application/json',
        'X-CMC_PRO_API_KEY': API_KEY,
    };

    try {
        const response = await axios.get(url, { headers, params });
        const bitcoinPrice = response.data.data.BTC.quote.USD.price;
        res.json({price : bitcoinPrice.toFixed(2)})
    } catch (error) { 
        console.error('Error fetching the Bitcoin price:', error.response ? error.response.data : error.message);
    }
});


app.listen(5000, () => {
    console.log("Hello World");
})