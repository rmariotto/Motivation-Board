const spicedPg = require("spiced-pg");

let db;
if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    const { pg } = require("../secrets.json");
    db = spicedPg(`postgres:${pg.user}:${pg.pass}@localhost:5432/imageboard`);
}


exports.uploadImages = (url, username, title, description) => {
    return db.query(
        `INSERT INTO images (url, username, title, description) VALUES ($1, $2, $3, $4) RETURNING *;`,
        [url, username, title, description]
    );
};

exports.getImages = () => {
    return db.query(
        `SELECT * FROM images ORDER BY id DESC ;`
    );
};

exports.selectedImage = (id) => {
    return db.query(
        `SELECT * FROM images WHERE id = $1`,
        [id]
    );
};

exports.addComment = (imageId, username, comment) => {
    return db.query(
        `INSERT INTO comments (image_id, username, comment) VALUES ($1, $2, $3) RETURNING *;`,
        [imageId, username, comment]
    );
};

exports.getComment = (id) => {
    return db.query(
        `SELECT * FROM comments WHERE image_id = $1`,
        [id]
    );
};

