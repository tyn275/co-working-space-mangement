import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1789298855065 implements MigrationInterface {
  name = 'InitSchema1789298855065';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "roles" ("id" SERIAL NOT NULL, "name" character varying, CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."otp_verifications_purpose_enum" AS ENUM('confirm_account', 'reset_password')`,
    );
    await queryRunner.query(
      `CREATE TABLE "otp_verifications" ("id" BIGSERIAL NOT NULL, "user_id" bigint NOT NULL, "otp_code" character varying(6) NOT NULL, "purpose" "public"."otp_verifications_purpose_enum" NOT NULL, "expires_at" TIMESTAMP NOT NULL, "used_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_91d17e75ac3182dba6701869b39" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "amenities" ("id" BIGSERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_8c5f9c7ff7e2174b53d4be10247" UNIQUE ("name"), CONSTRAINT "PK_c0777308847b3556086f2fb233e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."space_prices_unit_enum" AS ENUM('hour', 'day', 'month')`,
    );
    await queryRunner.query(
      `CREATE TABLE "space_prices" ("id" BIGSERIAL NOT NULL, "space_id" bigint NOT NULL, "unit" "public"."space_prices_unit_enum" NOT NULL, "price" numeric(12,2) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e1699260b942a6c6ba7cb3f6d82" UNIQUE ("space_id", "unit"), CONSTRAINT "PK_5645cd813ba9cc523a2fbbc0624" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."spaces_type_enum" AS ENUM('private_office', 'meeting_room', 'desk')`,
    );
    await queryRunner.query(
      `CREATE TABLE "spaces" ("id" BIGSERIAL NOT NULL, "venue_id" bigint NOT NULL, "name" character varying NOT NULL, "type" "public"."spaces_type_enum" NOT NULL, "capacity" integer, "description" text, "open_time" TIME, "close_time" TIME, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_dbe542974aca57afcb60709d4c8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."venue_business_verifications_status_enum" AS ENUM('pending', 'approved', 'rejected')`,
    );
    await queryRunner.query(
      `CREATE TABLE "venue_business_verifications" ("id" BIGSERIAL NOT NULL, "venue_id" bigint NOT NULL, "business_license_url" character varying NOT NULL, "status" "public"."venue_business_verifications_status_enum" NOT NULL DEFAULT 'pending', "reviewed_by" bigint, "reviewed_at" TIMESTAMP, "rejection_reason" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c88171093fc19d9ff3e7e374c8f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."venues_status_enum" AS ENUM('pending', 'approved', 'blocked')`,
    );
    await queryRunner.query(
      `CREATE TABLE "venues" ("id" BIGSERIAL NOT NULL, "owner_id" bigint NOT NULL, "name" character varying NOT NULL, "description" text, "street" character varying, "city" character varying NOT NULL, "latitude" numeric(9,6), "longitude" numeric(9,6), "status" "public"."venues_status_enum" NOT NULL DEFAULT 'pending', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cb0f885278d12384eb7a81818be" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_identity_verifications_status_enum" AS ENUM('pending', 'approved', 'rejected')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_identity_verifications" ("id" BIGSERIAL NOT NULL, "user_id" bigint NOT NULL, "identity_card_url" character varying NOT NULL, "status" "public"."user_identity_verifications_status_enum" NOT NULL DEFAULT 'pending', "reviewed_by" bigint, "reviewed_at" TIMESTAMP, "rejection_reason" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e12d2753e44b8f6aedd4570c003" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_status_enum" AS ENUM('active', 'inactive', 'banned')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" BIGSERIAL NOT NULL, "email" character varying NOT NULL, "password_hash" character varying NOT NULL, "full_name" character varying, "phone" character varying, "avatar_url" character varying, "is_verified" boolean NOT NULL DEFAULT false, "status" "public"."users_status_enum" NOT NULL DEFAULT 'inactive', "language" character varying(5) NOT NULL DEFAULT 'vi', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "refresh_tokens" ("id" BIGSERIAL NOT NULL, "user_id" bigint NOT NULL, "token_hash" character varying NOT NULL, "expires_at" TIMESTAMP NOT NULL, "used_at" TIMESTAMP, "revoked" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."bookings_price_unit_enum" AS ENUM('hour', 'day', 'month')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."bookings_status_enum" AS ENUM('pending_payment', 'confirmed', 'cancelled', 'completed')`,
    );
    await queryRunner.query(
      `CREATE TABLE "bookings" ("id" BIGSERIAL NOT NULL, "user_id" bigint NOT NULL, "space_id" bigint NOT NULL, "start_time" TIMESTAMP NOT NULL, "end_time" TIMESTAMP NOT NULL, "price_unit" "public"."bookings_price_unit_enum" NOT NULL, "total_price" numeric(12,2) NOT NULL, "status" "public"."bookings_status_enum" NOT NULL DEFAULT 'pending_payment', "payment_deadline" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bee6805982cc1e248e94ce94957" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "messages" ("id" BIGSERIAL NOT NULL, "conversation_id" bigint NOT NULL, "sender_id" bigint NOT NULL, "content" text NOT NULL, "is_read" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "conversations" ("id" BIGSERIAL NOT NULL, "venue_id" bigint NOT NULL, "user_id" bigint NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_05b825cbacbf29e3c3438d4dbf5" UNIQUE ("venue_id", "user_id"), CONSTRAINT "PK_ee34f4f7ced4ec8681f26bf04ef" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."notifications_type_enum" AS ENUM('booking_status_changed', 'account_activated', 'payment_success', 'payment_failed', 'new_message', 'venue_approved', 'venue_blocked')`,
    );
    await queryRunner.query(
      `CREATE TABLE "notifications" ("id" BIGSERIAL NOT NULL, "user_id" bigint NOT NULL, "type" "public"."notifications_type_enum" NOT NULL, "title" character varying NOT NULL, "content" text, "reference_id" bigint, "is_read" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."payments_method_enum" AS ENUM('vnpay', 'momo', 'stripe')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."payments_status_enum" AS ENUM('pending', 'success', 'failed', 'refunded')`,
    );
    await queryRunner.query(
      `CREATE TABLE "payments" ("id" BIGSERIAL NOT NULL, "booking_id" bigint NOT NULL, "amount" numeric(12,2) NOT NULL, "method" "public"."payments_method_enum" NOT NULL, "status" "public"."payments_status_enum" NOT NULL DEFAULT 'pending', "transaction_ref" character varying, "paid_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "venue_amenities" ("venue_id" bigint NOT NULL, "amenity_id" bigint NOT NULL, CONSTRAINT "PK_0bce6c38a68d1b1c4062f4f1863" PRIMARY KEY ("venue_id", "amenity_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_52aa3f633512f7a025e288ba8e" ON "venue_amenities"  ("venue_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_12725c60b6e328ce52061f958c" ON "venue_amenities"  ("amenity_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "users_roles" ("user_id" bigint NOT NULL, "role_id" integer NOT NULL, CONSTRAINT "PK_c525e9373d63035b9919e578a9c" PRIMARY KEY ("user_id", "role_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e4435209df12bc1f001e536017" ON "users_roles"  ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1cf664021f00b9cc1ff95e17de" ON "users_roles"  ("role_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "otp_verifications" ADD CONSTRAINT "FK_c7f1d281e1acc51e2a37889f5a9" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "space_prices" ADD CONSTRAINT "FK_5a022da3fd0651a1e6127407108" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "spaces" ADD CONSTRAINT "FK_7ca393371d027b43548fc2b60fa" FOREIGN KEY ("venue_id") REFERENCES "venues"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "venue_business_verifications" ADD CONSTRAINT "FK_31764fd54bb6f7a80687b951db0" FOREIGN KEY ("venue_id") REFERENCES "venues"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "venue_business_verifications" ADD CONSTRAINT "FK_78702dfdc8a92d9d33cfba14d7f" FOREIGN KEY ("reviewed_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "venues" ADD CONSTRAINT "FK_8cb5cf3df16fc75663f85b5b35c" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_identity_verifications" ADD CONSTRAINT "FK_4d2dbc581da5336bf1f536f93a6" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_identity_verifications" ADD CONSTRAINT "FK_c013b04b4be083943c8e650736a" FOREIGN KEY ("reviewed_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" ADD CONSTRAINT "FK_64cd97487c5c42806458ab5520c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" ADD CONSTRAINT "FK_f6e66086711569d5090d330f3fb" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" ADD CONSTRAINT "FK_3bc55a7c3f9ed54b520bb5cfe23" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" ADD CONSTRAINT "FK_22133395bd13b970ccd0c34ab22" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" ADD CONSTRAINT "FK_1a5c3cb42574f0ea0b7c5a93692" FOREIGN KEY ("venue_id") REFERENCES "venues"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" ADD CONSTRAINT "FK_3a9ae579e61e81cc0e989afeb4a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_9a8a82462cab47c73d25f49261f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD CONSTRAINT "FK_e86edf76dc2424f123b9023a2b2" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "venue_amenities" ADD CONSTRAINT "FK_52aa3f633512f7a025e288ba8eb" FOREIGN KEY ("venue_id") REFERENCES "venues"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "venue_amenities" ADD CONSTRAINT "FK_12725c60b6e328ce52061f958c1" FOREIGN KEY ("amenity_id") REFERENCES "amenities"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_roles" ADD CONSTRAINT "FK_e4435209df12bc1f001e5360174" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_roles" ADD CONSTRAINT "FK_1cf664021f00b9cc1ff95e17de4" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    // Prevent overlapping bookings for the same space (manually added — TypeORM cannot generate EXCLUDE constraints)
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS btree_gist`);
    await queryRunner.query(
      `ALTER TABLE "bookings" ADD CONSTRAINT "no_overlap" EXCLUDE USING gist (space_id WITH =, tsrange(start_time, end_time) WITH &&) WHERE (status IN ('pending_payment', 'confirmed'))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users_roles" DROP CONSTRAINT "FK_1cf664021f00b9cc1ff95e17de4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_roles" DROP CONSTRAINT "FK_e4435209df12bc1f001e5360174"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" DROP CONSTRAINT "no_overlap"`,
    );
    await queryRunner.query(`DROP EXTENSION IF EXISTS btree_gist`);
    await queryRunner.query(
      `ALTER TABLE "venue_amenities" DROP CONSTRAINT "FK_12725c60b6e328ce52061f958c1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "venue_amenities" DROP CONSTRAINT "FK_52aa3f633512f7a025e288ba8eb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" DROP CONSTRAINT "FK_e86edf76dc2424f123b9023a2b2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "FK_9a8a82462cab47c73d25f49261f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" DROP CONSTRAINT "FK_3a9ae579e61e81cc0e989afeb4a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" DROP CONSTRAINT "FK_1a5c3cb42574f0ea0b7c5a93692"`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" DROP CONSTRAINT "FK_22133395bd13b970ccd0c34ab22"`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" DROP CONSTRAINT "FK_3bc55a7c3f9ed54b520bb5cfe23"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" DROP CONSTRAINT "FK_f6e66086711569d5090d330f3fb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" DROP CONSTRAINT "FK_64cd97487c5c42806458ab5520c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_identity_verifications" DROP CONSTRAINT "FK_c013b04b4be083943c8e650736a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_identity_verifications" DROP CONSTRAINT "FK_4d2dbc581da5336bf1f536f93a6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "venues" DROP CONSTRAINT "FK_8cb5cf3df16fc75663f85b5b35c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "venue_business_verifications" DROP CONSTRAINT "FK_78702dfdc8a92d9d33cfba14d7f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "venue_business_verifications" DROP CONSTRAINT "FK_31764fd54bb6f7a80687b951db0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spaces" DROP CONSTRAINT "FK_7ca393371d027b43548fc2b60fa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "space_prices" DROP CONSTRAINT "FK_5a022da3fd0651a1e6127407108"`,
    );
    await queryRunner.query(
      `ALTER TABLE "otp_verifications" DROP CONSTRAINT "FK_c7f1d281e1acc51e2a37889f5a9"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1cf664021f00b9cc1ff95e17de"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e4435209df12bc1f001e536017"`,
    );
    await queryRunner.query(`DROP TABLE "users_roles"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_12725c60b6e328ce52061f958c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_52aa3f633512f7a025e288ba8e"`,
    );
    await queryRunner.query(`DROP TABLE "venue_amenities"`);
    await queryRunner.query(`DROP TABLE "payments"`);
    await queryRunner.query(`DROP TYPE "public"."payments_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."payments_method_enum"`);
    await queryRunner.query(`DROP TABLE "notifications"`);
    await queryRunner.query(`DROP TYPE "public"."notifications_type_enum"`);
    await queryRunner.query(`DROP TABLE "conversations"`);
    await queryRunner.query(`DROP TABLE "messages"`);
    await queryRunner.query(`DROP TABLE "bookings"`);
    await queryRunner.query(`DROP TYPE "public"."bookings_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."bookings_price_unit_enum"`);
    await queryRunner.query(`DROP TABLE "refresh_tokens"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
    await queryRunner.query(`DROP TABLE "user_identity_verifications"`);
    await queryRunner.query(
      `DROP TYPE "public"."user_identity_verifications_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "venues"`);
    await queryRunner.query(`DROP TYPE "public"."venues_status_enum"`);
    await queryRunner.query(`DROP TABLE "venue_business_verifications"`);
    await queryRunner.query(
      `DROP TYPE "public"."venue_business_verifications_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "spaces"`);
    await queryRunner.query(`DROP TYPE "public"."spaces_type_enum"`);
    await queryRunner.query(`DROP TABLE "space_prices"`);
    await queryRunner.query(`DROP TYPE "public"."space_prices_unit_enum"`);
    await queryRunner.query(`DROP TABLE "amenities"`);
    await queryRunner.query(`DROP TABLE "otp_verifications"`);
    await queryRunner.query(
      `DROP TYPE "public"."otp_verifications_purpose_enum"`,
    );
    await queryRunner.query(`DROP TABLE "roles"`);
  }
}
