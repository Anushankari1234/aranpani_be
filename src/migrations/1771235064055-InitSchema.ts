import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1771235064055 implements MigrationInterface {
    name = 'InitSchema1771235064055'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "donationScript"`);
        await queryRunner.query(`ALTER TABLE "payments" ADD "donationScript" json`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "donationScript"`);
        await queryRunner.query(`ALTER TABLE "payments" ADD "donationScript" text`);
    }

}
