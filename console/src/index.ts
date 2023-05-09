import { apiConfig } from "./consts.js";
import 'isomorphic-fetch';

const addStaffBody = JSON.stringify({
    passport: {
        surname: "Test",
        middlename: "Test",
        lastname: "Test",
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
            workstart: null,
            workend: "14:00",
            office: 0
        },
    ],
    employment_date: "2022-01-01",
    dismissal_date: 0
});

const updateStaff = JSON.stringify({
    type: 'schedule',
    staff_id: 4,
    schedule: [
        {
            week_day: "Monday",
            workstart: "09:00",
            workend: "14:00",
            office: 0
        },
        {
            week_day: "Friday",
            workstart: "11:00",
            workend: "14:00",
            office: 0
        },
    ],

    // type: 'staff',
    // staff_id: 4,
    // post: 4,

    // type: 'passport',
    // passport_id: 4,
    // surname: "Baggins",
    // middlename: "Test",
    // lastname: "Test",
    // birth_date: "2003-07-02",
    // gender: "Male",
    // series: "123499",
    // num: "99876",
    // issue_date: "2017-07-14",
    // issue_location: "BMSTU",
});

export async function checkAuthHandler() {
    const checkRightsUrl = `http://${apiConfig.url}:${apiConfig.port}${apiConfig.fullStaffInfo}`;
    try {
        const response = await fetch(checkRightsUrl, {
            method: "GET",
            mode: 'no-cors',
            // body: JSON.stringify({
            // }),
        });
        console.log(response);
        const result = await response.json();
        console.log(result);
    } catch (e) {
        console.log(e);
    }
    console.log("END");
}

await checkAuthHandler();