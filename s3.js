const aws = require('aws-sdk');
const fs = require('fs');

let awsKey;
let awsSecret;
if (process.env.AWS_KEY && process.env.AWS_SECRET) {
    awsKey = process.env.AWS_KEY; // in prod the secrets are environment variables
    awsSecret = process.env.AWS_SECRET; // in prod the secrets are environment variables
} else {
    const secrets = require('./secrets.json'); // in dev they are in secrets.json which is listed in .gitignore
    awsKey = secrets.aws.AWS_KEY;
    awsSecret = secrets.aws.AWS_SECRET;
}

const s3 = new aws.S3({
    accessKeyId: awsKey,
    secretAccessKey: awsSecret
});

exports.upload = (req, res, next) => {
    if (!req.file) {
        return res.sendStatus(500);
    }

    const { filename, mimetype, size, path } = req.file;

    const promise = s3.putObject({
        Bucket: 'sugarbaby',
        ACL: 'public-read',
        Key: filename,
        Body: fs.createReadStream(path),
        ContentType: mimetype,
        ContentLength: size
    }).promise();

    promise.then(
        () => {
            next();
            fs.unlink(path, () =>{});
        }
    ).catch(
        err => {
            res.sendStatus(500);
            console.log('err in promise (s3): ',err);
        }
    );
};