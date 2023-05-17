import { statuses } from "../consts";
import logger from "../logger";
import { connectManager } from "../modules/ConnectManager";
import { v4 as uuidv4 } from 'uuid';
import BaseHandler from "./BaseHandler";

class DismissStaffHandler extends BaseHandler {
    async request(request: any, reply: any) {
        const staffId = await super.callMiddleware(request, reply);
        if (staffId === 0) {return true}
        reply.headers('Content-Type', "application/json");

        if (!this.checkData(request.body)) {
            logger.error(`body: ${request.body}`);
            reply.code(statuses.INVALID_ARGS);
            return true;
        }

        let result = false;
        result = await this.updateStaff(staffId, request.body);
        if (!result) {
            reply.code(statuses.SERVER_ERROR);
        } else {
            reply.code(statuses.SUCCESS);
        }
        return false;
    }

    private async updateStaff(staffId: number, jsonData: string) {
        const data = JSON.parse(jsonData);
        const connName = uuidv4();
        const connection = connectManager.connect(connName);
        this.middleware.setRole(staffId, connection);
        let result = false;
        try {
            await connection.tx(async (t: any) => {
                await t.none({
                    text: 'UPDATE staff SET dismissal_date=$1 WHERE staff_id=$2',
                    values: [data.dismissal_date, data.staff_id],
                });
                await t.none({
                    text: 'DELETE FROM schedules WHERE staff_id=$1',
                    values: [data.staff_id],
                });
            });
            result = true;
        } catch (e) {
            logger.error(e);
        }
        connectManager.disconnect(connName);
        return result;
    }

    private checkData(jsonData: string) {
        const data = JSON.parse(jsonData);
        const fields = ['staff_id', 'dismissal_date'];
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

export const dismissStaffHandler = new DismissStaffHandler();