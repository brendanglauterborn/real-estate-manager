-- Drop tables in the correct order to avoid foreign key constraints
USE Group7;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS Appointment;
DROP TABLE IF EXISTS Client;
DROP TABLE IF EXISTS Listing;
DROP TABLE IF EXISTS Property;
DROP TABLE IF EXISTS Agent;
DROP TABLE IF EXISTS Branch;
DROP TABLE IF EXISTS UserAuth;

SET FOREIGN_KEY_CHECKS = 1; 