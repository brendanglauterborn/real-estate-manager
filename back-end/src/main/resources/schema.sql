-- This file is intentionally left mostly empty as all schema creation is in data.sql
-- Note: Spring Boot requires this file to not be completely empty since it's configured in application.properties
-- This comment ensures the file isn't empty
SELECT 1;

-- Create tables if they don't exist
-- The data.sql file already has CREATE TABLE IF NOT EXISTS statements, so we don't need to duplicate them here
-- Removing the ALTER TABLE statement as it's causing issues with H2 in-memory database
-- The password column is already included in the Agent table creation in data.sql 