-- V4: Update seed user password hashes with valid BCrypt hash for 'password123'
UPDATE users
SET password_hash = '$2a$10$FrkBDmuo0IvE71Kn6s7HlOCj79QZzgE5yj0JYyQIhdTGzj5nqnmwW'
WHERE email IN ('admin@cherrycake.com', 'customer@cherrycake.com');
