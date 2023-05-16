import { statuses } from "../consts";
import logger from "../logger";
import { connectManager } from "../modules/ConnectManager";
import { v4 as uuidv4 } from 'uuid';
import BaseHandler from "./BaseHandler";

class CurrentRecordHandler extends BaseHandler{
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
        if (!(data?.title && data?.salary)) {
            reply.code(statuses.INVALID_ARGS);
        }
        const result = await this.postRequest(request.body);
        if (!result.length) {
            reply.code(statuses.SERVER_ERROR);
        } else {
            reply.code(statuses.SUCCESS).send(JSON.stringify(result));
        }
        return false;
    }

    private async postRequest(jsonData: string) {
        const data = JSON.parse(jsonData);
        const connName = uuidv4();
        const connection = connectManager.connect(connName);
        let result: any = {};
        try {
            const response = await connection.many({
                    text: 'SELECT pas.surname, pas.middlename FROM records r JOIN agreements a ON r.agreement_id=a.agreement_id JOIN patients p ON a.patient_id=p.patient_id JOIN passports pas ON p.passport=pas.passport_id WHERE r.next_date=$1',
                    values: [data.date],
                });
            result = response;
        } catch (e) {
            logger.error(e);
        }
        connectManager.disconnect(connName);
        return result;
    }

    private checkData(jsonData: string) {
        const data = JSON.parse(jsonData);
        const fields = ['date'];
        let state = true;
        fields.forEach(field => {
            state = state && (data[field] !== undefined);
            if (!state) {
                return false;
            }
        });
        return state;
    }
}

export const currentRecordHandler = new CurrentRecordHandler();