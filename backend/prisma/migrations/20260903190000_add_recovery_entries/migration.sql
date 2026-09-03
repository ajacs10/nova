CREATE TABLE "recovery_entries" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "headache" INTEGER NOT NULL DEFAULT 0,
    "dizziness" INTEGER NOT NULL DEFAULT 0,
    "fatigue" INTEGER NOT NULL DEFAULT 0,
    "nausea" INTEGER NOT NULL DEFAULT 0,
    "light_sensitivity" INTEGER NOT NULL DEFAULT 0,
    "noise_sensitivity" INTEGER NOT NULL DEFAULT 0,
    "concentration" INTEGER NOT NULL DEFAULT 0,
    "memory" INTEGER NOT NULL DEFAULT 0,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "sleep_difficulty" INTEGER NOT NULL DEFAULT 0,
    "sleep_hours" DECIMAL(4,1),
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "recovery_entries_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "activity_entries" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "activity" TEXT NOT NULL,
    "duration_minutes" INTEGER NOT NULL,
    "headache_before" INTEGER NOT NULL DEFAULT 0,
    "fatigue_before" INTEGER NOT NULL DEFAULT 0,
    "dizziness_before" INTEGER NOT NULL DEFAULT 0,
    "headache_after" INTEGER NOT NULL DEFAULT 0,
    "fatigue_after" INTEGER NOT NULL DEFAULT 0,
    "dizziness_after" INTEGER NOT NULL DEFAULT 0,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "activity_entries_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "recovery_entries_user_id_created_at_idx" ON "recovery_entries"("user_id", "created_at");
CREATE INDEX "activity_entries_user_id_created_at_idx" ON "activity_entries"("user_id", "created_at");
ALTER TABLE "recovery_entries" ADD CONSTRAINT "recovery_entries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "activity_entries" ADD CONSTRAINT "activity_entries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "recovery_entries" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "recovery_entries" FORCE ROW LEVEL SECURITY;
CREATE POLICY "recovery_entries_user_isolation" ON "recovery_entries" USING ("user_id" = current_setting('app.user_id', true)::uuid) WITH CHECK ("user_id" = current_setting('app.user_id', true)::uuid);
ALTER TABLE "activity_entries" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "activity_entries" FORCE ROW LEVEL SECURITY;
CREATE POLICY "activity_entries_user_isolation" ON "activity_entries" USING ("user_id" = current_setting('app.user_id', true)::uuid) WITH CHECK ("user_id" = current_setting('app.user_id', true)::uuid);