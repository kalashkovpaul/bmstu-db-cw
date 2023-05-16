export default interface IHandler {
    request(request: any, response: any): Promise<boolean>;
    callMiddleware?(request: any, response: any): Promise<number>;
}