import { statuses } from "../consts";
import logger from "../logger";
import { connectManager } from "../modules/ConnectManager";
import { v4 as uuidv4 } from 'uuid';
import BaseHandler from "./BaseHandler";

class AddUserHandler extends BaseHandler{
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
        const result = await this.postRequest(staffId, request.body);
        if (!result) {
            reply.code(statuses.SERVER_ERROR);
        } else {
            reply.code(statuses.SUCCESS);
        }
        return false;
    }

    private async postRequest(staffId: number, jsonData: string) {
        const data = JSON.parse(jsonData);
        const connName = uuidv4();
        const connection = connectManager.connect(connName);
        this.middleware.setRole(staffId, connection);
        let result = false;
        try {
            await connection.tx(async (t: any) => {
                await t.none({
                    text: 'INSERT INTO accesses (staff_id, username, passwordhash, access_level) VALUES ($1, $2, $3, $4)',
                    values: [data.staff.staff_id, data.username, data.password, data.access_level],
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
        const fields = ['staff', 'username', 'password', 'access_level'];
        const staffFields = ['staff_id'];
        let state = true;
        fields.forEach(field => {
            state = state && (data[field] !== undefined);
            if (!state) {
                return false;
            }
        });

        const staff = data.staff;
        staffFields.forEach(field => {
            state = state && staff[field];
            if (!state) {
                return false;
            }
        });
        return state;
    }
}

export const addUserHandler = new AddUserHandler();