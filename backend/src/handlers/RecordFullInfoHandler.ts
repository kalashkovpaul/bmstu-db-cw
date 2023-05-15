import { statuses } from "../consts";
import logger from "../logger";
import { connectManager } from "../modules/ConnectManager";
import { keyChecker } from "../modules/KeyChecker";
import { v4 as uuidv4 } from 'uuid';
import IHandler from "./IHandler";

class RecordFullInfoHandler implements IHandler{
    async request(request: any, reply: any) {
        reply.headers('Content-Type', "application/json");
        let key = request.headers["authorization"];
        if (!key) {
            logger.error(`key: ${key}`);
            reply.code(statuses.UNAUTHORIZED);
            return;
        }
        const explicityKey = "Explicit: ";
        const index = key.indexOf(explicityKey);
        if (index === -1) {
            logger.error(`index: ${index}, key: ${key}`);
            reply.code(statuses.UNAUTHORIZED);
            return;
        }
        key = key.slice(explicityKey.length);
        const staffId = keyChecker.getOwner(key);
        if (staffId === -1) {
            logger.error(`staffId: ${staffId}, key: ${key}`);
            reply.code(statuses.UNAUTHORIZED);
            return;
        }

        if (!this.checkData(request.body)) {
            logger.error(`body: ${request.body}`);
            reply.code(statuses.INVALID_ARGS);
            return;
        }

        const data = JSON.parse(request.body);
        if (!(data?.title && data?.salary)) {
            reply.code(statuses.INVALID_ARGS);
        }
        const result = await this.postRequest(request.body);
        if (!result.length) {
            reply.code(statuses.SERVER_ERROR);
        } else {
            reply.code(statuses.SUCCESS).send(JSON.stringify(result));
        }
    }

    private async postRequest(jsonData: string) {
        const data = JSON.parse(jsonData);
        const connName = uuidv4();
        const connection = connectManager.connect(connName);
        let result: any = [];
        try {
            const response = await connection.many({
                text: 'SELECT r.*, s.*, pas.*, p1.surname as doctor_surname, p1.middlename as doctor_middlename, p1.lastname as doctor_lastname FROM records r JOIN agreements a ON r.agreement_id=a.agreement_id JOIN patients p ON a.patient_id=p.patient_id JOIN passports pas ON p.passport=pas.passport_id  JOIN sessions s ON r.record_id=s.record_id JOIN staff st ON s.doctor_id=st.staff_id JOIN passports p1 ON p1.passport_id=st.passport WHERE r.record_id=$1',
                values: [data.record_id],
            });
            response.forEach((info: any) => {
                result.push({
                    record_id: info.record_id,
                    record_date: info.record_date,
                    doctor: {
                        staff_id: info.doctor_id,
                        surname: info.doctor_surname,
                        middlename: info.doctor_middlename,
                        lastname: info.doctor_lastname
                    },
                    patient: {
                        patient_id: info.patient_id,
                        surname: info.surname,
                        middlename: info.middlename,
                        lastname: info.lastname,
                    },
                    session: {
                        session_id: info.session_id,
                        state_id: info.state_id,
                        dynamics: info.dynamics,
                        prescription: info.prescription,
                        note: info.note,
                    }
                });
            });
        } catch (e) {
            logger.error(e);
        }
        connectManager.disconnect(connName);
        return result;
    }

    private checkData(jsonData: string) {
        const data = JSON.parse(jsonData);
        const fields = ['record_id'];
        let state = true;
        fields.forEach(field => {
            state = state && (data[field] !== undefined);
            if (!state) {
                return false;
            }
        });
        return state;
    }
}

export const recordFullInfoHandler = new RecordFullInfoHandler();