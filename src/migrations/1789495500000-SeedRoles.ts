import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedRoles1789495500000 implements MigrationInterface {
  name = 'SeedRoles1789495500000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "roles" ("name")
      SELECT r.name FROM (
        VALUES ('superadmin'), ('admin'), ('host'), ('user')
      ) AS r(name)
      WHERE NOT EXISTS (
        SELECT 1 FROM "roles" WHERE "roles"."name" = r.name
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "roles" WHERE "name" IN ('superadmin', 'admin', 'host', 'user');
    `);
  }
}
