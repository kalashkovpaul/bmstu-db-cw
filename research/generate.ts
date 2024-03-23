import 'isomorphic-fetch';
declare const fetch: any;

import * as fs from 'fs';

import pgPromise from 'pg-promise';

const times = 1000000;

const passportFile = 'passports.csv';
const staffFile = 'staff.csv';

const dbConfig = {
    "dbName": "postgres",
    "user": "postgres",
    "password": "postgres",
    "url": "localhost",
    "port": "5432",
    "db": "postgres",
    "repeat": 3
}

const promise = pgPromise();
const  connectionURL = `${dbConfig.dbName}://${dbConfig.user}:${dbConfig.password}@${dbConfig.url}:${dbConfig.port}/${dbConfig.db}`;
export const db = promise(connectionURL);


const names = ['Ivan', 'Boris', 'Pavel', 'Alexander', 'Nikolay'];
const surnames = ['Ivanov', 'Petrov', 'Sidorov', 'Kalashkov', 'Alexandrov'];
const lastnames = ['Ivanovich', 'Petrovich', 'Alexandrovich', 'Alexeyevich'];

function getRandom(array: string[]): string {
    return array[Math.floor(Math.random() * array.length)];
}

function getStaffData (i: number) {
    return {
        staff_id: i + 2,
        passport: {
            passport_id: i + 2,
            surname: getRandom(names),
            middlename: getRandom(surnames),
            lastname: getRandom(lastnames),
            birth_date: "2003-07-02",
            gender: "Male",
            series: "123499",
            num: "99876",
            issue_date: "2017-07-14",
            issue_location: "BMSTU",
        },
        post: {
            post_id: 1,
        },
        schedule: [
            {
                week_day: "Monday",
                workstart: "09:00",
                workend: "14:00",
                office: 0
            },
            {
                week_day: "Friday",
                workstart: "10:00",
                workend: "14:00",
                office: 0
            },
        ],
        employment_date: "2022-01-01",
        dismissal_date: null
    };
}

const apiConfig = {
    port: 8004,
    url: "localhost",
    postAuth: "/auth",
    addStaff: "/staff/add",
}

async function printPassportHeader() {
    await fs.promises.writeFile(passportFile, 'passport_id,surname,middlename,lastname,birth_date,gender,series,num,issue_date,issue_location');
}

async function printPassport(p: any) {
    await fs.promises.appendFile(passportFile, `\n${p.passport_id},${p.surname},${p.middlename},${p.lastname},${p.birth_date},${p.gender},${p.series},${p.num},${p.issue_date},${p.issue_location}`)
}

async function printStaffHeader() {
    await fs.promises.writeFile(staffFile, 'staff_id,passport,post,employment_date');
}

async function printStaff(s: any) {
    await fs.promises.appendFile(staffFile, `\n${s.staff_id},${s.passport.passport_id},${s.post.post_id},${s.employment_date}`)
}

async function generate() {
    console.log("Generating...");
    const start = Date.now();
    await printPassportHeader();
    await printStaffHeader();
    for (let i = 0; i < times; i++) {
        const newData = getStaffData(i);
        await printPassport(newData.passport);
        await printStaff(newData);
    }
    console.log("Done in ", Date.now() - start, " ms");
}

async function clearStaff() {
    db.none({
        text: 'DELETE FROM passports WHERE passport_id <> 1;'
    });
    db.none({
        text: 'DELETE FROM staff WHERE staff_id <> 1;'
    });
}

clearStaff();
await generate();


