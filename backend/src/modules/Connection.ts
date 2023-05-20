import logger from '../logger';
import pgPromise from 'pg-promise';

export default class Connection {
    private state: boolean;
    private connectionInfo: any;
    private connection: any;


    constructor(connInfo: any) {
        this.connectionInfo = connInfo;
        this.state = false;
    }

    tryConnect(): boolean {
        const promise = pgPromise();
        const connectionURL = `${this.connectionInfo.dbName}://${this.connectionInfo.user}:${this.connectionInfo.password}@${this.connectionInfo.url}:${this.connectionInfo.port}/${this.connectionInfo.db}`;
        try {
            this.connection = promise(connectionURL);
            this.state = true;
        } catch (e) {
            logger.error(e);
            return false;
        }
        return true;
    }

    isConnected(): boolean {
        return this.state;
    }

    closeConnection(): void {
        this.connection.$pool.end();
    }

    async one(params: any) {
        if (this.state) {
            return await this.connection.one(params);
        }
        return null;
    }

    async none(params: any) {
        if (this.state) {
            return await this.connection.none(params);
        }
        return null;
    }

    async many(params: any) {
        if (this.state) {
            return await this.connection.many(params);
        }
        return null;
    }

    async tx(params: any) {
        if (this.state) {
            return await this.connection.tx(params);
        }
        return null;
    }

    async proc(params: any) {
        if (this.state) {
            return await this.connection.proc(params);
        }
        return null;
    }
}