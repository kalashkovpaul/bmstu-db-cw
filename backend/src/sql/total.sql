CREATE TYPE week_day_t as ENUM('Sunday', 'Monday', 'Tuesday',
    'Wednesday', 'Thursday', 'Friday', 'Saturday');

CREATE TYPE gender_t as ENUM('Male', 'Female', 'Other');

CREATE TYPE access_level_t as ENUM('admin', 'chief', 'doctor',
    'registry');


CREATE TABLE patients (
    patient_id SERIAL NOT NULL PRIMARY KEY,
    address_id INT NOT NULL,
    passport INT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    home_phone VARCHAR(20),
    email VARCHAR(20)
);

CREATE TABLE staff (
    staff_id SERIAL NOT NULL PRIMARY KEY,
    passport INT NOT NULL,
    post INT NOT NULL,
    employment_date DATE NOT NULL,
    dismissal_date DATE
);

CREATE TABLE posts (
    post_id SERIAL NOT NULL PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary INT NOT NULL
);

CREATE TABLE sessions (
    session_id SERIAL NOT NULL PRIMARY KEY,
    doctor_id INT NOT NULL,
    patient_id INT NOT NULL,
    record_id INT NOT NULL,
    state_id INT NOT NULL,
    session_date DATE NOT NULL,
    dynamics VARCHAR(256),
    prescription VARCHAR(256),
    note VARCHAR(256)
);

CREATE TABLE schedules (
    schedule_id SERIAL NOT NULL PRIMARY KEY,
    staff_id INT NOT NULL,
    workstart TIME NOT NULL,
    workend TIME NOT NULL,
    week_day week_day_t NOT NULL,
    office INT
);

CREATE TABLE records (
    record_id SERIAL NOT NULL PRIMARY KEY,
    agreement_id INT NOT NULL,
    registration_date DATE NOT NULL
);

CREATE TABLE states (
    state_id SERIAL NOT NULL PRIMARY KEY,
    general_condition VARCHAR(256),
    height INT,
    patient_weight INT,
    pulse INT,
    pressure VARCHAR(50),
    temperature REAL,
    other VARCHAR(256)
);

CREATE TABLE agreements (
    agreement_id SERIAL NOT NULL PRIMARY KEY,
    patient_id INT NOT NULL,
    code VARCHAR(50) NOT NULL,
    conclusion_date DATE NOT NULL,
    expiration_date DATE NOT NULL,
    renewal_date DATE NOT NULL
);

CREATE TABLE addresses (
    address_id SERIAL NOT NULL PRIMARY KEY,
    country VARCHAR(50) NOT NULL,
    city VARCHAR(50) NOT NULL,
    street VARCHAR(50) NOT NULL,
    house VARCHAR(50) NOT NULL,
    flat VARCHAR(50)
);

CREATE TABLE passports (
    passport_id SERIAL NOT NULL PRIMARY KEY,
    surname VARCHAR(50) NOT NULL,
    middlename VARCHAR(50) NOT NULL,
    lastname VARCHAR(50),
    birth_date DATE NOT NULL,
    gender gender_t NOT NULL,
    series VARCHAR(10) NOT NULL,
    num VARCHAR(10) NOT NULL,
    issue_date DATE NOT NULL,
    issue_location VARCHAR(128) NOT NULL
);

CREATE TABLE accesses (
    access_id SERIAL NOT NULL PRIMARY KEY,
    staff_id INT NOT NULL,
    username VARCHAR(50) NOT NULL,
    passwordhash BYTEA NOT NULL,
    access_level access_level_t NOT NULL
);

ALTER TABLE patients ADD CONSTRAINT addr_constraint
    FOREIGN KEY (address_id) REFERENCES addresses(address_id)
    ON DELETE CASCADE;

ALTER TABLE patients ADD CONSTRAINT pat_passport_constraint
    FOREIGN KEY (passport) REFERENCES passports(passport_id)
    ON DELETE CASCADE;

ALTER TABLE staff ADD CONSTRAINT staff_passport_constraint
    FOREIGN KEY (passport) REFERENCES passports(passport_id)
    ON DELETE CASCADE;

ALTER TABLE staff ADD CONSTRAINT staff_post_constraint
    FOREIGN KEY (post) REFERENCES posts(post_id)
    ON DELETE CASCADE;

ALTER TABLE sessions ADD CONSTRAINT session_doctor_contraint
    FOREIGN KEY (doctor_id) REFERENCES staff(staff_id)
    ON DELETE CASCADE;

ALTER TABLE sessions ADD CONSTRAINT session_patient_contraint
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
    ON DELETE CASCADE;

ALTER TABLE sessions ADD CONSTRAINT session_record_constraint
    FOREIGN KEY (record_id) REFERENCES records(record_id)
    ON DELETE CASCADE;

ALTER TABLE sessions ADD CONSTRAINT session_state_constraint
    FOREIGN KEY (state_id) REFERENCES states(state_id)
    ON DELETE CASCADE;

ALTER TABLE schedules ADD CONSTRAINT schedule_staff_constraint
    FOREIGN KEY (staff_id) REFERENCES staff(staff_id)
    ON DELETE CASCADE;

ALTER TABLE agreements ADD CONSTRAINT agreement_patient_constraint
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
    ON DELETE CASCADE;
