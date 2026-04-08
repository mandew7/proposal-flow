ALTER TABLE "Proposal" ADD COLUMN "publicId" TEXT;

UPDATE "Proposal"
SET "publicId" = 'pub_' || lower(hex(randomblob(12)))
WHERE "publicId" IS NULL;

CREATE UNIQUE INDEX "Proposal_publicId_key" ON "Proposal"("publicId");
CREATE INDEX "Proposal_publicId_idx" ON "Proposal"("publicId");
