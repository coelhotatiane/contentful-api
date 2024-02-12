import { MigrationInterface, QueryRunner } from 'typeorm';

export class SoftDeleteItem1707750556420 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE public.item
            ADD deleted_at timestamp with time zone NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE public.item
            DROP COLUMN deleted_at;
    `);
  }
}
