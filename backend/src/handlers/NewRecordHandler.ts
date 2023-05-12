import { statuses } from "../consts";
import logger from "../logger";
import { connectManager } from "../modules/ConnectManager";
import { keyChecker } from "../modules/KeyChecker";
import { v4 as uuidv4 } from 'uuid';
import IHandler from "./IHandler";

class NewRecordHandler implements IHandler {
    async request(request: any, reply: any) {
        reply.headers('Content-Type', "application/json");
        // let key = request.headers["Authorization"];
        // if (!key) {
        //     logger.error(`key: ${key}`);
        //     reply.code(statuses.UNAUTHORIZED);
        //     return;
        // }
        // const explicityKey = "Explicit: ";
        // const index = key.indexOf(explicityKey);
        // if (index === -1) {
        //     logger.error(`index: ${index}, key: ${key}`);
        //     reply.code(statuses.UNAUTHORIZED);
        //     return;
        // }
        // key = key.slice(explicityKey.length);
        // const staffId = keyChecker.getOwner(key);
        // if (staffId === -1) {
        //     logger.error(`staffId: ${staffId}, key: ${key}`);
        //     reply.code(statuses.UNAUTHORIZED);
        //     return;
        // }

        if (!this.checkData(request.body)) {
            logger.error(`body: ${request.body}`);
            reply.code(statuses.INVALID_ARGS);
            return;
        }
        const response = await this.putRequest(request.body);
        if (response) {
            reply.code(statuses.SUCCESS);
        } else {
            reply.code(statuses.SERVER_ERROR);
        }
    }

    private async putRequest(jsonData: string): Promise<boolean> {
        const data = JSON.parse(jsonData);
        const connName = uuidv4();
        const connection = connectManager.connect(connName);
        let result = false;
        try {
            await connection.tx(async (t: any) => {
                const state_id = (await t.one({
                    text: 'INSERT INTO states (general_condition, height, patient_weight, pulse, pressure, temperature, other) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING state_id',
                    values: [data.state.general_condition, data.state.height, data.state.patient_weight, data.state.pulse, data.state.pressure, data.state.temperature, data.state.other],
                })).state_id;
                await t.none({
                    text: 'INSERT INTO sessions (doctor_id, patient_id, record_id, state_id, session_date, dynamics, prescription, note) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
                    values: [data.doctor_id, data.patient_id, data.record_id, state_id, data.session_date, data.dynamics, data.prescription, data.note]
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
        const fields = ['doctor_id', 'patient_id', 'record_id', 'session_date', 'dynamics', 'prescription', 'note', 'state'];
        const stateFields = ['general_condition', 'height', 'patient_weight', 'pulse', 'pressure', 'temperature', 'other'];
        let state = true;
        fields.forEach(field => {
            state = state && data[field] !== undefined;
            if (!state) {
                return false;
            }
        });

        const curState = data.state;
        stateFields.forEach(field => {
            state = state && curState[field] !== undefined;
            if (!state) {
                return false;
            }
        });
        return state;
    }
}

export const newRecordHandler = new NewRecordHandler();