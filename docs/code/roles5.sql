CREATE POLICY users_update
    ON accesses
    FOR UPDATE
    TO doctor, chief, registry
    USING (access_id = (select user_uuid from session));

CREATE POLICY users_update_admin
    ON accesses
    FOR UPDATE
    TO admin
    USING (true);

CREATE POLICY users_delete_admin
    ON accesses
    FOR DELETE
    TO admin
    USING (true);

CREATE OR REPLACE PROCEDURE before_each_query(IN user_uuid int)
    LANGUAGE plpgsql
AS
$$
DECLARE
    role_name regrole;
BEGIN
    role_name = (SELECT role FROM users WHERE
        accesses.access_id = user_uuid)::regrole;
    execute format('SET role %I', role_name);
    execute format('SET app.user_uuid = %L', user_uuid);
END;
$$;