CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS "TouristPlace_name_trgm_idx" ON "TouristPlace" USING GIN ("name" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS "TouristPlace_description_trgm_idx" ON "TouristPlace" USING GIN ("description" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS "TouristPlace_address_trgm_idx" ON "TouristPlace" USING GIN ("address" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS "TouristPlace_latitude_longitude_idx" ON "TouristPlace" ("latitude", "longitude");
CREATE INDEX IF NOT EXISTS "TouristPlace_rating_idx" ON "TouristPlace" ("rating");
CREATE INDEX IF NOT EXISTS "TouristPlace_createdAt_idx" ON "TouristPlace" ("createdAt");
CREATE INDEX IF NOT EXISTS "Indicator_period_idx" ON "Indicator" ("period");
