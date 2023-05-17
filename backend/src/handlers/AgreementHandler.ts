import { statuses } from "../consts";
import logger from "../logger";
import { connectManager } from "../modules/ConnectManager";
import { v4 as uuidv4 } from 'uuid';
import BaseHandler from "./BaseHandler";

class AgreementHandler extends BaseHandler {
    async request(request: any, reply: any) {
        const staffId = await super.callMiddleware(request, reply);
        if (staffId === 0) {return true}
        reply.headers('Content-Type', "application/json");

        const id = request.params.id;

        const response = await this.getRequest(staffId, id);
        if (response.patient_id) {
            reply.code(statuses.SUCCESS).send(JSON.stringify(response));
        } else {
            reply.code(statuses.SERVER_ERROR);
        }
        return false;
    }

    private async getRequest(staffId: number, id: number) {
        const connName = uuidv4();
        const connection = connectManager.connect(connName);
        this.middleware.setRole(staffId, connection);
        this.middleware.setRole(staffId, connection);
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