DROP TABLE IF EXISTS theatres CASCADE;

CREATE TABLE theatres (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL
);