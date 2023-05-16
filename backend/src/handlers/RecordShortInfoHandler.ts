import { statuses } from "../consts";
import logger from "../logger";
import { connectManager } from "../modules/ConnectManager";
import { v4 as uuidv4 } from 'uuid';
import BaseHandler from "./BaseHandler";

class RecordShortInfoHandler extends BaseHandler {
    async request(request: any, reply: any) {
        const staffId = await super.callMiddleware(request, reply);
        if (staffId === 0) {return true}
        reply.headers('Content-Type', "application/json");

        const response = await this.getRequest();
        if (response.length) {
            reply.code(statuses.SUCCESS).send(JSON.stringify(response));
        } else {
            reply.code(statuses.SERVER_ERROR);
        }
        return false;
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