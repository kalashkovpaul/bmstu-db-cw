import { statuses } from "../consts";
import logger from "../logger";
import { connectManager } from "../modules/ConnectManager";
import { v4 as uuidv4 } from 'uuid';
import BaseHandler from "./BaseHandler";

class PatientHandler extends BaseHandler {
    async request(request: any, reply: any) {
        const staffId = await super.callMiddleware(request, reply);
        if (staffId === 0) {return true}
        const response = await this.putRequest(request.data);
        reply.code(statuses.SUCCESS).send(JSON.stringify(response));
        return false;
    }

    private async putRequest(jsonData: any): Promise<boolean> {
        const data = JSON.parse(jsonData);
        const connName = uuidv4();
        const connection = connectManager.connect(connName);
        let result = false;
        try {
            await connection.none({
                text: 'UPDATE patients SET phone=$1, home_phone=$2, email=$3 WHERE patient_id=$4',
                values: [data.phone, data.home_phone ? data.home_phone : "NULL", data.email ? data.email : "NULL", data.patient_id]
            });
            result = true;

        } catch (e) {
            logger.error(e);
        }
        connectManager.disconnect(connName);
        return result;
    }
}

export const patientHandler = new PatientHandler();