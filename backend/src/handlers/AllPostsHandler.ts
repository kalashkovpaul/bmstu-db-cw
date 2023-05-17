import { statuses } from "../consts";
import logger from "../logger";
import { connectManager } from "../modules/ConnectManager";
import { v4 as uuidv4 } from 'uuid';
import BaseHandler from "./BaseHandler";

class AllPostsHandler extends BaseHandler {
    async request(request: any, reply: any) {
        const staffId = await super.callMiddleware(request, reply);
        if (staffId === 0) {return true}
        reply.headers('Content-Type', "application/json");
        const response = await this.getRequest(staffId);
        reply.code(statuses.SUCCESS).send(JSON.stringify(response));
        return false;
    }

    private async getRequest(staffId: number): Promise<string> {
        const connName = uuidv4();
        const connection = connectManager.connect(connName);
        this.middleware.setRole(staffId, connection);
        let result: any = {};
        try {
            const response = await connection.many({
                text: 'SELECT * FROM posts',
            });
            result = response;

        } catch (e) {
            logger.error(e);
        }
        connectManager.disconnect(connName);
        return result;
    }
}

export const allPostsHandler = new AllPostsHandler();