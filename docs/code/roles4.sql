ALTER TABLE accesses
    ENABLE ROW LEVEL SECURITY;
CREATE VIEW session AS
SELECT current_setting('app.user_uuid')::int AS user_uuid;

GRANT all ON session TO admin, chief, doctor, registry;

CREATE POLICY users_select
    ON accesses
    FOR SELECT
    USING (true);
