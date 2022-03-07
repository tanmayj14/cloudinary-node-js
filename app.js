const express = require('express')
const app = express()
const port = 7000
const multer = require('multer')
const upload = multer()
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')

cloudinary.config({
    cloud_name: 'XXXXXXXXXXXXXXXXX',
      api_key: 'xxxxxxxxxxxxxxxxxxx',
      api_secret: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
})
app.get('/', (req, res) => res.json({ message: 'Welcome!' }))

app.post('/upload', upload.single('image'), function (req, res, next) {
    let streamUpload = (req) => {
        return new Promise((resolve, reject) => {
            let stream = cloudinary.uploader.upload_stream(
                (error, result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        reject(error);
                    }
                }
            );

            streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
    };

    async function upload(req) {
        let result = await streamUpload(req);
        console.log(result); 
        return res.send(result); 
    }

    upload(req);
});

app.listen(port, () => console.log(`This is the beginning of the Node File Upload App`))