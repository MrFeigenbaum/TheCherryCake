-- V7__fix_staff_viewer_passwords.sql: Set valid BCrypt password hash for staff and viewer users ('password123')
UPDATE users
SET password_hash = '$2a$10$FrkBDmuo0IvE71Kn6s7HlOCj79QZzgE5yj0JYyQIhdTGzj5nqnmwW'
WHERE email IN ('staff@cherrycake.com', 'viewer@cherrycake.com');

