import IHandler from "./IHandler";
import IMiddleware from "../middleware/IMiddleware";
import { mainMiddleware } from "../middleware/Middleware";

export default class BaseHandler implements IHandler {
    protected middleware: IMiddleware;

    constructor() {
        this.middleware = mainMiddleware;
    }

    async callMiddleware(request: any, reply: any) {
        return this.middleware.work(request, reply);
    }

    async request(request: any, reply: any) {
        return false;
    }
}
