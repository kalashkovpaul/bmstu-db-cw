private async postRequest(staffId: number, jsonData: string) {
    const data = JSON.parse(jsonData);
    const connName = uuidv4();
    const connection = connectManager.connect(connName);
    this.middleware.setRole(staffId, connection);
    let result = false;
    try {
        const startTime = performance.now();
        await connection.tx(async (t: any) => {
            await t.none({
                text: 'INSERT INTO accesses (staff_id,
                    username,
                    passwordhash,
                    access_level)
                VALUES ($1, $2, $3, $4)',
                values: [data.staff.staff_id,
                    data.username,
                    data.password,
                    data.access_level],
            });
        });
        logger.info(`1.2: ${performance.now() - startTime}`);
        result = true;
    } catch (e) {
        logger.error(e);
    }
    connectManager.disconnect(connName);
    return result;
}