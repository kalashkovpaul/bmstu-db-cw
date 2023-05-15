import { statuses } from "../consts";
import logger from "../logger";
import { connectManager } from "../modules/ConnectManager";
import { keyChecker } from "../modules/KeyChecker";
import { v4 as uuidv4 } from 'uuid';
import IHandler from "./IHandler";

class AgreementHandler implements IHandler {
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

        const id = request.params.id;

        const response = await this.getRequest(id);
        if (response.patient_id) {
            reply.code(statuses.SUCCESS).send(JSON.stringify(response));
        } else {
            reply.code(statuses.SERVER_ERROR);
        }
    }

    private async getRequest(id: number) {
        const connName = uuidv4();
        const connection = connectManager.connect(connName);
        let result: any = {};
        try {
            const response = await connection.one({
                text: 'SELECT * from agreements where patient_id=$1',
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

export const agreementHandler = new AgreementHandler();