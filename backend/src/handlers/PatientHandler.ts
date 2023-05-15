import { statuses } from "../consts";
import logger from "../logger";
import { connectManager } from "../modules/ConnectManager";
import { keyChecker } from "../modules/KeyChecker";
import { v4 as uuidv4 } from 'uuid';
import IHandler from "./IHandler";

class PatientHandler implements IHandler {
    async request(request: any, reply: any) {
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

        const response = await this.putRequest(request.data);
        reply.code(statuses.SUCCESS).send(JSON.stringify(response));
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