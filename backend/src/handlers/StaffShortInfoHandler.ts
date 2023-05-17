import { statuses } from "../consts";
import logger from "../logger";
import { connectManager } from "../modules/ConnectManager";
import { v4 as uuidv4 } from 'uuid';
import BaseHandler from "./BaseHandler";

class StaffShortInfoHandler extends BaseHandler {
    async request(request: any, reply: any) {
        const staffId = await super.callMiddleware(request, reply);
        if (staffId === 0) {return true}
        reply.headers('Content-Type', "application/json");

        const response = await this.getRequest(staffId);
        if (response.length) {
            reply.code(statuses.SUCCESS).send(JSON.stringify(response));
        } else {
            reply.code(statuses.SERVER_ERROR);
        }
        return false;
    }

    private async getRequest(staffId: number) {
        const connName = uuidv4();
        const connection = connectManager.connect(connName);
        this.middleware.setRole(staffId, connection);
        let result: any = {};
        try {
            const response = await connection.many({
                text: 'SELECT pas.surname, pas.middlename, pas.lastname, pos.title, s.dismissal_date, s.employment_date, s.staff_id FROM staff s JOIN passports pas ON pas.passport_id=s.passport JOIN posts pos ON s.post=pos.post_id WHERE s.staff_id NOT IN (SELECT access_id FROM accesses) AND s.dismissal_date is NULL;',
            });
            result = response;
        } catch (e) {
            logger.error(e);
        }
        connectManager.disconnect(connName);
        return result;
    }
}

export const staffShortInfoHandler = new StaffShortInfoHandler();