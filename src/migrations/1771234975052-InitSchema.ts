import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1771234975052 implements MigrationInterface {
    name = 'InitSchema1771234975052'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" ALTER COLUMN "status" SET DEFAULT 'paid'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" ALTER COLUMN "status" DROP DEFAULT`);
    }

}
