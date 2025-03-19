-- Create the database (if it doesn't already exist)
CREATE DATABASE endangered;

-- Connect to the database
\c endangered;

-- Create the species table
CREATE TABLE species (
    id INT PRIMARY KEY,
    commonName TEXT NOT NULL,
    scientificName TEXT NOT NULL,
    conservationStatus TEXT NOT NULL,
    wildPopulation INT
);

-- Create the individuals table
CREATE TABLE individuals (
    id SERIAL PRIMARY KEY,
    nickname VARCHAR(255) NOT NULL,
    species_id INT REFERENCES species(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create the sightings table
CREATE TABLE sightings (
    id SERIAL PRIMARY KEY,
    sighting_time TIMESTAMP NOT NULL,
    individual_id INT REFERENCES individuals(id),
    location TEXT NOT NULL,
    appeared_healthy BOOLEAN NOT NULL,
    sighter_email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert species data
INSERT INTO species (id, commonName, scientificName, conservationStatus, wildPopulation)
VALUES
    (1, 'Amur Leopard', 'Panthera pardus orientalis', 'Critically Endangered', 100),
    (2, 'Black Rhino', 'Diceros bicornis', 'Critically Endangered', 6480),
    (3, 'Bornean Orangutan', 'Pongo pygmaeus', 'Critically Endangered', 104700),
    (4, 'Cross River Gorilla', 'Gorilla gorilla diehli', 'Critically Endangered', 300),
    (5, 'Eastern Lowland Gorilla', 'Gorilla beringei graueri', 'Critically Endangered', 6800),
    (6, 'Hawksbill Turtle', 'Eretmochelys imbricata', 'Critically Endangered', 23000),
    (7, 'Javan Rhino', 'Rhinoceros sondaicus', 'Critically Endangered', 76),
    (8, 'Orangutan', 'Pongo abelii, Pongo pygmaeus', 'Critically Endangered', 120000),
    (9, 'Sumatran Elephant', 'Elephas maximus sumatranus', 'Critically Endangered', 2400),
    (10, 'Sumatran Orangutan', 'Pongo abelii', 'Critically Endangered', 13800),
    (11, 'Sumatran Rhino', 'Dicerorhinus sumatrensis', 'Critically Endangered', 80),
    (12, 'Sunda Tiger', 'Panthera tigris sondaica', 'Critically Endangered', 600),
    (13, 'Vaquita', 'Phocoena sinus', 'Critically Endangered', 10),
    (14, 'Western Lowland Gorilla', 'Gorilla gorilla gorilla', 'Critically Endangered', 360000),
    (15, 'Yangtze Finless Porpoise', 'Neophocaena asiaeorientalis ssp. asiaeorientalis', 'Critically Endangered', 1000);

-- Insert individuals data (2 individuals per species)
INSERT INTO individuals (nickname, species_id)
VALUES
    -- Amur Leopard individuals
    ('Leo', 1),
    ('Luna', 1),
    -- Black Rhino individuals
    ('Rhino', 2),
    ('Rosa', 2),
    -- Bornean Orangutan individuals
    ('Orang', 3),
    ('Ollie', 3),
    -- Cross River Gorilla individuals
    ('Gor', 4),
    ('Gina', 4),
    -- Eastern Lowland Gorilla individuals
    ('Eli', 5),
    ('Eva', 5),
    -- Hawksbill Turtle individuals
    ('Shelly', 6),
    ('Tina', 6),
    -- Javan Rhino individuals
    ('Java', 7),
    ('Jasmine', 7),
    -- Orangutan individuals
    ('Opie', 8),
    ('Olivia', 8),
    -- Sumatran Elephant individuals
    ('Ellie', 9),
    ('Eliot', 9),
    -- Sumatran Orangutan individuals
    ('Sam', 10),
    ('Sally', 10),
    -- Sumatran Rhino individuals
    ('Rina', 11),
    ('Rico', 11),
    -- Sunda Tiger individuals
    ('Tigger', 12),
    ('Tara', 12),
    -- Vaquita individuals
    ('Vicky', 13),
    ('Vinnie', 13),
    -- Western Lowland Gorilla individuals
    ('Wally', 14),
    ('Wendy', 14),
    -- Yangtze Finless Porpoise individuals
    ('Yara', 15),
    ('Yuri', 15);

-- Insert sightings data (5 sightings)
INSERT INTO sightings (sighting_time, individual_id, location, appeared_healthy, sighter_email)
VALUES
    -- Sightings for Leo (Amur Leopard)
    ('2023-10-14 15:30:00', 1, 'Yellowstone North Gate', TRUE, 'scientist1@example.com'),
    ('2023-10-15 09:45:00', 1, 'Yellowstone River Valley', FALSE, 'scientist2@example.com'),
    -- Sightings for Rhino (Black Rhino)
    ('2023-10-14 12:00:00', 3, 'Serengeti Plains', TRUE, 'scientist3@example.com'),
    -- Sightings for Orang (Bornean Orangutan)
    ('2023-10-13 14:20:00', 5, 'Borneo Rainforest', TRUE, 'scientist4@example.com'),
    -- Sightings for Luna (Amur Leopard)
    ('2023-10-12 17:10:00', 2, 'Yellowstone South Gate', TRUE, 'scientist5@example.com');