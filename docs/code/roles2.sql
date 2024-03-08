GRANT all ON all tables IN SCHEMA public TO admin;

GRANT all ON sessions TO chief;
GRANT all ON staff TO chief;
GRANT all ON states TO chief;
GRANT all ON posts TO chief;
GRANT all ON patients TO chief;
GRANT all ON passports TO chief;
GRANT all ON agreements TO chief;
GRANT all ON addresses TO chief;
GRANT all ON records TO chief;
GRANT all ON schedules TO chief;
GRANT all ON sessions TO doctor;
GRANT all ON records TO doctor;
GRANT all ON states TO doctor;
GRANT select ON patients TO doctor;
GRANT select ON staff TO doctor;
GRANT select, update ON schedules TO doctor;