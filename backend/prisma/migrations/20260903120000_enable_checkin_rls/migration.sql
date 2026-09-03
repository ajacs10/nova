-- Protect personal wellbeing records at the database boundary.
ALTER TABLE "check_ins" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "check_ins" FORCE ROW LEVEL SECURITY;

CREATE POLICY "check_ins_user_isolation"
ON "check_ins"
USING ("user_id" = current_setting('app.user_id', true)::uuid)
WITH CHECK ("user_id" = current_setting('app.user_id', true)::uuid);
