-- Insert Puppies (age in months, max 24, most < 6)
INSERT INTO puppy
(id, name, breed, age, size, gender, activityLevel, description, imageUrl, available)
VALUES
-- Original 12 puppies
(1, 'Max', 'Bouvier des Flandres', 5, 'LARGE', 'MALE', 'HIGH',
 'Max is a strong, affectionate working dog who enjoys both playtime and cuddles. He’s very intelligent and eager to please.',
 'http://localhost:8080/assets/images/bouvier.jpg', true),

(2, 'Bella', 'Golden Retriever', 4, 'LARGE', 'FEMALE', 'MEDIUM',
 'Bella is a cheerful and gentle puppy. She loves children and thrives in active family settings.',
 'http://localhost:8080/assets/images/golden-retriever.jpg', true),

(3, 'Charlie', 'Beagle', 3, 'MEDIUM', 'MALE', 'HIGH',
 'Charlie is a curious scent hound who enjoys exploring outdoors and playing with other dogs.',
 'http://localhost:8080/assets/images/beagle.jpg', true),

(4, 'Lucy', 'French Bulldog', 2, 'SMALL', 'FEMALE', 'LOW',
 'Lucy is an easy-going, playful companion who prefers indoor snuggles and short walks.',
 'http://localhost:8080/assets/images/french-bulldog.jpg', true),

(5, 'Cooper', 'German Shepherd', 7, 'LARGE', 'MALE', 'HIGH',
 'Cooper is a confident and loyal guardian. He excels in training sessions and loves learning new tasks.',
 'http://localhost:8080/assets/images/german.jpg', false),

(6, 'Duke', 'Border Collie-Beagle mix', 3, 'MEDIUM', 'MALE', 'LOW',
 'The Duke Dog is a loyal, intelligent, red-nosed companion bred for debugging, coffee-fetching, and cross-platform loyalty.',
 'http://localhost:8080/assets/images/duke.png', true),

(7, 'Daisy', 'Labrador Retriever', 3, 'LARGE', 'FEMALE', 'HIGH',
 'Daisy is an outgoing and gentle puppy, eager to meet people and other pets.',
 'http://localhost:8080/assets/images/labrador.jpg', true),

(8, 'Rocky', 'Boxer', 4, 'LARGE', 'MALE', 'MEDIUM',
 'Rocky is bright, energetic, and loves to be the center of attention during playtime.',
 'http://localhost:8080/assets/images/boxer.jpg', true),

(9, 'Luna', 'Poodle', 5, 'MEDIUM', 'FEMALE', 'MEDIUM',
 'Luna is an intelligent puppy who enjoys both play and learning tricks. She loves family activities.',
 'http://localhost:8080/assets/images/poodle.png', true),

(10, 'Bailey', 'Corgi', 3, 'SMALL', 'MALE', 'MEDIUM',
 'Bailey is affectionate and alert. He’s great with kids and loves interactive toys.',
 'http://localhost:8080/assets/images/corgi.jpg', true),

(11, 'Molly', 'Shih Tzu', 2, 'SMALL', 'FEMALE', 'LOW',
 'Molly is a sweet and gentle lapdog, always ready for quiet time and gentle play.',
 'http://localhost:8080/assets/images/shih-tzu.jpg', false),

(12, 'Toby', 'Dalmatian', 6, 'LARGE', 'MALE', 'HIGH',
 'Toby is energetic and loyal. He enjoys outdoor adventures and meeting new friends.',
 'http://localhost:8080/assets/images/dalmatian.jpg', true),

(13, 'Sasha', 'Australian Shepherd', 5, 'MEDIUM', 'FEMALE', 'HIGH',
 'Sasha is very intelligent and hardworking. She thrives when given tasks or puzzle toys.',
 'http://localhost:8080/assets/images/aussie.jpg', true),

-- 🐾 NEW: Doberman "Snyk"
(14, 'Snyk', 'Doberman', 4, 'LARGE', 'MALE', 'HIGH',
 'Snyk is a sleek and alert Doberman pup with a playful heart and a sharp mind. Loyal and energetic, he makes a great companion for experienced dog owners.',
 'http://localhost:8080/assets/images/doberman.jpg', true),

-- Additional puppies
(15, 'Nina', 'Border Collie', 3, 'MEDIUM', 'FEMALE', 'HIGH',
 'Nina is a highly intelligent border collie who thrives on mental stimulation and active play.',
 'http://localhost:8080/assets/images/border-collie.jpg', true),

(16, 'Chico', 'Chihuahua', 2, 'SMALL', 'MALE', 'LOW',
 'Chico may be small, but he has a huge personality. He loves snuggling and being your shadow.',
 'http://localhost:8080/assets/images/chihuahua.jpg', true),

(17, 'Ginger', 'Vizsla', 6, 'LARGE', 'FEMALE', 'HIGH',
 'Ginger is an affectionate and sensitive puppy who bonds deeply with her people.',
 'http://localhost:8080/assets/images/vizsla.jpg', true);

-- Insert goodWith (now more variety)
INSERT INTO "dog-quality" (puppy_id, "dog-quality")
VALUES (1, 'children'),
       (1, 'dogs'),
       (1, 'strangers'),

       (2, 'children'),
       (2, 'dogs'),
       (2, 'cats'),
       (2, 'crowds'),

       (3, 'children'),
       (3, 'dogs'),
       (3, 'small pets'),

       (4, 'children'),
       (4, 'cats'),

       (5, 'children'),
       (5, 'dogs'),
       (5, 'strangers'),

       (7, 'children'),
       (7, 'dogs'),
       (7, 'cats'),
       (7, 'crowds'),

       (8, 'children'),
       (8, 'dogs'),

       (9, 'children'),
       (9, 'dogs'),
       (9, 'cats'),
       (9, 'strangers'),

       (10, 'children'),
       (10, 'dogs'),

       (11, 'children'),
       (11, 'cats'),

       (12, 'children'),
       (12, 'dogs'),
       (12, 'crowds'),

       (13, 'children'),
       (13, 'dogs'),
       (13, 'cats'),
       (13, 'strangers'),
       (13, 'small pets'),

        -- Snyk the Doberman (id: 13)
       (14, 'children'),
       (14, 'dogs'),
       (14, 'strangers'),

       -- Nina the Border Collie (id: 14)
       (15, 'children'),
       (15, 'dogs'),
       (15, 'cats'),
       (15, 'small pets'),

       -- Chico the Chihuahua (id: 15)
       (16, 'children'),
       (16, 'cats'),

       -- Ginger the Vizsla (id: 16)
       (17, 'children'),
       (17, 'dogs'),
       (17, 'crowds'),
       (17, 'strangers');