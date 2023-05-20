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

const newRecord = JSON.stringify({
    doctor_id: 1,
    patient_id: 1,
    record_id: 1,
    session_date: '2023-05-11',
    dynamics: "Well, he's better",
    prescription: "Live on",
    note: "",
    state: {
        general_condition: "Normal",
        height: 180,
        patient_weight: 80,
        pulse:  60,
        pressure: "120/80",
        temperature: 36,
        other: "",
    }
});

export async function checkAuthHandler() {
    const authUrl = `http://${apiConfig.url}:${apiConfig.port}${apiConfig.postAuth}`;
    const checkRightsUrl = `http://${apiConfig.url}:${apiConfig.port}${apiConfig.patientFullInfo}/1`;
    try {
        let response = await fetch(authUrl, {
            method: "POST",
            mode: 'no-cors',
            body: JSON.stringify({
                username: 'admin',
                password: 'qwerty'
            }),
        });
        let result = await response.json();
        const password = result.password;
        console.log("Got password: ", password);
        response = await fetch(checkRightsUrl, {
            method: "GET",
            mode: 'no-cors',
            headers: {
                'Authorization': `Explicit: ${password}`,
            }
        });
        console.log(response);
        result = await response.json();
        console.log(result);
    } catch (e) {
        console.log(e);
    }
    console.log("END");
}

await checkAuthHandler();