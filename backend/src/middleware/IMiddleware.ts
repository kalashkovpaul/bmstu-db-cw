export default interface IMiddleware {
    work(request: any, reply: any): Promise<number>;
    setRole(staffId: number, connection: any): void;
}