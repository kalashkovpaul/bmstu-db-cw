import { statuses } from "../consts";
import logger from "../logger";
import { connectManager } from "../modules/ConnectManager";
import { keyChecker } from "../modules/KeyChecker";
import { v4 as uuidv4 } from 'uuid';
import IHandler from "./IHandler";

class AddStaffHandler implements IHandler{
    async request(request: any, reply: any) {
        reply.headers('Content-Type', "application/json");
        let key = request.headers["Authorization"];
        if (!key) {
            logger.error(`key: ${key}`);
            reply.code(statuses.UNAUTHORIZED);
            return;
        }
        const explicityKey = "Explicit: ";
        const index = key.indexOf(explicityKey);
        if (index === -1) {
            logger.error(`index: ${index}, key: ${key}`);
            reply.code(statuses.UNAUTHORIZED);
            return;
        }
        key = key.slice(explicityKey.length);
        const staffId = keyChecker.getOwner(key);
        if (staffId === -1) {
            logger.error(`staffId: ${staffId}, key: ${key}`);
            reply.code(statuses.UNAUTHORIZED);
            return;
        }

        if (!this.checkData(request.body)) {
            logger.error(`body: ${request.body}`);
            reply.code(statuses.INVALID_ARGS);
            return;
        }

        const data = JSON.parse(request.body);
        if (!(data?.title && data?.salary)) {
            reply.code(statuses.INVALID_ARGS);
        }
        const result = await this.postRequest(request.body);
        if (!result) {
            reply.code(statuses.SERVER_ERROR);
        } else {
            reply.code(statuses.SUCCESS);
        }
    }

    private async postRequest(jsonData: string) {
        const data = JSON.parse(jsonData);
        const connName = uuidv4();
        const connection = connectManager.connect(connName);
        let result = false;
        try {
            await connection.tx(async (t: any) => {
                const passport_id = (await t.one({
                    text: 'INSERT INTO passports (surname, middlename, lastname, birth_date, gender, series, num, issue_date, issue_location) VALUES ($1, $2, $3, $4::date, $5, $6, $7, $8::date, $9) RETURNING passport_id;',
                    values: [data.passport.surname, data.passport.middlename, data.passport.lastname, data.passport.birth_date, data.passport.gender, data.passport.series, data.passport.num, data.passport.issue_date, data.passport.issue_location],
                })).passport_id;
                const staff_id = (await t.one({
                    text: 'INSERT INTO staff (passport, post, employment_date, dismissal_date) VALUES ($1, $2, $3, $4) RETURNING staff_id;',
                    values: [passport_id, data.post.post_id, data.employment_date, data.dismissal_date ? data.dismissal_date : null]
                })).staff_id;
                for (const sched of data.schedule) {
                    await t.none({
                        text: 'INSERT INTO schedules (staff_id, workstart, workend, week_day, office) VALUES ($1, $2, $3, $4, $5)',
                        values: [staff_id, sched.workstart, sched.workend, sched.week_day, sched.office ? sched.office : null]
                    });
                };
            });
            result = true;
        } catch (e) {
            logger.error(e);
        }
        connectManager.disconnect(connName);
        return result;
    }

    private checkData(jsonData: string) {
        const data = JSON.parse(jsonData);
        const fields = ['passport', 'post', 'schedule', 'employment_date', 'dismissal_date'];
        const passportFields = ['surname', 'middlename', 'lastname', 'birth_date', 'gender', 'series', 'num', 'issue_date', 'issue_location'];
        const postFields = ['post_id'];
        const scheduleFields = ['week_day', 'workstart', 'workend', 'office'];
        let state = true;
        fields.forEach(field => {
            state = state && (data[field] !== undefined);
            if (!state) {
                return false;
            }
        });

        const passport = data.passport;
        passportFields.forEach(field => {
            state = state && passport[field];
            if (!state) {
                return false;
            }
        });

        const post = data.post;
        postFields.forEach(field => {
            state = state && post[field];
            if (!state) {
                return false;
            }
        });

        const schedule = data.schedule;
        schedule.forEach((sched: any) => {
            scheduleFields.forEach(field => {
                state = state && (sched[field] !== undefined);
                if (!state) {
                    console.log(field);
                    return false;
                }
            });
        });
        return state;
    }
}

export const addStaffHandler = new AddStaffHandler();