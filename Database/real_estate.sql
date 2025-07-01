
DROP TABLE IF EXISTS Appointment;
DROP TABLE IF EXISTS Listing;
DROP TABLE IF EXISTS Property;
DROP TABLE IF EXISTS Client;
DROP TABLE IF EXISTS Agent;
DROP TABLE IF EXISTS Branch;


-- Create Branch table if it doesn't exist
CREATE TABLE IF NOT EXISTS Branch (
    branch_id INT PRIMARY KEY,
    `name` VARCHAR(100),
    address VARCHAR(255),
    phone_no VARCHAR(20)
);

-- Create Agent table if it doesn't exist
CREATE TABLE IF NOT EXISTS Agent (
    agent_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    phone_no VARCHAR(20),
    region VARCHAR(50),
    role VARCHAR(50),
    branch_id INT,
    password VARCHAR(255) NOT NULL,
    FOREIGN KEY (branch_id) REFERENCES Branch(branch_id)
);

-- Create Property table if it doesn't exist
CREATE TABLE IF NOT EXISTS Property (
    property_id INT AUTO_INCREMENT PRIMARY KEY,
    address VARCHAR(255),
    type VARCHAR(50),
    features VARCHAR(255)
);

-- Create Listing table if it doesn't exist
CREATE TABLE IF NOT EXISTS Listing (
    listing_id INT AUTO_INCREMENT PRIMARY KEY,
    listing_date VARCHAR(20),
    status VARCHAR(20),
    description VARCHAR(500),
    listing_price VARCHAR(20),
    property_id INT,
    agent_id INT,
    FOREIGN KEY (property_id) REFERENCES Property(property_id),
    FOREIGN KEY (agent_id) REFERENCES Agent(agent_id)
);

-- Create Client table if it doesn't exist
CREATE TABLE IF NOT EXISTS Client (
    client_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100),
    phone_no VARCHAR(20),
    agent_id INT,
    FOREIGN KEY (agent_id) REFERENCES Agent(agent_id)
);

-- Create Appointment table if it doesn't exist
CREATE TABLE IF NOT EXISTS Appointment (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_date VARCHAR(20),
    time VARCHAR(20),
    purpose VARCHAR(255),
    listing_price VARCHAR(20),
    listing_id INT,
    agent_id INT,
    client_id INT,
    FOREIGN KEY (listing_id) REFERENCES Listing(listing_id),
    FOREIGN KEY (agent_id) REFERENCES Agent(agent_id),
    FOREIGN KEY (client_id) REFERENCES Client(client_id)
);

-- Insert sample data into Branch
INSERT INTO Branch (branch_id, `name`, address, phone_no) VALUES
(1, 'Downtown Office', '123 Main St, City Center', '555-1000'),
(2, 'Suburban Office', '456 Oak Ave, Suburbia', '555-2000');

-- Insert sample data into Agent (with password 'password123')
INSERT INTO Agent (first_name, last_name, email, phone_no, region, role, branch_id, password) VALUES
('John', 'Smith', 'john.smith@realestate.com', '555-1234', 'North', 'Agent', 1, 'password123'),
('Jane', 'Doe', 'jane.doe@realestate.com', '555-5678', 'South', 'Senior Agent', 1, 'password123'),
('Mike', 'Johnson', 'mike.johnson@realestate.com', '555-9012', 'East', 'Manager', 2, 'password123');

-- Insert sample data into Property
INSERT INTO Property (address, type, features) VALUES
('789 Pine St, City Center', 'Apartment', 'Modern, 2 bed, 1 bath, balcony'),
('101 Maple Dr, Suburbia', 'House', 'Traditional, 4 bed, 3 bath, garden'),
('202 Cedar Ln, Lakeside', 'Condo', 'Waterfront, 3 bed, 2 bath, pool'),
('303 Birch Rd, Hillside', 'Villa', 'Luxury, 5 bed, 4 bath, view');

-- Insert sample data into Listing
INSERT INTO Listing (listing_date, status, description, listing_price, property_id, agent_id) VALUES
('2025-05-01', 'Active', 'Beautiful apartment in the heart of the city', '250000', 1, 1),
('2025-05-02', 'Pending', 'Spacious family home in quiet neighborhood', '450000', 2, 2),
('2025-05-03', 'Active', 'Luxurious waterfront condo with amazing views', '350000', 3, 1),
('2025-05-04', 'Sold', 'Exclusive villa on hillside with panoramic views', '750000', 4, 3);

-- Insert sample data into Client
INSERT INTO Client (first_name, last_name, email, phone_no, agent_id) VALUES
('Alice', 'Brown', 'alice.brown@email.com', '555-1111', 1),
('Bob', 'Green', 'bob.green@email.com', '555-2222', 1),
('Carol', 'White', 'carol.white@email.com', '555-3333', 2),
('David', 'Black', 'david.black@email.com', '555-4444', 3);

-- Insert sample data into Appointment
INSERT INTO Appointment (appointment_date, time, purpose, listing_price, listing_id, agent_id, client_id) VALUES
('2025-05-10', '10:00 AM', 'Initial viewing', '250000', 1, 1, 1),
('2025-05-11', '2:00 PM', 'Second viewing', '450000', 2, 2, 3),
('2025-05-12', '11:30 AM', 'Price negotiation', '350000', 3, 1, 2),
('2025-05-13', '4:00 PM', 'Contract signing', '750000', 4, 3, 4); 

--select * from Agent



