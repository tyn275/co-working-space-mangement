import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateI18nJsonbColumns1789300584720 implements MigrationInterface {
  name = 'UpdateI18nJsonbColumns1789300584720';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bookings" DROP CONSTRAINT "no_overlap"`,
    );
    await queryRunner.query(
      `ALTER TABLE "amenities" ADD "code" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "amenities" ADD CONSTRAINT "UQ_cc57a712a97e0cc442a9fbdf2e8" UNIQUE ("code")`,
    );
    await queryRunner.query(
      `ALTER TABLE "amenities" DROP CONSTRAINT "UQ_8c5f9c7ff7e2174b53d4be10247"`,
    );
    await queryRunner.query(`ALTER TABLE "amenities" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "amenities" ADD "name" jsonb NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "spaces" DROP COLUMN "description"`);
    await queryRunner.query(`ALTER TABLE "spaces" ADD "description" jsonb`);
    await queryRunner.query(`ALTER TABLE "venues" DROP COLUMN "description"`);
    await queryRunner.query(`ALTER TABLE "venues" ADD "description" jsonb`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "venues" DROP COLUMN "description"`);
    await queryRunner.query(`ALTER TABLE "venues" ADD "description" text`);
    await queryRunner.query(`ALTER TABLE "spaces" DROP COLUMN "description"`);
    await queryRunner.query(`ALTER TABLE "spaces" ADD "description" text`);
    await queryRunner.query(`ALTER TABLE "amenities" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "amenities" ADD "name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "amenities" ADD CONSTRAINT "UQ_8c5f9c7ff7e2174b53d4be10247" UNIQUE ("name")`,
    );
    await queryRunner.query(
      `ALTER TABLE "amenities" DROP CONSTRAINT "UQ_cc57a712a97e0cc442a9fbdf2e8"`,
    );
    await queryRunner.query(`ALTER TABLE "amenities" DROP COLUMN "code"`);
  }
}
