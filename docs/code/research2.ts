private async postRequest(staffId: number, jsonData: string) {
    const data = JSON.parse(jsonData);
    const connName = uuidv4();
    const connection = connectManager.connect(connName);
    this.middleware.setRole(staffId, connection);
    let result = false;
    try {
        const startTime = performance.now();
        const access = await prisma.accesses.create({
            data: {
                staff_id: data.staff.staff_id,
                username: data.username,
                passwordhash: Buffer.from(data.password),
                access_level: data.access_level
                    as access_level_t,
            }
        });
        logger.info(`2.2: ${performance.now() - startTime}`);
        result = true;
    } catch (e) {
        logger.error(e);
    }
    connectManager.disconnect(connName);
    return result;
}