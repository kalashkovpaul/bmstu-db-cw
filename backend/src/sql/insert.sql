INSERT INTO passports (passport_id, surname, middlename, lastname, birth_date, gender, series, num, issue_date, issue_location)
VALUES (1, 'Иванов', 'Иван', 'Иванович', '2000-01-01', 'Male', '12345', '67890', '2014-04-09', 'Улица Пушкина, д. Колотушкина');

INSERT INTO posts (post_id, title, salary)
VALUES (1, 'Главный врач', 60000);

INSERT INTO staff (staff_id, passport, post, employment_date, dismissal_date)
VALUES (1, 1, 1, '2022-01-01', NULL);

INSERT INTO accesses (staff_id, username, passwordhash, access_level)
VALUES (1, 'admin', 'qwerty', 'admin');

INSERT INTO schedules (staff_id, week_day, workstart, workend, office)
VALUES (1, 'Monday', '09:00', '18:00', 123);
INSERT INTO schedules (staff_id, week_day, workstart, workend, office)
VALUES (1, 'Wednesday', '09:00', '18:00', 123);
INSERT INTO schedules (staff_id, week_day, workstart, workend, office)
VALUES (1, 'Friday', '09:00', '18:00', 321);


INSERT INTO addresses (address_id, country, city, street, house, flat)
VALUES (1, 'Russia', 'Moscow', 'Brusilova', '35/1', NULL);

INSERT INTO passports (passport_id, surname, middlename, lastname, birth_date, gender, series, num, issue_date, issue_location)
VALUES (2, 'Пациентов', 'Пациент', 'Пациентович', '2000-01-01', 'Male', '12345', '67890', '2014-04-09', 'Площадь Гагарина');

INSERT INTO patients (patient_id, phone, address_id, passport)
VALUES (1, '89993452845', 1, 2);

INSERT INTO agreements (agreement_id, code, conclusion_date, renewal_date, patient_id, expiration_date)
VALUES (1, '32332-2020', '2019-01-02', '2019-01-02',  1, '2021-01-02');

INSERT INTO records (record_id, agreement_id, registration_date)
 VALUES (1, 1, '2023-05-08');

