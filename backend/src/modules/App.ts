import { Server, api } from "./server";

export default class App {
    private api: Server;

    constructor() {
        this.api = api;
    }

    start() {
        this.api.startServer();
    }
}