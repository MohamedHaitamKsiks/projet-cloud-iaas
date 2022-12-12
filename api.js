const express = require('express');
const fs = require('fs');
const uuid = require('uuid');
const fileUpload = require('express-fileupload');

//create api router
const api = express.Router();
api.use(fileUpload({}));

//get image
api.get('/:directory/:image', (req, res) => {
    console.log(req.params.image);
    res.sendFile(__dirname + '/' + req.params.directory + '/' + req.params.image);
});

// get image lists
api.get('/images', (req, res) => {
    let images = [];
    fs.readdir('./images', (err, files) => {
        //throw err
        if (err)
            throw err;
        //go throw each file
        files.forEach((file) => {
            images.push('/images/' + file);
        });
        //resposnse
        res.send(images);
    });
});

// upload to tmp
api.post('/upload', (req, res) => {
    //get file
    let imageFile = req.files.image;
    let imageExtension = imageFile.name.split('.')[1];
    //create new file id
    let imageId = uuid.v4();
    let imageName = imageId + '.' + imageExtension

    fs.writeFile('tmp/' + imageName, imageFile.data, () => {
        console.log("file uploaded!");
    });
    //delte after 5 mins
    setTimeout(() => {
        fs.rm('tmp/' + imageName, (err) => {});
    }, 60000);
    //set image name
    res.send(imageName);
});

//confirm upload
api.post('/confirm', (req, res) => {
    let image = req.body.image;
    const fileExiste = fs.existsSync('tmp/' + image);
    if (fileExiste)
        fs.copyFile('tmp/' + image, 'images/' + image, (err) => {
            res.send({success: true});
        });
    else
        res.send({success: false});
});

module.exports = api;