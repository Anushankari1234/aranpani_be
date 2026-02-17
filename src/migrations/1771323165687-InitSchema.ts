import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1771323165687 implements MigrationInterface {
    name = 'InitSchema1771323165687'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" ALTER COLUMN "transactionId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payments" ALTER COLUMN "donationScript" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" ALTER COLUMN "donationScript" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payments" ALTER COLUMN "transactionId" DROP NOT NULL`);
    }

}
