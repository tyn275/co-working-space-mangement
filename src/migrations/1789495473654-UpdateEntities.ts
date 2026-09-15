import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEntities1789495473654 implements MigrationInterface {
    name = 'UpdateEntities1789495473654'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "no_overlap"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "no_overlap" EXCLUDE USING gist (space_id WITH =, tsrange(start_time, end_time) WITH &&) WHERE ((status = ANY (ARRAY['pending_payment'::bookings_status_enum, 'confirmed'::bookings_status_enum])))`);
    }

}
