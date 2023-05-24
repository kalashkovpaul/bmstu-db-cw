cp passports.csv /tmp

copy passports(passport_id,surname,middlename,birth_date,gender,series,num,issue_date,issue_location)
from '/tmp/passports.csv'
delimiter ','
csv header;

cp staff.csv /tmp

copy staff(staff_id,passport,post,employment_date,dismissal_date)
from '/tmp/staff.csv'
delimiter ','
csv header;


