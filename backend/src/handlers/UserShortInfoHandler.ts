import { statuses } from "../consts";
import logger from "../logger";
import { connectManager } from "../modules/ConnectManager";
import { keyChecker } from "../modules/KeyChecker";
import { v4 as uuidv4 } from 'uuid';
import IHandler from "./IHandler";

class UserShortInfoHandler implements IHandler {
    async request(request: any, reply: any) {
        reply.headers('Content-Type', "application/json");
        let key = request.headers["Authorization"];
        // if (!key) {
        //     logger.error(`key: ${key}`);
        //     reply.code(statuses.UNAUTHORIZED);
        //     return;
        // }
        // const explicityKey = "Explicit: ";
        // const index = key.indexOf(explicityKey);
        // if (index === -1) {
        //     logger.error(`index: ${index}, key: ${key}`);
        //     reply.code(statuses.UNAUTHORIZED);
        //     return;
        // }
        // key = key.slice(explicityKey.length);
        // const staffId = keyChecker.getOwner(key);
        // if (staffId === -1) {
        //     logger.error(`staffId: ${staffId}, key: ${key}`);
        //     reply.code(statuses.UNAUTHORIZED);
        //     return;
        // }

        const response = await this.getRequest();
        if (response.length) {
            reply.code(statuses.SUCCESS).send(JSON.stringify(response));
        } else {
            reply.code(statuses.SERVER_ERROR);
        }
    }

    private async getRequest() {
        const connName = uuidv4();
        const connection = connectManager.connect(connName);
        let result: any = [];
        try {
            const response = await connection.many({
                text: 'SELECT access_id, username, surname, middlename, lastname, access_level, title, salary, employment_date, dismissal_date, passport, a.staff_id as staff_id, post FROM accesses a JOIN staff s ON a.staff_id=s.staff_id JOIN posts pos ON s.post=pos.post_id JOIN passports pas ON s.passport=pas.passport_id;',
            });
            response.forEach((info: any) => {
                result.push({
                    access_id: info.access_id,
                    username: info.username,
                    access_level: info.access_level,
                    staff: {
                        staff: {
                            staff_id: info.staff_id,
                            passport: info.passport,
                            post: info.post,
                            employment_date: info.employment_date,
                            dismissal_date: info.dismissal_date,
                        },
                        post: {
                            post_id: info.post,
                            title: info.title,
                            salary: info.salary,
                        },
                        passport: {
                            passport_id: info.passport,
                            surname: info.surname,
                            middlename: info.middlename,
                            lastname: info.lastname,
                        },
                    }
                })
            })
        } catch (e) {
            logger.error(e);
        }
        connectManager.disconnect(connName);
        return result;
    }
}

export const userShortInfoHandler = new UserShortInfoHandler();