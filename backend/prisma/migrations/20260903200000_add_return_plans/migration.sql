CREATE TABLE "return_to_learn" (
  "id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "current_stage" INTEGER NOT NULL DEFAULT 1,
  "school_hours" DECIMAL(4,1),
  "breaks" TEXT,
  "screen_time_minutes" INTEGER,
  "cognitive_activity" TEXT,
  "accommodations" TEXT,
  "symptoms" TEXT,
  "notes" TEXT,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "return_to_learn_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "return_to_learn_user_id_key" ON "return_to_learn"("user_id");
ALTER TABLE "return_to_learn" ADD CONSTRAINT "return_to_learn_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "return_to_learn" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "return_to_learn" FORCE ROW LEVEL SECURITY;
CREATE POLICY "return_to_learn_user_isolation" ON "return_to_learn" USING ("user_id" = current_setting('app.user_id', true)::uuid) WITH CHECK ("user_id" = current_setting('app.user_id', true)::uuid);

CREATE TABLE "return_to_activity" (
  "id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "current_stage" INTEGER NOT NULL DEFAULT 1,
  "activity_type" TEXT,
  "duration_minutes" INTEGER,
  "intensity" TEXT,
  "symptoms_before" TEXT,
  "symptoms_after" TEXT,
  "notes" TEXT,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "return_to_activity_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "return_to_activity_user_id_key" ON "return_to_activity"("user_id");
ALTER TABLE "return_to_activity" ADD CONSTRAINT "return_to_activity_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "return_to_activity" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "return_to_activity" FORCE ROW LEVEL SECURITY;
CREATE POLICY "return_to_activity_user_isolation" ON "return_to_activity" USING ("user_id" = current_setting('app.user_id', true)::uuid) WITH CHECK ("user_id" = current_setting('app.user_id', true)::uuid);