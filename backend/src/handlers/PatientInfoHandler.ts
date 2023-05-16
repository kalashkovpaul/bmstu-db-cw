import { statuses } from "../consts";
import logger from "../logger";
import { connectManager } from "../modules/ConnectManager";
import { v4 as uuidv4 } from 'uuid';
import BaseHandler from "./BaseHandler";

class PatientInfoHandler extends BaseHandler {
    async request(request: any, reply: any) {
        const staffId = await super.callMiddleware(request, reply);
        if (staffId === 0) {return true}

        if (request.method === "GET") {
            const id = request.params;
            const response = await this.getRequest(id);
            reply.code(statuses.SUCCESS).send(response);
        } else if (request.method === "PUT") {
            const response = await this.putRequest(request.data);
            if (response) {
                reply.code(statuses.SUCCESS);
            } else {
                reply.code(statuses.SERVER_ERROR);
            }
        } else if (request.method === "POST") {
            const response = await this.postRequest(request.data);
            if (response) {
                reply.code(statuses.SUCCESS);
            } else {
                reply.code(statuses.SERVER_ERROR);
            }
        }
        return false;
    }

    private async getRequest(id: number): Promise<string> {
        const connName = uuidv4();
        const connection = connectManager.connect(connName);
        let result = "";
        try {
            const response = await connection.one({
                text: 'SELECT * FROM patients LEFT JOIN passports ON passport=passport_id LEFT JOIN addresses ON address_id=address_id WHERE patient_id=$1',
                values: [id]
            });
            result =  JSON.stringify(response);

        } catch (e) {
            logger.error(e);
        }
        connectManager.disconnect(connName);
        return result;
    }

    private async putRequest(jsonData: any): Promise<boolean> {
        const data = JSON.parse(jsonData);
        const connName = uuidv4();
        const connection = connectManager.connect(connName);
        let result = false;
        try {
            await connection.tx(async (t: any) => {
                await connection.none({
                    text: 'UPDATE patients SET phone=$1, home_phone=$2, email=$3 WHERE patient_id=$4',
                    values: [data.phone, data.home_phone ? data.home_phone : "NULL", data.email ? data.email : "NULL", data.patient_id]
                });
                await connection.none({
                    text: 'UPDATE addresses SET country=$1, city=$2, street=$3, house=$4, flat=$5 WHERE address_id=$6',
                    values: [data.address.country, data.address.city, data.address.street, data.address.house, data.address.flat ? data.address.flat : "NULL", data.address.address_id]
                });
                await connection.none({
                    text: 'UPDATE passports SET surname=$1, middlename=$2, lastname=$3, birth_date=$4::date, gender=$5, series=$6, num=$7, issue_date=$8::date, issue_location=$9 WHERE passport_id=$10',
                    values: [data.passport.surname, data.passport.middlename, data.passport.lastname, data.passport.birth_date, data.passport.gender, data.passport.series, data.passport.num, data.passport.issue_date, data.passport.issue_location, data.passport.passport_id],
                });
            });
            result = true;

        } catch (e) {
            logger.error(e);
        }
        connectManager.disconnect(connName);
        return result;
    }

    private async postRequest(jsonData: string) {
        const data = JSON.parse(jsonData);
        const connName = uuidv4();
        const connection = connectManager.connect(connName);
        let result = false;
        try {
            await connection.tx(async (t: any) => {
                const address_id = (await connection.one({
                    text: 'INSERT INTO addresses (country, city, street, house, flat) VALUES ($1, $2, $3, $4, $5) RETURNING address_id;',
                    values: [data.address.country, data.address.city, data.address.street, data.address.house, data.address.flat ? data.address.flat : "NULL"]
                })).address_id;
                const passport_id = (await connection.one({
                    text: 'INSERT INTO passports (surname, middlename, lastname, birth_date, gender, series, num, issue_date, issue_location) VALUES ($1, $2, $3, $4::date, $5, $6, $7, $8::date, $9) RETURNING passport_id;',
                    values: [data.passport.surname, data.passport.middlename, data.passport.lastname, data.passport.birth_date, data.passport.gender, data.passport.series, data.passport.num, data.passport.issue_date, data.passport.issue_location, data.passport.passport_id],
                })).passport_id;
                await connection.none({
                    text: 'INSERT INTO patients SET (address_id, passport, phone, home_phone, email) VALUES ($1, $2, $3, $4, $5);',
                    values: [address_id, passport_id, data.phone, data.home_phone ? data.home_phone : "NULL", data.email ? data.email : "NULL", data.patient_id]
                });
            });
            result = true;

        } catch (e) {
            logger.error(e);
        }
        connectManager.disconnect(connName);
        return result;
    }
}

export const patientInfoHandler = new PatientInfoHandler();