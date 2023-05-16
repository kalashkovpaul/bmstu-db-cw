import { statuses } from "../consts";
import logger from "../logger";
import { connectManager } from "../modules/ConnectManager";
import { keyChecker } from "../modules/KeyChecker";
import { v4 as uuidv4 } from 'uuid';
import IHandler from "./IHandler";

class AuthHandler implements IHandler {
    async request(request: any, reply: any) {
        if (request.method === "DELETE") {
            const key = request.headers.get("Authorization");
            keyChecker.removeKey(key);
            reply.code(statuses.SUCCESS);
            return true;
        }
        const authData = JSON.parse(request.body);
        reply.headers('Content-Type', "application/json");
        if (!(authData?.username && authData?.password)) {
            reply.code(statuses.INVALID_ARGS);
        }
        const response = await this.checkAuthData(authData.username, authData.password);
        if (!response?.username) {
            reply.code(statuses.INVALID_ARGS);
        }
        const key = uuidv4();
        response.password = key;
        response.schedule = await this.getSchedule(response.staff.staff_id);
        keyChecker.registerKey(key, response.staff.staff_id);
        reply.code(statuses.SUCCESS).send(JSON.stringify(response));
        return false;
    }

    private async checkAuthData(username: string, password: string) {
        const connName = uuidv4();
        const connection = connectManager.connect(connName);
        let result: any = {};
        try {
            const response = await connection.one({
                text: 'SELECT a.username, a.access_level, s.*, p.*, ps.* FROM staff s LEFT JOIN accesses a ON s.staff_id=a.staff_id JOIN posts p ON s.post=p.post_id JOIN passports ps ON s.passport=ps.passport_id WHERE a.username=$1 AND a.passwordhash=$2',
                values: [username, password]
            });
            result = {
                username: response.username,
                access_level: response.access_level,
                passport: {
                    passport_id: response.passport_id,
                    surname: response.surname,
                    middlename: response.middlename,
                    lastname: response.lastname,
                    birth_date: response.birth_date,
                    gender: response.gender,
                    series: response.series,
                    num: response.num,
                    issue_date: response.issue_date,
                    issue_location: response.issue_location,
                },
                post: {
                    post_id: response.post_id,
                    title: response.title,
                    salary: response.salary,
                },
                staff: {
                    staff_id: response.staff_id,
                    passport: response.passport,
                    post: response.post,
                    employment_date: response.employment_date,
                    dismissal_date: response.dismissal_date,
                }
            }
        } catch (e) {
            logger.error(e);
        }
        connectManager.disconnect(connName);
        return result;
    }

    private async getSchedule(id: number) {
        const connName = uuidv4();
        const connection = connectManager.connect(connName);
        let result: any = {};
        try {
            const response = await connection.many({
                text: 'SELECT * FROM schedules WHERE staff_id=$1',
                values: [id]
            });
            result = response;
        } catch (e) {
            logger.error(e);
        }
        connectManager.disconnect(connName);
        return result;
    }
}

export const authHandler = new AuthHandler();