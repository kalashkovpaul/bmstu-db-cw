import { statuses } from "../consts";
import logger from "../logger";
import { connectManager } from "../modules/ConnectManager";
import { keyChecker } from "../modules/KeyChecker";
import { v4 as uuidv4 } from 'uuid';
import IHandler from "./IHandler";

class DismissStaffHandler implements IHandler {
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

        if (!this.checkData(request.body)) {
            logger.error(`body: ${request.body}`);
            reply.code(statuses.INVALID_ARGS);
            return;
        }

        let result = false;
        result = await this.updateStaff(request.body);
        if (!result) {
            reply.code(statuses.SERVER_ERROR);
        } else {
            reply.code(statuses.SUCCESS);
        }
    }

    private async updateStaff(jsonData: string) {
        const data = JSON.parse(jsonData);
        const connName = uuidv4();
        const connection = connectManager.connect(connName);
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