import { statuses } from "../consts";
import logger from "../logger";
import { connectManager } from "../modules/ConnectManager";
import { v4 as uuidv4 } from 'uuid';
import BaseHandler from "./BaseHandler";

class UpdateUserHandler extends BaseHandler{
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
                let text = 'UPDATE accesses SET';
                if (data['username']) {
                    text += ` username='${data.username}',`
                }
                if (data['password']) {
                    text += ` passwordhash='${data.password}',`
                }
                if (data['access_level']) {
                    text += ` access_level='${data.access_level}'`
                }
                if (text.charAt(text.length - 1) === ',') {
                    text = text.slice(0, -1) + ' '
                }
                text += ' WHERE access_id=$1';
                await t.none({
                    text: text,
                    values: [data.access_id],
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
        let state = true;
        state = state && data['access_id'];
        state = state && (data['username'] || data['password'] || data['access_level']);
        return state;
    }
}

export const updateUserHandler = new UpdateUserHandler();