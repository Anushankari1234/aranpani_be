import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1771400143436 implements MigrationInterface {
  name = 'Init1771400143436';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "group_members" ("id" SERIAL NOT NULL, "memberName" character varying(150) NOT NULL, "group_donor_id" integer, CONSTRAINT "PK_86446139b2c96bfd0f3b8638852" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."payments_mode_enum" AS ENUM('paid to rep', 'online')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."payments_status_enum" AS ENUM('paid', 'paid by rep', 'pending', 'pending with rep', 'not paid')`,
    );
    await queryRunner.query(
      `CREATE TABLE "payments" ("id" SERIAL NOT NULL, "paymentDate" date NOT NULL, "mode" "public"."payments_mode_enum" NOT NULL, "transactionId" character varying(150) NOT NULL, "donationScript" json NOT NULL, "amount" numeric(12,2) NOT NULL, "status" "public"."payments_status_enum" NOT NULL DEFAULT 'paid', "monthYear" character varying(7) NOT NULL, "donor_id" integer, "project_subscription_id" integer, CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."projects_status_enum" AS ENUM('proposed', 'planned', 'active', 'completed', 'scrapped')`,
    );
    await queryRunner.query(
      `CREATE TABLE "projects" ("id" SERIAL NOT NULL, "regNum" character varying(50) NOT NULL, "templeName" character varying(150) NOT NULL, "inchargeName" character varying(150), "status" "public"."projects_status_enum" NOT NULL, "location" text, "contactNumber" character varying(20), "planStartDate" date, "planEndDate" date, "estimatedAmount" numeric(14,2), "expensedAmount" numeric(14,2) NOT NULL DEFAULT '0', "completionPercent" integer, "scrapReason" text, CONSTRAINT "UQ_cca170dbbc186c3e3de9ea2e107" UNIQUE ("regNum"), CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."project_donations_paymentmode_enum" AS ENUM('paid to rep', 'online')`,
    );
    await queryRunner.query(
      `CREATE TABLE "project_donations" ("id" SERIAL NOT NULL, "donorName" character varying(150), "phoneNumber" character varying(20) NOT NULL, "email" character varying(150), "address" text, "amount" numeric(12,2) NOT NULL, "paymentMode" "public"."project_donations_paymentmode_enum" NOT NULL, "transactionId" character varying(150), "otpVerified" boolean NOT NULL DEFAULT false, "donationDate" date NOT NULL, "project_id" integer, "donor_id" integer, CONSTRAINT "PK_6f730054329704af8c1ab45c357" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."donors_usertype_enum" AS ENUM('individual', 'grouped', 'area_rep')`,
    );
    await queryRunner.query(
      `CREATE TABLE "donors" ("id" SERIAL NOT NULL, "regNum" character varying(50) NOT NULL, "name" character varying(150) NOT NULL, "phoneNumber" character varying(20) NOT NULL, "email" character varying(150) NOT NULL, "fatherOrHusbandName" character varying(150), "address" text, "country" character varying(100), "state" character varying(100), "district" character varying(100), "pincode" character varying(20), "joinedDate" date NOT NULL, "userType" "public"."donors_usertype_enum" NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "rep_id" integer, CONSTRAINT "UQ_d089055ec86d4a4f79bd61bd036" UNIQUE ("regNum"), CONSTRAINT "UQ_140890d52775c98111ec098480d" UNIQUE ("phoneNumber"), CONSTRAINT "UQ_9243641c431b745a6fc60d68560" UNIQUE ("email"), CONSTRAINT "PK_7fafae759bcc8cc1dfa09c3fbcf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "project_subscriptions" ("id" SERIAL NOT NULL, "startDate" date NOT NULL, "status" character varying(50) NOT NULL DEFAULT 'active', "donor_id" integer, "project_id" integer, "plan_id" integer, CONSTRAINT "REL_1a41eda615b1ecf4b03efdfefd" UNIQUE ("donor_id"), CONSTRAINT "PK_d747b24a39541854e8bd6c83c31" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."subscription_plans_scheme_enum" AS ENUM('monthly', 'quarterly', 'half yearly', 'yearly')`,
    );
    await queryRunner.query(
      `CREATE TABLE "subscription_plans" ("id" SERIAL NOT NULL, "scheme" "public"."subscription_plans_scheme_enum" NOT NULL, "amountPerPerson" numeric(12,2) NOT NULL, "periodInMonths" integer NOT NULL, "totalSubscribers" integer NOT NULL DEFAULT '0', CONSTRAINT "UQ_109085c8997585dfc2f04342fd2" UNIQUE ("scheme"), CONSTRAINT "PK_9ab8fe6918451ab3d0a4fb6bb0c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_members" ADD CONSTRAINT "FK_7a36b574e228d0def3ee6167523" FOREIGN KEY ("group_donor_id") REFERENCES "donors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD CONSTRAINT "FK_dbcc3c75f538ab209b1ddd5fec8" FOREIGN KEY ("donor_id") REFERENCES "donors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD CONSTRAINT "FK_7e30a3467486c266892fda5e19a" FOREIGN KEY ("project_subscription_id") REFERENCES "project_subscriptions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_donations" ADD CONSTRAINT "FK_82a278f41568fae0c76fc30aa93" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_donations" ADD CONSTRAINT "FK_964f6b8eeeb4e33eb4a45a5aafb" FOREIGN KEY ("donor_id") REFERENCES "donors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "donors" ADD CONSTRAINT "FK_9727b4f1aa0dda14365ce10e616" FOREIGN KEY ("rep_id") REFERENCES "donors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_subscriptions" ADD CONSTRAINT "FK_1a41eda615b1ecf4b03efdfefd1" FOREIGN KEY ("donor_id") REFERENCES "donors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_subscriptions" ADD CONSTRAINT "FK_cbe7b773a82bd0d44a0a6302a78" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_subscriptions" ADD CONSTRAINT "FK_3ccbc0cfc17da8b51ebd50b02f2" FOREIGN KEY ("plan_id") REFERENCES "subscription_plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_subscriptions" DROP CONSTRAINT "FK_3ccbc0cfc17da8b51ebd50b02f2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_subscriptions" DROP CONSTRAINT "FK_cbe7b773a82bd0d44a0a6302a78"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_subscriptions" DROP CONSTRAINT "FK_1a41eda615b1ecf4b03efdfefd1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "donors" DROP CONSTRAINT "FK_9727b4f1aa0dda14365ce10e616"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_donations" DROP CONSTRAINT "FK_964f6b8eeeb4e33eb4a45a5aafb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_donations" DROP CONSTRAINT "FK_82a278f41568fae0c76fc30aa93"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" DROP CONSTRAINT "FK_7e30a3467486c266892fda5e19a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" DROP CONSTRAINT "FK_dbcc3c75f538ab209b1ddd5fec8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_members" DROP CONSTRAINT "FK_7a36b574e228d0def3ee6167523"`,
    );
    await queryRunner.query(`DROP TABLE "subscription_plans"`);
    await queryRunner.query(`DROP TYPE "public"."subscription_plans_scheme_enum"`);
    await queryRunner.query(`DROP TABLE "project_subscriptions"`);
    await queryRunner.query(`DROP TABLE "donors"`);
    await queryRunner.query(`DROP TYPE "public"."donors_usertype_enum"`);
    await queryRunner.query(`DROP TABLE "project_donations"`);
    await queryRunner.query(`DROP TYPE "public"."project_donations_paymentmode_enum"`);
    await queryRunner.query(`DROP TABLE "projects"`);
    await queryRunner.query(`DROP TYPE "public"."projects_status_enum"`);
    await queryRunner.query(`DROP TABLE "payments"`);
    await queryRunner.query(`DROP TYPE "public"."payments_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."payments_mode_enum"`);
    await queryRunner.query(`DROP TABLE "group_members"`);
  }
}
