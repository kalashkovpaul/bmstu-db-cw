INSERT INTO passports (surname, middlename, lastname, birth_date, gender, series, num, issue_date, issue_location)
VALUES ('Иванов', 'Иван', 'Иванович', '2000-01-01', 'Male', '12345', '67890', '2014-04-09', 'Улица Пушкина, д. Колотушкина');

INSERT INTO posts (title, salary)
VALUES ('Главный врач', 60000);

INSERT INTO staff (passport, post, employment_date, dismissal_date)
VALUES (1, 1, '2022-01-01', NULL);

INSERT INTO accesses (staff_id, username, passwordhash, access_level)
VALUES (1, 'admin', 'qwerty', 'admin');

INSERT INTO schedules (staff_id, week_day, workstart, workend, office)
VALUES (1, 'Monday', '09:00', '18:00', 123);
INSERT INTO schedules (staff_id, week_day, workstart, workend, office)
VALUES (1, 'Wednesday', '09:00', '18:00', 123);
INSERT INTO schedules (staff_id, week_day, workstart, workend, office)
VALUES (1, 'Friday', '09:00', '18:00', 321);


INSERT INTO addresses (country, city, street, house, flat)
VALUES ('Russia', 'Moscow', 'Brusilova', '35/1', NULL);

INSERT INTO passports (surname, middlename, lastname, birth_date, gender, series, num, issue_date, issue_location)
VALUES ('Пациентов', 'Пациент', 'Пациентович', '2000-01-01', 'Male', '12345', '67890', '2014-04-09', 'Площадь Гагарина');

INSERT INTO patients (phone, address_id, passport)
VALUES ('89993452845', 1, 2);

INSERT INTO agreements (code, conclusion_date, renewal_date, patient_id, expiration_date)
VALUES ('32332-2020', '2019-01-02', '2019-01-02',  2, '2021-01-02');

INSERT INTO records (agreement_id, registration_date)
 VALUES (1, '2023-05-08');

