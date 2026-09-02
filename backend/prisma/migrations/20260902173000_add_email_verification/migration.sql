-- AlterTable
ALTER TABLE "users"
ADD COLUMN "email_verified_at" TIMESTAMP(3),
ADD COLUMN "email_verification_token_hash" TEXT,
ADD COLUMN "email_verification_expires_at" TIMESTAMP(3);

-- Existing accounts are trusted because they predate email verification.
UPDATE "users" SET "email_verified_at" = CURRENT_TIMESTAMP WHERE "email_verified_at" IS NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_email_verification_token_hash_key" ON "users"("email_verification_token_hash");
