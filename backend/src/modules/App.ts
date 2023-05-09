import { API, api } from "./api";

export default class App {
    private api: API;

    constructor() {
        this.api = api;
    }

    start() {
        this.api.startServer();
    }
}