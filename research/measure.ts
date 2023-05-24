import 'isomorphic-fetch';
declare const fetch: any;

import pgPromise from 'pg-promise';

const apiConfig = {
    port: 8004,
    url: "localhost",
    postAuth: "/auth",
    fullStaffInfo: "/staff/all/full",
}

const dbConfig = {
    "dbName": "postgres",
    "user": "postgres",
    "password": "postgres",
    "url": "localhost",
    "port": "5432",
    "db": "clinic",
    "repeat": 3
}

const promise = pgPromise();
const  connectionURL = `${dbConfig.dbName}://${dbConfig.user}:${dbConfig.password}@${dbConfig.url}:${dbConfig.port}/${dbConfig.db}`;
export const db = promise(connectionURL);


async function getAllStaff() {
    const result: any = [];
    try {
        const response = await db.many({
            text: 'SELECT * from staff s JOIN posts pos ON s.post=pos.post_id JOIN passports pas ON s.passport=pas.passport_id',
        });
        response.forEach((info: any) => {
            result.push({
                staff: {
                    staff_id: info.staff_id,
                    passport: info.passport,
                    post: info.post,
                    employment_date: info.employment_date,
                    dismissal_date: info.dismissal_date,
                },
                post: {
                    post_id: info.post_id,
                    title: info.title,
                    salary: info.salary,
                },
                passport: {
                    passport_id: info.passport_id,
                    surname: info.surname,
                    middlename: info.middlename,
                    lastname: info.lastname,
                    birth_date: info.birth_date,
                    gender: info.gender,
                    series: info.series,
                    num: info.num,
                    issue_date: info.issue_date,
                    issue_location: info.issue_location,
                },
            })
        })
    } catch (e) {
        console.log(e);
    }
}

async function measureOnce() {
    const start = Date.now();
    await getAllStaff();
    const end = Date.now();
    return end - start;
}

async function measure() {
    const times = 100;
    let total = 0;
    for (let i = 0; i < times; i++) {
        total += await measureOnce();
    }

    return total / times;
}
console.log(await measure());