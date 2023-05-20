import { statuses } from "../consts";
import logger from "../logger";
import { connectManager } from "../modules/ConnectManager";
import { v4 as uuidv4 } from 'uuid';
import BaseHandler from "./BaseHandler";

class ScheduleHandler extends BaseHandler {
    async request(request: any, reply: any) {
        const staffId = await super.callMiddleware(request, reply);
        if (staffId === 0) {return true}
        reply.headers('Content-Type', "application/json");

        const id = request.params.id;
        if (!id) {
            reply.code(statuses.INVALID_ARGS);
        }

        const response = await this.getRequest(staffId, id);
        if (response.length) {
            reply.code(statuses.SUCCESS).send(JSON.stringify(response));
        } else {
            reply.code(statuses.SERVER_ERROR);
        }
        return false;
    }

    private async getRequest(staffId: number, staff_id: number) {
        const connName = uuidv4();
        const connection = connectManager.connect(connName);
        this.middleware.setRole(staffId, connection);
        let result: any = {};
        try {
            const response = await connection.many({
                text: 'SELECT week_day, workstart, workend, office FROM schedules s WHERE s.staff_id=$1',
                values: [staff_id]
            });
            result = response;
        } catch (e) {
            logger.error(e);
        }
        connectManager.disconnect(connName);
        return result;
    }
}

export const scheduleHandler = new ScheduleHandler();