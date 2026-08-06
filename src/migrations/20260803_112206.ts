import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_site_settings_bank_details_accounts_account_type" AS ENUM('current', 'savings');
  CREATE TABLE "site_settings_bank_details_accounts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"bank_logo_id" integer,
  	"bank_name" varchar NOT NULL,
  	"beneficiary_account_name" varchar DEFAULT 'ODH FOUNDATION' NOT NULL,
  	"account_number" varchar NOT NULL,
  	"account_type" "enum_site_settings_bank_details_accounts_account_type" DEFAULT 'current' NOT NULL,
  	"ifsc_code" varchar NOT NULL
  );
  
  ALTER TABLE "site_settings_contact_donation_info_bank_accounts" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "site_settings_contact_donation_info_bank_accounts" CASCADE;
  ALTER TABLE "site_settings" ADD COLUMN "bank_details_heading" varchar DEFAULT 'Bank Details';
  ALTER TABLE "site_settings" ADD COLUMN "bank_details_sub_heading" varchar DEFAULT 'Direct Bank Transfer through Net Banking, QR Code or Cheque';
  ALTER TABLE "site_settings" ADD COLUMN "bank_details_qr_heading" varchar DEFAULT 'Scan QR Code to Donate';
  ALTER TABLE "site_settings" ADD COLUMN "bank_details_qr_qr_image_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "bank_details_qr_organization_name" varchar DEFAULT 'ODH FOUNDATION';
  ALTER TABLE "site_settings" ADD COLUMN "bank_details_qr_instructions" varchar DEFAULT 'In case you have donated directly through Bank Transfer, QR Code or Cheque, kindly WhatsApp your details such as Name, Full address, Pan and Aadhar for Tax Exemption receipt on +91-9795505106 Or Email us on contactus@odhfoundation.org';
  ALTER TABLE "site_settings_bank_details_accounts" ADD CONSTRAINT "site_settings_bank_details_accounts_bank_logo_id_graphics_id_fk" FOREIGN KEY ("bank_logo_id") REFERENCES "public"."graphics"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_bank_details_accounts" ADD CONSTRAINT "site_settings_bank_details_accounts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "site_settings_bank_details_accounts_order_idx" ON "site_settings_bank_details_accounts" USING btree ("_order");
  CREATE INDEX "site_settings_bank_details_accounts_parent_id_idx" ON "site_settings_bank_details_accounts" USING btree ("_parent_id");
  CREATE INDEX "site_settings_bank_details_accounts_bank_logo_idx" ON "site_settings_bank_details_accounts" USING btree ("bank_logo_id");
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_bank_details_qr_qr_image_id_graphics_id_fk" FOREIGN KEY ("bank_details_qr_qr_image_id") REFERENCES "public"."graphics"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "site_settings_bank_details_qr_bank_details_qr_qr_image_idx" ON "site_settings" USING btree ("bank_details_qr_qr_image_id");
  ALTER TABLE "site_settings" DROP COLUMN "contact_donation_info_heading";
  ALTER TABLE "site_settings" DROP COLUMN "contact_donation_info_sub_heading";
  ALTER TABLE "site_settings" DROP COLUMN "contact_donation_info_qr_heading";
  ALTER TABLE "site_settings" DROP COLUMN "contact_donation_info_qr_caption";
  ALTER TABLE "site_settings" DROP COLUMN "contact_donation_info_donation_note";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "site_settings_contact_donation_info_bank_accounts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"bank_logo_id" integer NOT NULL,
  	"beneficiary_name" varchar NOT NULL,
  	"account_number" varchar NOT NULL,
  	"account_type" varchar DEFAULT 'Current Account',
  	"ifsc_code" varchar NOT NULL
  );
  
  ALTER TABLE "site_settings_bank_details_accounts" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "site_settings_bank_details_accounts" CASCADE;
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_bank_details_qr_qr_image_id_graphics_id_fk";
  
  DROP INDEX "site_settings_bank_details_qr_bank_details_qr_qr_image_idx";
  ALTER TABLE "site_settings" ADD COLUMN "contact_donation_info_heading" varchar DEFAULT 'Bank Details';
  ALTER TABLE "site_settings" ADD COLUMN "contact_donation_info_sub_heading" varchar DEFAULT 'Direct Bank Transfer through Net Banking, QR Code or Cheque';
  ALTER TABLE "site_settings" ADD COLUMN "contact_donation_info_qr_heading" varchar DEFAULT 'Scan QR Code to Donate';
  ALTER TABLE "site_settings" ADD COLUMN "contact_donation_info_qr_caption" varchar DEFAULT 'ODH FOUNDATION';
  ALTER TABLE "site_settings" ADD COLUMN "contact_donation_info_donation_note" jsonb;
  ALTER TABLE "site_settings_contact_donation_info_bank_accounts" ADD CONSTRAINT "site_settings_contact_donation_info_bank_accounts_bank_logo_id_graphics_id_fk" FOREIGN KEY ("bank_logo_id") REFERENCES "public"."graphics"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_contact_donation_info_bank_accounts" ADD CONSTRAINT "site_settings_contact_donation_info_bank_accounts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "site_settings_contact_donation_info_bank_accounts_order_idx" ON "site_settings_contact_donation_info_bank_accounts" USING btree ("_order");
  CREATE INDEX "site_settings_contact_donation_info_bank_accounts_parent_id_idx" ON "site_settings_contact_donation_info_bank_accounts" USING btree ("_parent_id");
  CREATE INDEX "site_settings_contact_donation_info_bank_accounts_bank_l_idx" ON "site_settings_contact_donation_info_bank_accounts" USING btree ("bank_logo_id");
  ALTER TABLE "site_settings" DROP COLUMN "bank_details_heading";
  ALTER TABLE "site_settings" DROP COLUMN "bank_details_sub_heading";
  ALTER TABLE "site_settings" DROP COLUMN "bank_details_qr_heading";
  ALTER TABLE "site_settings" DROP COLUMN "bank_details_qr_qr_image_id";
  ALTER TABLE "site_settings" DROP COLUMN "bank_details_qr_organization_name";
  ALTER TABLE "site_settings" DROP COLUMN "bank_details_qr_instructions";
  DROP TYPE "public"."enum_site_settings_bank_details_accounts_account_type";`)
}
