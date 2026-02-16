import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1770879952857 implements MigrationInterface {
    name = 'InitSchema1770879952857'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "project" ("reg_number" character varying NOT NULL, "temple_name" character varying NOT NULL, "project_name" character varying NOT NULL, "description" character varying NOT NULL, "location" character varying NOT NULL, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "temple_incharge_name" character varying NOT NULL, "status" character varying NOT NULL, "image" character varying NOT NULL, "documents" character varying NOT NULL, CONSTRAINT "PK_47e21792683c1c2ad3360f550aa" PRIMARY KEY ("reg_number"))`);
        await queryRunner.query(`CREATE TABLE "donor" ("reg_number" character varying NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying NOT NULL, "address" character varying NOT NULL, "city" character varying NOT NULL, "district" character varying NOT NULL, "state" character varying NOT NULL, "country" character varying NOT NULL, "pincode" character varying NOT NULL, "father_or_husband_name" character varying NOT NULL, CONSTRAINT "PK_ecb3588eca690606876bf2fe631" PRIMARY KEY ("reg_number"))`);
        await queryRunner.query(`CREATE TABLE "area_representative" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "reg_number" character varying NOT NULL, "district" character varying NOT NULL, "pincode" character varying NOT NULL, CONSTRAINT "PK_659bacc92d0d92adc1dd0c819c9" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "area_representative"`);
        await queryRunner.query(`DROP TABLE "donor"`);
        await queryRunner.query(`DROP TABLE "project"`);
    }

}
