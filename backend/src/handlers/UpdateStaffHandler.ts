import { statuses } from "../consts";
import logger from "../logger";
import { connectManager } from "../modules/ConnectManager";
import { v4 as uuidv4 } from 'uuid';
import BaseHandler from "./BaseHandler";

class UpdateStaffHandler extends BaseHandler {
    async request(request: any, reply: any) {
        const staffId = await super.callMiddleware(request, reply);
        if (staffId === 0) {return true}
        reply.headers('Content-Type', "application/json");

        if (!this.checkData(request.body)) {
            logger.error(`body: ${request.body}`);
            reply.code(statuses.INVALID_ARGS);
            return true;
        }

        const data = JSON.parse(request.body);
        let result = false;
        if (data.type === 'passport') {
            result = await this.updatePassport(request.body);
        } else if (data.type === 'staff') {
            result = await this.updateStaff(request.body);
        } else if (data.type === 'schedule') {
            result = await this.updateSchedule(request.body);
        }
        if (!result) {
            reply.code(statuses.SERVER_ERROR);
        } else {
            reply.code(statuses.SUCCESS);
        }
        return false;
    }

    private async updatePassport(jsonData: string): Promise<boolean> {
        const connName = uuidv4();
        const connection = connectManager.connect(connName);
        const data = JSON.parse(jsonData);
        let result = false;
        try {
            await connection.none({
                text: 'UPDATE passports SET surname=$1, middlename=$2, lastname=$3, birth_date=$4::date, gender=$5, series=$6, num=$7, issue_date=$8::date, issue_location=$9 WHERE passport_id=$10',
                values: [data.surname, data.middlename, data.lastname, data.birth_date, data.gender, data.series, data.num, data.issue_date, data.issue_location, data.passport_id],
            });
            result = true;

        } catch (e) {
            logger.error(e);
        }
        connectManager.disconnect(connName);
        return result;
    }

    private async updateStaff(jsonData: string): Promise<boolean> {
        const connName = uuidv4();
        const connection = connectManager.connect(connName);
        const data = JSON.parse(jsonData);
        let result = false;
        try {
            await connection.none({
                text: 'UPDATE staff SET post=$1 WHERE staff_id=$2',
                values: [data.post, data.staff_id],
            });
            result = true;

        } catch (e) {
            logger.error(e);
        }
        connectManager.disconnect(connName);
        return result;
    }

    private async updateSchedule(jsonData: string) {
        const data = JSON.parse(jsonData);
        const connName = uuidv4();
        const connection = connectManager.connect(connName);
        let result = false;
        try {
            await connection.tx(async (t: any) => {
                await t.none({
                    text: 'DELETE FROM schedules WHERE staff_id=$1',
                    values: [data.staff_id],
                });
                for (const sched of data.schedule) {
                    await t.none({
                        text: 'INSERT INTO schedules (staff_id, workstart, workend, week_day, office) VALUES ($1, $2, $3, $4, $5)',
                        values: [data.staff_id, sched.workstart, sched.workend, sched.week_day, sched.office ? sched.office : null]
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
        const passportFields = ['passport_id', 'surname', 'middlename', 'lastname', 'birth_date', 'gender', 'series', 'num', 'issue_date', 'issue_location'];
        const staffFields = ['staff_id', 'post'];
        const scheduleFields = ['week_day', 'workstart', 'workend', 'office'];
        let state = true;
        if (!data['type'] || !(data.type === 'passport' || data.type === 'staff' || data.type === 'schedule')) return false;
        if (data.type === 'passport') {
            passportFields.forEach(field => {
                state = state && data[field];
                if (!state) {
                    return false;
                }
            });
        } else if (data.type === 'staff') {
            staffFields.forEach(field => {
                state = state && data[field];
                if (!state) {
                    return false;
                }
            });
        } else {
            if (!data["schedule"] || !data["staff_id"]) return;
            const schedule = data.schedule;
            schedule.forEach((sched: any) => {
                scheduleFields.forEach(field => {
                    state = state && (sched[field] !== undefined);
                    if (!state) {
                        return false;
                    }
                });
            });
        }
        return state;
    }
}

export const updateStaffHandler = new UpdateStaffHandler();