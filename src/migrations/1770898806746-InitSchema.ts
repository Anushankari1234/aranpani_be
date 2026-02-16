import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1770898806746 implements MigrationInterface {
    name = 'InitSchema1770898806746'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group_members" DROP CONSTRAINT "FK_4785edfd3a9cf9293fe533de1ef"`);
        await queryRunner.query(`ALTER TABLE "group_members" RENAME COLUMN "group_leader_id" TO "group_donor_id"`);
        await queryRunner.query(`ALTER TABLE "donors" ALTER COLUMN "email" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "donors" ADD CONSTRAINT "UQ_9243641c431b745a6fc60d68560" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "project_subscriptions" DROP CONSTRAINT "FK_1a41eda615b1ecf4b03efdfefd1"`);
        await queryRunner.query(`ALTER TABLE "project_subscriptions" ADD CONSTRAINT "UQ_1a41eda615b1ecf4b03efdfefd1" UNIQUE ("donor_id")`);
        await queryRunner.query(`ALTER TABLE "group_members" ADD CONSTRAINT "FK_7a36b574e228d0def3ee6167523" FOREIGN KEY ("group_donor_id") REFERENCES "donors"("regNum") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_subscriptions" ADD CONSTRAINT "FK_1a41eda615b1ecf4b03efdfefd1" FOREIGN KEY ("donor_id") REFERENCES "donors"("regNum") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_subscriptions" DROP CONSTRAINT "FK_1a41eda615b1ecf4b03efdfefd1"`);
        await queryRunner.query(`ALTER TABLE "group_members" DROP CONSTRAINT "FK_7a36b574e228d0def3ee6167523"`);
        await queryRunner.query(`ALTER TABLE "project_subscriptions" DROP CONSTRAINT "UQ_1a41eda615b1ecf4b03efdfefd1"`);
        await queryRunner.query(`ALTER TABLE "project_subscriptions" ADD CONSTRAINT "FK_1a41eda615b1ecf4b03efdfefd1" FOREIGN KEY ("donor_id") REFERENCES "donors"("regNum") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "donors" DROP CONSTRAINT "UQ_9243641c431b745a6fc60d68560"`);
        await queryRunner.query(`ALTER TABLE "donors" ALTER COLUMN "email" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "group_members" RENAME COLUMN "group_donor_id" TO "group_leader_id"`);
        await queryRunner.query(`ALTER TABLE "group_members" ADD CONSTRAINT "FK_4785edfd3a9cf9293fe533de1ef" FOREIGN KEY ("group_leader_id") REFERENCES "donors"("regNum") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
