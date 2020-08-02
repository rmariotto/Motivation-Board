const express = require('express');
const app = express();
const {
    getImages,
    uploadImages,
    selectedImage,
    addComment,
    getComment
} = require('./sql/data.js');
const s3 = require('./s3');
const { s3Url } = require('./config.json');

app.use(express.static('./public'));
app.use(express.json());

/////FILE UPLOAD ///////

const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});
/////////////////////////////////////////////




app.get('/images', (req, res) => {

    getImages()
        .then((result) => {
            res.json(result.rows);
        })
        .catch((err) => {
            console.log("error in getImages /images: ", err);
        });
});

app.get('/images/:id', (req, res) => {

    selectedImage(req.params.id)
        .then((result) => {
            res.json(result.rows[0]);
        })
        .catch((err) => {
            console.log("error in getImages /images:id : ", err);
        });
});


app.post('/upload', uploader.single('file'), s3.upload, (req, res) => {

    const { filename } = req.file;
    const imageUrl = `${s3Url}${filename}`;

    if (req.file) {
        uploadImages(imageUrl, req.body.username, req.body.title, req.body.description)
            .then(({ rows }) => {
                res.json(rows[0]);
            })
            .catch((err) => {
                console.log('err in addImage /upload:', err);
            });
    } else {
        res.json({
            success: false
        });
    }
});


app.get('/comments/:id', (req, res) => {

    getComment(req.params.id)
        .then((result) => {
            res.json(result.rows);
        })
        .catch((err) => {
            console.log('err in get comment/:id: ', err);
        });
});


app.post('/comments', (req, res) => {
    const { image_id, username, comment } = req.body;

    addComment(image_id, username, comment)
        .then((result) => {
            res.json(result.rows[0]);
        })
        .catch((err) => {
            console.log('err in post comment/:id: ', err);
        });
});




app.listen(8080, () => console.log('IB server is listening'));