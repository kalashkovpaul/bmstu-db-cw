import { statuses } from "../consts";
import logger from "../logger";
import { connectManager } from "../modules/ConnectManager";
import { keyChecker } from "../modules/KeyChecker";
import { v4 as uuidv4 } from 'uuid';
import IHandler from "./IHandler";

class RecordShortInfoHandler implements IHandler {
    async request(request: any, reply: any) {
        reply.headers('Content-Type', "application/json");
        // let key = request.headers["Authorization"];
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
        let result: any = {};
        try {
            const response = await connection.many({
                text: 'SELECT r.record_id, r.record_date, pas.surname, pas.middlename, p1.surname, p1.middlename FROM records r JOIN agreements a ON r.agreement_id=a.agreement_id JOIN patients p ON a.patient_id=p.patient_id JOIN passports pas ON p.passport=pas.passport_id JOIN sessions s ON s.record_id=r.record_id JOIN staff st ON st.staff_id=s.doctor_id JOIN passports p1 ON p1.passport_id=st.passport;',
            });
            result = response;
        } catch (e) {
            logger.error(e);
        }
        connectManager.disconnect(connName);
        return result;
    }
}

export const recordShortInfoHandler = new RecordShortInfoHandler();