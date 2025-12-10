import { Pool } from "pg";
import config from ".";

// database initialisation using neondb
const pool = new Pool({
  connectionString: `${config.connection_str}`,
});

// table creation into db
const initDB = async () => {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS Users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phone VARCHAR(20) NOT NULL,
        role VARCHAR(25) NOT NULL DEFAULT 'customer',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW() 
        )
        `
  );

  await pool.query(
    `CREATE TABLE IF NOT EXISTS Vehicles(
        id SERIAL PRIMARY KEY,
        vehicle_name VARCHAR(100) NOT NULL,
        type VARCHAR(50) NOT NULL,
        registration_number VARCHAR(25) UNIQUE NOT NULL,
        daily_rent_price INT NOT NULL,
        availability_status VARCHAR(25) NOT NULL DEFAULT 'available' 
        )
        `
  );

  await pool.query(
    `CREATE TABLE IF NOT EXISTS Bookings(
        id SERIAL PRIMARY KEY,
        customer_id INT NOT NULL REFERENCES Users(id),
        vehicle_id INT NOT NULL REFERENCES Vehicles(id),
        rent_start_date DATE NOT NULL,
        rent_end_date DATE NOT NULL,
        total_price INT NOT NULL,
        status VARCHAR(25) NOT NULL
        )
        `
  );
};

export const dbConfig = {
  pool,
  initDB,
};
