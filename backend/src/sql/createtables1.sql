CREATE TABLE patients (
    patient_id SERIAL NOT NULL PRIMARY KEY,
    address_id INT NOT NULL,
    passport INT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    home_phone VARCHAR(20),
    email VARCHAR(20)
);