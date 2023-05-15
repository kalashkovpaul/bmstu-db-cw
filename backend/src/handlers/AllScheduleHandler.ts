import { statuses } from "../consts";
import logger from "../logger";
import { connectManager } from "../modules/ConnectManager";
import { keyChecker } from "../modules/KeyChecker";
import { v4 as uuidv4 } from 'uuid';
import IHandler from "./IHandler";

class AllScheduleHandler implements IHandler {
    async request(request: any, reply: any) {
        reply.headers('Content-Type', "application/json");
        let key = request.headers["authorization"];
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
                text: 'SELECT sc.schedule_id, sc.week_day, sc.workstart, sc.workend, sc.office, st.staff_id, pos.post_id, pos.title, pas.passport_id, pas.surname, pas.middlename, pas.lastname FROM schedules sc JOIN staff st ON sc.staff_id=st.staff_id JOIN posts pos ON st.post=pos.post_id JOIN passports pas ON st.passport=pas.passport_id',
            });
            let scheduleList: any[] = [];
            let prevStaffId = -1;
            response.forEach((info: any, i: number) => {
                const staff =  {
                    staff_id: info.staff_id,
                    post: {
                        post_id: info.post_id,
                        title: info.title
                    },
                    passport: {
                        passport_id: info.passport,
                        surname: info.surname,
                        middlename: info.middlename,
                        lastname: info.lastname,
                    },
                }
                const schedule = {
                    schedule_id: info.schedule_id,
                    week_day: info.week_day,
                    workstart: info.workstart,
                    workend: info.workend,
                    office: info.office
                }
                scheduleList.push(schedule);

                if (prevStaffId != info.staff_id && i !=0) {
                    result.push({
                        staff: staff,
                        schedule: scheduleList,
                    });
                    scheduleList = [];
                }
            })
        } catch (e) {
            logger.error(e);
        }
        connectManager.disconnect(connName);
        return result;
    }
}

export const allScheduleHandler = new AllScheduleHandler();