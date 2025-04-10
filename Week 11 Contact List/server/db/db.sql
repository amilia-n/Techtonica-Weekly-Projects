DROP DATABASE contact_list;

-- Create the database (if it doesn't already exist)
CREATE DATABASE contact_list;
\c contact_list;

CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    note TEXT
);

CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE contact_tags (
    contact_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (contact_id, tag_id),
    FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

INSERT INTO contacts (name, phone, email, note) VALUES
('Erin Potter', '555-123-4567', 'erin.potter@example.com', 'Met at a networking event.'),
('Marley Doyle', '555-234-5678', NULL, 'Lives in New York, works in marketing.'),
('Saba Giles', '555-345-6789', 'saba.giles@example.com', NULL),
('Don Butler', '555-456-7890', 'don.butler@example.com', 'Childhood friend.'),
('Billie Stark', '555-567-8901', NULL, 'Musician and coffee enthusiast.');

INSERT INTO tags (name) VALUES
('Friend'),
('Work'),
('Family'),
('Networking'),
('Other');

INSERT INTO contact_tags (contact_id, tag_id) VALUES
(1, 4), -- Erin Potter → Networking
(1, 2), -- Erin Potter → Work
(2, 2), -- Marley Doyle → Work
(3, 1), -- Saba Giles → Friend
(4, 3), -- Don Butler → Family
(4, 1), -- Don Butler → Friend
(5, 5), -- Billie Stark → Other
(5, 1); -- Billie Stark → Friend

-- Query to fetch contacts with tags, filtering by 'Work' tag and search term
SELECT 
    c.id AS contact_id,
    c.name AS contact_name,
    c.phone,
    c.email,
    c.note,
    COALESCE(string_agg(t.name, ', '), 'No Tags') AS tags
FROM contacts c
LEFT JOIN contact_tags ct ON c.id = ct.contact_id
LEFT JOIN tags t ON ct.tag_id = t.id
WHERE (t.name = 'Work' OR 'Work' IS NULL)
AND c.name ILIKE '%search_term%'
GROUP BY c.id, c.name, c.phone, c.email, c.note;
