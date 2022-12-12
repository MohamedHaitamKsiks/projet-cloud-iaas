const express = require('express');
const fs = require('fs');

const api = require('./api.js')

const app = express();
const port = 3000;

//add json to express app
app.use(express.json());

//add static public
app.use(express.static('public'))

//add api route
app.use('/api', api);

//send index page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

//start listening
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})
