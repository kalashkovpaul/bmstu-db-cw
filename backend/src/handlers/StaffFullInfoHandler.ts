import { statuses } from "../consts";
import logger from "../logger";
import { connectManager } from "../modules/ConnectManager";
import { v4 as uuidv4 } from 'uuid';
import BaseHandler from "./BaseHandler";

class StaffFullInfoHandler extends BaseHandler {
    async request(request: any, reply: any) {
        const staffId = await super.callMiddleware(request, reply);
        if (staffId === 0) {return true}
        reply.headers('Content-Type', "application/json");

        const response = await this.getRequest(staffId);
        if (response.length) {
            reply.code(statuses.SUCCESS).send(JSON.stringify(response));
        } else {
            reply.code(statuses.SERVER_ERROR);
        }
        return false;
    }

    private async getRequest(staffId: number) {
        const connName = uuidv4();
        const connection = connectManager.connect(connName);
        this.middleware.setRole(staffId, connection);
        let result: any = [];
        try {
            const response = await connection.many({
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
            logger.error(e);
        }
        connectManager.disconnect(connName);
        return result;
    }
}

export const staffFullInfoHandler = new StaffFullInfoHandler();