DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS images;

CREATE TABLE images(
    id SERIAL PRIMARY KEY,
    url VARCHAR NOT NULL,
    username VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    comment VARCHAR(255),
    username VARCHAR(255),
    image_id INT REFERENCES images(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);