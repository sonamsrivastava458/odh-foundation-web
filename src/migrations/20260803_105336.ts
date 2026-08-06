import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_roles" AS ENUM('super-admin', 'editor', 'finance');
  CREATE TYPE "public"."enum_pages_blocks_category_grid_columns" AS ENUM('3', '4');
  CREATE TYPE "public"."enum_pages_blocks_featured_campaigns_mode" AS ENUM('auto', 'manual');
  CREATE TYPE "public"."enum_pages_blocks_featured_projects_mode" AS ENUM('auto', 'manual');
  CREATE TYPE "public"."enum_pages_blocks_testimonial_carousel_mode" AS ENUM('auto', 'manual');
  CREATE TYPE "public"."enum_pages_blocks_media_grid_filter_by_type" AS ENUM('news', 'press', 'blog', 'gallery', 'video');
  CREATE TYPE "public"."enum_pages_blocks_form_block_fields_type" AS ENUM('text', 'email', 'tel', 'textarea', 'select', 'date', 'file');
  CREATE TYPE "public"."enum_pages_blocks_form_block_fields_width" AS ENUM('full', 'half');
  CREATE TYPE "public"."enum_pages_blocks_form_block_form_type" AS ENUM('contact', 'volunteer', 'csr', 'career', 'newsletter');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_blocks_category_grid_columns" AS ENUM('3', '4');
  CREATE TYPE "public"."enum__pages_v_blocks_featured_campaigns_mode" AS ENUM('auto', 'manual');
  CREATE TYPE "public"."enum__pages_v_blocks_featured_projects_mode" AS ENUM('auto', 'manual');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonial_carousel_mode" AS ENUM('auto', 'manual');
  CREATE TYPE "public"."enum__pages_v_blocks_media_grid_filter_by_type" AS ENUM('news', 'press', 'blog', 'gallery', 'video');
  CREATE TYPE "public"."enum__pages_v_blocks_form_block_fields_type" AS ENUM('text', 'email', 'tel', 'textarea', 'select', 'date', 'file');
  CREATE TYPE "public"."enum__pages_v_blocks_form_block_fields_width" AS ENUM('full', 'half');
  CREATE TYPE "public"."enum__pages_v_blocks_form_block_form_type" AS ENUM('contact', 'volunteer', 'csr', 'career', 'newsletter');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_project_categories_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__project_categories_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_projects_project_status" AS ENUM('ongoing', 'completed');
  CREATE TYPE "public"."enum_projects_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__projects_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_team_members_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__team_members_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_testimonials_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__testimonials_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_campaigns_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__campaigns_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_media_posts_type" AS ENUM('news', 'press', 'blog', 'gallery', 'video');
  CREATE TYPE "public"."enum_media_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__media_posts_v_version_type" AS ENUM('news', 'press', 'blog', 'gallery', 'video');
  CREATE TYPE "public"."enum__media_posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_careers_type" AS ENUM('full-time', 'part-time', 'volunteer', 'intern');
  CREATE TYPE "public"."enum_careers_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__careers_v_version_type" AS ENUM('full-time', 'part-time', 'volunteer', 'intern');
  CREATE TYPE "public"."enum__careers_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_donations_currency" AS ENUM('INR');
  CREATE TYPE "public"."enum_donations_frequency" AS ENUM('one-time', 'monthly');
  CREATE TYPE "public"."enum_donations_gateway" AS ENUM('payu', 'razorpay', 'upi-manual');
  CREATE TYPE "public"."enum_donations_internal_status" AS ENUM('initiated', 'success', 'failed', 'refunded', 'cancelled');
  CREATE TYPE "public"."enum_subscriptions_status" AS ENUM('active', 'paused', 'cancelled', 'failed');
  CREATE TYPE "public"."enum_form_submissions_form_type" AS ENUM('contact', 'volunteer', 'csr', 'career', 'newsletter');
  CREATE TYPE "public"."enum_form_submissions_status" AS ENUM('new', 'read', 'archived');
  CREATE TYPE "public"."enum_redirects_type" AS ENUM('301', '302');
  CREATE TYPE "public"."enum_site_settings_social_links_platform" AS ENUM('facebook', 'instagram', 'linkedin', 'x', 'youtube', 'whatsapp');
  CREATE TYPE "public"."enum_site_settings_top_header_items_type" AS ENUM('email', 'pan', '80g', 'csr1', 'careers', 'login', 'custom');
  CREATE TYPE "public"."enum_navigation_header_items_style" AS ENUM('link', 'dropdown');
  CREATE TYPE "public"."enum_donation_settings_gateway_mode" AS ENUM('test', 'live');
  CREATE TYPE "public"."enum_donation_settings_gateway" AS ENUM('payu', 'razorpay');
  CREATE TABLE "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumb_url" varchar,
  	"sizes_thumb_width" numeric,
  	"sizes_thumb_height" numeric,
  	"sizes_thumb_mime_type" varchar,
  	"sizes_thumb_filesize" numeric,
  	"sizes_thumb_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_feature_url" varchar,
  	"sizes_feature_width" numeric,
  	"sizes_feature_height" numeric,
  	"sizes_feature_mime_type" varchar,
  	"sizes_feature_filesize" numeric,
  	"sizes_feature_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "graphics" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "pages_blocks_hero_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"highlight_text" varchar,
  	"description" varchar,
  	"background_image_id" integer,
  	"button_label" varchar DEFAULT 'Donate Now',
  	"button_href" varchar DEFAULT '/donate'
  );
  
  CREATE TABLE "pages_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_page_header_crumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "pages_blocks_page_header" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_stats_bar_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" numeric,
  	"suffix" varchar
  );
  
  CREATE TABLE "pages_blocks_stats_bar" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_about_strip_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_about_strip" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"image_id" integer,
  	"link_label" varchar DEFAULT 'Read our story',
  	"link_href" varchar DEFAULT '/about',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_category_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Our Focus Areas',
  	"subheading" varchar,
  	"columns" "enum_pages_blocks_category_grid_columns" DEFAULT '4',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_featured_campaigns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Our Campaigns',
  	"subheading" varchar,
  	"mode" "enum_pages_blocks_featured_campaigns_mode" DEFAULT 'auto',
  	"limit" numeric DEFAULT 3,
  	"cta_label" varchar DEFAULT 'See all campaigns',
  	"cta_href" varchar DEFAULT '/campaigns',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_featured_projects" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Our Work',
  	"subheading" varchar,
  	"mode" "enum_pages_blocks_featured_projects_mode" DEFAULT 'auto',
  	"limit" numeric DEFAULT 3,
  	"cta_label" varchar DEFAULT 'View all projects',
  	"cta_href" varchar DEFAULT '/projects',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_how_you_can_help_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"icon_id" integer
  );
  
  CREATE TABLE "pages_blocks_how_you_can_help" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'How you can help',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_testimonial_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Voices from the field',
  	"mode" "enum_pages_blocks_testimonial_carousel_mode" DEFAULT 'auto',
  	"limit" numeric DEFAULT 3,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_media_grid_filter_by_type" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_pages_blocks_media_grid_filter_by_type",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_media_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'News & Updates',
  	"subheading" varchar,
  	"limit" numeric DEFAULT 3,
  	"cta_label" varchar DEFAULT 'All updates',
  	"cta_href" varchar DEFAULT '/media',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_trust_strip_badges" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"note" varchar
  );
  
  CREATE TABLE "pages_blocks_trust_strip_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"logo_id" integer,
  	"url" varchar
  );
  
  CREATE TABLE "pages_blocks_trust_strip" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta_band_trust_badges" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_cta_band" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"subheading" varchar,
  	"cta_label" varchar DEFAULT 'Donate Now',
  	"cta_href" varchar DEFAULT '/donate',
  	"secondary_cta_label" varchar,
  	"secondary_cta_href" varchar,
  	"qr_image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"content" jsonb,
  	"show_button" boolean DEFAULT false,
  	"button_label" varchar DEFAULT 'Click Here For More Information',
  	"button_page_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_team_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Our Team',
  	"subheading" varchar,
  	"show_founders_first" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_timeline_milestones" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"year" varchar,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Our Journey',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_accordion_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" jsonb,
  	"default_open" boolean DEFAULT false
  );
  
  CREATE TABLE "pages_blocks_faq_accordion" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Frequently Asked Questions',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_form_block_fields_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "pages_blocks_form_block_fields" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"label" varchar,
  	"type" "enum_pages_blocks_form_block_fields_type" DEFAULT 'text',
  	"accept" varchar DEFAULT 'image/*',
  	"max_file_size_m_b" numeric DEFAULT 5,
  	"required" boolean DEFAULT false,
  	"placeholder" varchar,
  	"help_text" varchar,
  	"default_value" varchar,
  	"width" "enum_pages_blocks_form_block_fields_width" DEFAULT 'full',
  	"rows" numeric DEFAULT 4,
  	"min_length" numeric,
  	"max_length" numeric
  );
  
  CREATE TABLE "pages_blocks_form_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"subheading" varchar,
  	"form_type" "enum_pages_blocks_form_block_form_type",
  	"submit_label" varchar DEFAULT 'Submit',
  	"show_reset_button" boolean DEFAULT false,
  	"reset_label" varchar DEFAULT 'Reset',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_image_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar
  );
  
  CREATE TABLE "pages_blocks_image_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Our Gallery',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_video_embed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"video_url" varchar,
  	"caption" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_map_contact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"map_image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_feature_cards_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_feature_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"subheading" varchar,
  	"download_cta_label" varchar,
  	"download_cta_file_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_home_intro_section_featured_project_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "pages_blocks_home_intro_section_get_involved_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "pages_blocks_home_intro_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"about_title" varchar DEFAULT 'About ODH Foundation',
  	"about_description" varchar,
  	"about_button_label" varchar DEFAULT 'Learn More',
  	"about_button_href" varchar DEFAULT '/about',
  	"featured_project_title" varchar DEFAULT 'Featured Project',
  	"get_involved_heading" varchar DEFAULT 'Get Involved',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_why_o_d_h_foundation_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_why_o_d_h_foundation" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Why ODH Foundation',
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_our_causes_causes" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar,
  	"description" varchar,
  	"button_label" varchar DEFAULT 'Donate',
  	"button_href" varchar DEFAULT '/donate'
  );
  
  CREATE TABLE "pages_blocks_our_causes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Our Causes',
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_volunteer_c_t_a" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"background_image_id" integer,
  	"foreground_image_id" integer,
  	"heading" varchar DEFAULT 'Become a Volunteer',
  	"description" varchar,
  	"button_label" varchar DEFAULT 'Join Us',
  	"button_href" varchar DEFAULT '/volunteer',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_about_intro_section_slider_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "pages_blocks_about_intro_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"left_heading" varchar,
  	"right_heading" varchar,
  	"description" jsonb,
  	"button_label" varchar DEFAULT 'Contact Us',
  	"button_href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_vision_mission" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"vision_heading" varchar DEFAULT 'Our Vision',
  	"vision_description" varchar,
  	"mission_heading" varchar DEFAULT 'Our Mission',
  	"mission_description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_finalctabanner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"background_image_id" integer,
  	"heading" varchar,
  	"button_label" varchar DEFAULT 'Donate',
  	"button_href" varchar DEFAULT '/donate',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_events_and_causes_section_events" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar,
  	"date" varchar,
  	"location" varchar,
  	"read_more_label" varchar DEFAULT 'Read More',
  	"read_more_link_id" integer
  );
  
  CREATE TABLE "pages_blocks_events_and_causes_section_causes" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar,
  	"button_label" varchar DEFAULT 'Donate',
  	"button_href" varchar DEFAULT '/donate'
  );
  
  CREATE TABLE "pages_blocks_events_and_causes_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"events_heading" varchar DEFAULT 'Upcoming Events',
  	"causes_heading" varchar DEFAULT 'Latest Causes',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_contact_information" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_contact_c_t_a" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"background_image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_image_id" integer,
  	"seo_canonical_url" varchar,
  	"seo_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"campaigns_id" integer,
  	"projects_id" integer,
  	"testimonials_id" integer
  );
  
  CREATE TABLE "_pages_v_blocks_hero_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"highlight_text" varchar,
  	"description" varchar,
  	"background_image_id" integer,
  	"button_label" varchar DEFAULT 'Donate Now',
  	"button_href" varchar DEFAULT '/donate',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_page_header_crumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_page_header" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stats_bar_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" numeric,
  	"suffix" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stats_bar" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_about_strip_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_about_strip" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"image_id" integer,
  	"link_label" varchar DEFAULT 'Read our story',
  	"link_href" varchar DEFAULT '/about',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_category_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Our Focus Areas',
  	"subheading" varchar,
  	"columns" "enum__pages_v_blocks_category_grid_columns" DEFAULT '4',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_featured_campaigns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Our Campaigns',
  	"subheading" varchar,
  	"mode" "enum__pages_v_blocks_featured_campaigns_mode" DEFAULT 'auto',
  	"limit" numeric DEFAULT 3,
  	"cta_label" varchar DEFAULT 'See all campaigns',
  	"cta_href" varchar DEFAULT '/campaigns',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_featured_projects" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Our Work',
  	"subheading" varchar,
  	"mode" "enum__pages_v_blocks_featured_projects_mode" DEFAULT 'auto',
  	"limit" numeric DEFAULT 3,
  	"cta_label" varchar DEFAULT 'View all projects',
  	"cta_href" varchar DEFAULT '/projects',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_how_you_can_help_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"icon_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_how_you_can_help" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'How you can help',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonial_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Voices from the field',
  	"mode" "enum__pages_v_blocks_testimonial_carousel_mode" DEFAULT 'auto',
  	"limit" numeric DEFAULT 3,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_media_grid_filter_by_type" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__pages_v_blocks_media_grid_filter_by_type",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_media_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'News & Updates',
  	"subheading" varchar,
  	"limit" numeric DEFAULT 3,
  	"cta_label" varchar DEFAULT 'All updates',
  	"cta_href" varchar DEFAULT '/media',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_trust_strip_badges" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"note" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_trust_strip_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"logo_id" integer,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_trust_strip" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_band_trust_badges" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_band" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"subheading" varchar,
  	"cta_label" varchar DEFAULT 'Donate Now',
  	"cta_href" varchar DEFAULT '/donate',
  	"secondary_cta_label" varchar,
  	"secondary_cta_href" varchar,
  	"qr_image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"content" jsonb,
  	"show_button" boolean DEFAULT false,
  	"button_label" varchar DEFAULT 'Click Here For More Information',
  	"button_page_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_team_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Our Team',
  	"subheading" varchar,
  	"show_founders_first" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_timeline_milestones" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"year" varchar,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Our Journey',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_accordion_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" jsonb,
  	"default_open" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_accordion" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Frequently Asked Questions',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_form_block_fields_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_form_block_fields" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"label" varchar,
  	"type" "enum__pages_v_blocks_form_block_fields_type" DEFAULT 'text',
  	"accept" varchar DEFAULT 'image/*',
  	"max_file_size_m_b" numeric DEFAULT 5,
  	"required" boolean DEFAULT false,
  	"placeholder" varchar,
  	"help_text" varchar,
  	"default_value" varchar,
  	"width" "enum__pages_v_blocks_form_block_fields_width" DEFAULT 'full',
  	"rows" numeric DEFAULT 4,
  	"min_length" numeric,
  	"max_length" numeric,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_form_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"subheading" varchar,
  	"form_type" "enum__pages_v_blocks_form_block_form_type",
  	"submit_label" varchar DEFAULT 'Submit',
  	"show_reset_button" boolean DEFAULT false,
  	"reset_label" varchar DEFAULT 'Reset',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_image_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_image_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Our Gallery',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_video_embed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"video_url" varchar,
  	"caption" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_map_contact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"map_image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_feature_cards_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_feature_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"subheading" varchar,
  	"download_cta_label" varchar,
  	"download_cta_file_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_home_intro_section_featured_project_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_home_intro_section_get_involved_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_home_intro_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"about_title" varchar DEFAULT 'About ODH Foundation',
  	"about_description" varchar,
  	"about_button_label" varchar DEFAULT 'Learn More',
  	"about_button_href" varchar DEFAULT '/about',
  	"featured_project_title" varchar DEFAULT 'Featured Project',
  	"get_involved_heading" varchar DEFAULT 'Get Involved',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_why_o_d_h_foundation_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_why_o_d_h_foundation" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Why ODH Foundation',
  	"description" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_our_causes_causes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar,
  	"description" varchar,
  	"button_label" varchar DEFAULT 'Donate',
  	"button_href" varchar DEFAULT '/donate',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_our_causes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Our Causes',
  	"description" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_volunteer_c_t_a" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"background_image_id" integer,
  	"foreground_image_id" integer,
  	"heading" varchar DEFAULT 'Become a Volunteer',
  	"description" varchar,
  	"button_label" varchar DEFAULT 'Join Us',
  	"button_href" varchar DEFAULT '/volunteer',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_about_intro_section_slider_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_about_intro_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"left_heading" varchar,
  	"right_heading" varchar,
  	"description" jsonb,
  	"button_label" varchar DEFAULT 'Contact Us',
  	"button_href" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_vision_mission" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"vision_heading" varchar DEFAULT 'Our Vision',
  	"vision_description" varchar,
  	"mission_heading" varchar DEFAULT 'Our Mission',
  	"mission_description" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_finalctabanner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"background_image_id" integer,
  	"heading" varchar,
  	"button_label" varchar DEFAULT 'Donate',
  	"button_href" varchar DEFAULT '/donate',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_events_and_causes_section_events" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar,
  	"date" varchar,
  	"location" varchar,
  	"read_more_label" varchar DEFAULT 'Read More',
  	"read_more_link_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_events_and_causes_section_causes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar,
  	"button_label" varchar DEFAULT 'Donate',
  	"button_href" varchar DEFAULT '/donate',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_events_and_causes_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"events_heading" varchar DEFAULT 'Upcoming Events',
  	"causes_heading" varchar DEFAULT 'Latest Causes',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_contact_information" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_contact_c_t_a" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"background_image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_og_image_id" integer,
  	"version_seo_canonical_url" varchar,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"campaigns_id" integer,
  	"projects_id" integer,
  	"testimonials_id" integer
  );
  
  CREATE TABLE "project_categories_crumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "project_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"slug" varchar,
  	"icon_id" integer,
  	"hero_image_id" integer,
  	"content" jsonb,
  	"donate_c_t_a_label" varchar DEFAULT 'Donate Now',
  	"donate_c_t_a_link" varchar DEFAULT '/donate',
  	"order" numeric DEFAULT 0,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_image_id" integer,
  	"seo_canonical_url" varchar,
  	"seo_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_project_categories_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_project_categories_v_version_crumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_project_categories_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_icon_id" integer,
  	"version_hero_image_id" integer,
  	"version_content" jsonb,
  	"version_donate_c_t_a_label" varchar DEFAULT 'Donate Now',
  	"version_donate_c_t_a_link" varchar DEFAULT '/donate',
  	"version_order" numeric DEFAULT 0,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_og_image_id" integer,
  	"version_seo_canonical_url" varchar,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__project_categories_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "projects_impact_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" numeric,
  	"suffix" varchar
  );
  
  CREATE TABLE "projects_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "projects_partners" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"logo_id" integer
  );
  
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"category_id" integer,
  	"status" "enum_projects_project_status" DEFAULT 'ongoing',
  	"location_city" varchar,
  	"location_district" varchar,
  	"location_state" varchar,
  	"hero_image_id" integer,
  	"excerpt" varchar,
  	"body" jsonb,
  	"raised_amount" numeric DEFAULT 0,
  	"beneficiaries" numeric,
  	"start_date" timestamp(3) with time zone,
  	"end_date" timestamp(3) with time zone,
  	"featured" boolean DEFAULT false,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_image_id" integer,
  	"seo_canonical_url" varchar,
  	"seo_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_projects_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_projects_v_version_impact_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" numeric,
  	"suffix" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_partners" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"logo_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_category_id" integer,
  	"version_status" "enum_projects_project_status" DEFAULT 'ongoing',
  	"version_location_city" varchar,
  	"version_location_district" varchar,
  	"version_location_state" varchar,
  	"version_hero_image_id" integer,
  	"version_excerpt" varchar,
  	"version_body" jsonb,
  	"version_raised_amount" numeric DEFAULT 0,
  	"version_beneficiaries" numeric,
  	"version_start_date" timestamp(3) with time zone,
  	"version_end_date" timestamp(3) with time zone,
  	"version_featured" boolean DEFAULT false,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_og_image_id" integer,
  	"version_seo_canonical_url" varchar,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__projects_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "team_members" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" varchar,
  	"photo_id" integer,
  	"bio" varchar,
  	"linkedin" varchar,
  	"is_founder" boolean DEFAULT false,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_team_members_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_team_members_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_role" varchar,
  	"version_photo_id" integer,
  	"version_bio" varchar,
  	"version_linkedin" varchar,
  	"version_is_founder" boolean DEFAULT false,
  	"version_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__team_members_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"name" varchar,
  	"role" varchar,
  	"photo_id" integer,
  	"related_project_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_testimonials_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_testimonials_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_quote" varchar,
  	"version_name" varchar,
  	"version_role" varchar,
  	"version_photo_id" integer,
  	"version_related_project_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__testimonials_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "campaigns_crumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "campaigns_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "campaigns_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "campaigns" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"hero_image_id" integer,
  	"excerpt" varchar,
  	"body" jsonb,
  	"goal_amount" numeric,
  	"raised_amount" numeric DEFAULT 0,
  	"show_progress" boolean DEFAULT false,
  	"donate_c_t_a_label" varchar DEFAULT 'Donate Now',
  	"donate_c_t_a_link" varchar DEFAULT '/donate',
  	"featured" boolean DEFAULT false,
  	"active" boolean DEFAULT true,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_image_id" integer,
  	"seo_canonical_url" varchar,
  	"seo_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_campaigns_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_campaigns_v_version_crumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_campaigns_v_version_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_campaigns_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_campaigns_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_hero_image_id" integer,
  	"version_excerpt" varchar,
  	"version_body" jsonb,
  	"version_goal_amount" numeric,
  	"version_raised_amount" numeric DEFAULT 0,
  	"version_show_progress" boolean DEFAULT false,
  	"version_donate_c_t_a_label" varchar DEFAULT 'Donate Now',
  	"version_donate_c_t_a_link" varchar DEFAULT '/donate',
  	"version_featured" boolean DEFAULT false,
  	"version_active" boolean DEFAULT true,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_og_image_id" integer,
  	"version_seo_canonical_url" varchar,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__campaigns_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "media_posts_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "media_posts_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar
  );
  
  CREATE TABLE "media_posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"type" "enum_media_posts_type" DEFAULT 'news',
  	"publish_date" timestamp(3) with time zone,
  	"author_id" integer,
  	"hero_image_id" integer,
  	"excerpt" varchar,
  	"body" jsonb,
  	"video_url" varchar,
  	"external_url" varchar,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_image_id" integer,
  	"seo_canonical_url" varchar,
  	"seo_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_media_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_media_posts_v_version_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_media_posts_v_version_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tag" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_media_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_type" "enum__media_posts_v_version_type" DEFAULT 'news',
  	"version_publish_date" timestamp(3) with time zone,
  	"version_author_id" integer,
  	"version_hero_image_id" integer,
  	"version_excerpt" varchar,
  	"version_body" jsonb,
  	"version_video_url" varchar,
  	"version_external_url" varchar,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_og_image_id" integer,
  	"version_seo_canonical_url" varchar,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__media_posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "careers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"location" varchar,
  	"type" "enum_careers_type" DEFAULT 'full-time',
  	"description" jsonb,
  	"active" boolean DEFAULT true,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_image_id" integer,
  	"seo_canonical_url" varchar,
  	"seo_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_careers_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_careers_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_location" varchar,
  	"version_type" "enum__careers_v_version_type" DEFAULT 'full-time',
  	"version_description" jsonb,
  	"version_active" boolean DEFAULT true,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_og_image_id" integer,
  	"version_seo_canonical_url" varchar,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__careers_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "donations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"donor_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"pan" varchar,
  	"address" varchar,
  	"amount" numeric NOT NULL,
  	"currency" "enum_donations_currency" DEFAULT 'INR' NOT NULL,
  	"frequency" "enum_donations_frequency" DEFAULT 'one-time' NOT NULL,
  	"subscription_id" varchar,
  	"campaign_id" integer,
  	"project_id" integer,
  	"gateway" "enum_donations_gateway" NOT NULL,
  	"gateway_txn_id" varchar,
  	"gateway_status" varchar,
  	"internal_status" "enum_donations_internal_status" DEFAULT 'initiated' NOT NULL,
  	"receipt_number" varchar,
  	"receipt_pdf_url" varchar,
  	"consent_terms_accepted" boolean DEFAULT false NOT NULL,
  	"consent_contact_permission" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "subscriptions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"donor_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"pan" varchar,
  	"amount" numeric NOT NULL,
  	"gateway_subscription_id" varchar NOT NULL,
  	"status" "enum_subscriptions_status" DEFAULT 'active' NOT NULL,
  	"start_date" timestamp(3) with time zone NOT NULL,
  	"next_charge_date" timestamp(3) with time zone,
  	"cancel_token" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "form_submissions_files" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field_name" varchar NOT NULL,
  	"file_id" integer NOT NULL
  );
  
  CREATE TABLE "form_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_type" "enum_form_submissions_form_type" NOT NULL,
  	"page_id" integer NOT NULL,
  	"block_id" varchar NOT NULL,
  	"data" jsonb NOT NULL,
  	"status" "enum_form_submissions_status" DEFAULT 'new' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "redirects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"from" varchar NOT NULL,
  	"to" varchar NOT NULL,
  	"type" "enum_redirects_type" DEFAULT '301' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"graphics_id" integer,
  	"documents_id" integer,
  	"pages_id" integer,
  	"project_categories_id" integer,
  	"projects_id" integer,
  	"team_members_id" integer,
  	"testimonials_id" integer,
  	"campaigns_id" integer,
  	"media_posts_id" integer,
  	"careers_id" integer,
  	"donations_id" integer,
  	"subscriptions_id" integer,
  	"form_submissions_id" integer,
  	"redirects_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
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
  
  CREATE TABLE "site_settings_registrations_certificates" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"file_id" integer NOT NULL
  );
  
  CREATE TABLE "site_settings_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_site_settings_social_links_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_top_header_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_site_settings_top_header_items_type" NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar DEFAULT 'ODH Foundation' NOT NULL,
  	"logo_id" integer NOT NULL,
  	"logo_light_id" integer,
  	"favicon_id" integer,
  	"default_og_image_id" integer,
  	"newsletter_heading" varchar DEFAULT 'Sign Up For Latest Updates' NOT NULL,
  	"newsletter_description" varchar DEFAULT 'To keep yourself updated on latest news and programs at ODH Foundation, drop in your E-mail ID' NOT NULL,
  	"newsletter_placeholder" varchar DEFAULT 'Your Email',
  	"newsletter_button_label" varchar DEFAULT 'Subscribe',
  	"contact_address" varchar NOT NULL,
  	"contact_phone" varchar,
  	"contact_mobile" varchar NOT NULL,
  	"contact_email" varchar NOT NULL,
  	"contact_donation_info_heading" varchar DEFAULT 'Bank Details',
  	"contact_donation_info_sub_heading" varchar DEFAULT 'Direct Bank Transfer through Net Banking, QR Code or Cheque',
  	"contact_donation_info_qr_heading" varchar DEFAULT 'Scan QR Code to Donate',
  	"contact_donation_info_qr_caption" varchar DEFAULT 'ODH FOUNDATION',
  	"contact_donation_info_donation_note" jsonb,
  	"contact_hours" varchar,
  	"contact_map_url" varchar,
  	"contact_qr_code_id" integer,
  	"contact_qr_caption" varchar DEFAULT 'Scan to Donate',
  	"contact_registered_office_title" varchar DEFAULT 'Registered Office',
  	"contact_registered_office_organization" varchar DEFAULT 'ODH Foundation',
  	"contact_registered_office_address" varchar,
  	"contact_head_office_title" varchar DEFAULT 'Head Office',
  	"contact_head_office_organization" varchar DEFAULT 'ODH Foundation',
  	"contact_head_office_address" varchar,
  	"contact_whatsapp" varchar,
  	"contact_email_description" varchar DEFAULT 'For any enquiries or information, drop in a mail to',
  	"registrations_pan" varchar,
  	"registrations_reg80g" varchar,
  	"registrations_reg12a" varchar,
  	"registrations_csr1" varchar,
  	"top_header_enabled" boolean DEFAULT true,
  	"ga4_id" varchar,
  	"clarity_id" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "navigation_header_items_children" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "navigation_header_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"style" "enum_navigation_header_items_style" DEFAULT 'link' NOT NULL
  );
  
  CREATE TABLE "navigation_footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL
  );
  
  CREATE TABLE "navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"legal_line" varchar DEFAULT 'Copyright © ODH Foundation NGO in India. All Rights Reserved.' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "donation_settings_preset_amounts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"amount" numeric NOT NULL,
  	"highlight" boolean DEFAULT false
  );
  
  CREATE TABLE "donation_settings_impact_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"amount" numeric NOT NULL,
  	"description" varchar NOT NULL,
  	"icon_id" integer
  );
  
  CREATE TABLE "donation_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"min_amount" numeric DEFAULT 100 NOT NULL,
  	"allow_monthly" boolean DEFAULT true,
  	"receipt_signatory_name" varchar NOT NULL,
  	"receipt_signatory_role" varchar,
  	"receipt_signature_image_id" integer,
  	"receipt_statement80g" varchar NOT NULL,
  	"gateway_mode" "enum_donation_settings_gateway_mode" DEFAULT 'test' NOT NULL,
  	"gateway" "enum_donation_settings_gateway" DEFAULT 'payu' NOT NULL,
  	"upi_qr_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_slides" ADD CONSTRAINT "pages_blocks_hero_slides_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_slides" ADD CONSTRAINT "pages_blocks_hero_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_page_header_crumbs" ADD CONSTRAINT "pages_blocks_page_header_crumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_page_header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_page_header" ADD CONSTRAINT "pages_blocks_page_header_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_page_header" ADD CONSTRAINT "pages_blocks_page_header_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_bar_stats" ADD CONSTRAINT "pages_blocks_stats_bar_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stats_bar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_bar" ADD CONSTRAINT "pages_blocks_stats_bar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_about_strip_paragraphs" ADD CONSTRAINT "pages_blocks_about_strip_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_about_strip"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_about_strip" ADD CONSTRAINT "pages_blocks_about_strip_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_about_strip" ADD CONSTRAINT "pages_blocks_about_strip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_category_grid" ADD CONSTRAINT "pages_blocks_category_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_featured_campaigns" ADD CONSTRAINT "pages_blocks_featured_campaigns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_featured_projects" ADD CONSTRAINT "pages_blocks_featured_projects_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_how_you_can_help_options" ADD CONSTRAINT "pages_blocks_how_you_can_help_options_icon_id_graphics_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."graphics"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_how_you_can_help_options" ADD CONSTRAINT "pages_blocks_how_you_can_help_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_how_you_can_help"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_how_you_can_help" ADD CONSTRAINT "pages_blocks_how_you_can_help_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonial_carousel" ADD CONSTRAINT "pages_blocks_testimonial_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_grid_filter_by_type" ADD CONSTRAINT "pages_blocks_media_grid_filter_by_type_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages_blocks_media_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_grid" ADD CONSTRAINT "pages_blocks_media_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_trust_strip_badges" ADD CONSTRAINT "pages_blocks_trust_strip_badges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_trust_strip"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_trust_strip_logos" ADD CONSTRAINT "pages_blocks_trust_strip_logos_logo_id_graphics_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."graphics"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_trust_strip_logos" ADD CONSTRAINT "pages_blocks_trust_strip_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_trust_strip"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_trust_strip" ADD CONSTRAINT "pages_blocks_trust_strip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_band_trust_badges" ADD CONSTRAINT "pages_blocks_cta_band_trust_badges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta_band"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_band" ADD CONSTRAINT "pages_blocks_cta_band_qr_image_id_graphics_id_fk" FOREIGN KEY ("qr_image_id") REFERENCES "public"."graphics"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_band" ADD CONSTRAINT "pages_blocks_cta_band_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rich_text" ADD CONSTRAINT "pages_blocks_rich_text_button_page_id_pages_id_fk" FOREIGN KEY ("button_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_rich_text" ADD CONSTRAINT "pages_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_team_grid" ADD CONSTRAINT "pages_blocks_team_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_timeline_milestones" ADD CONSTRAINT "pages_blocks_timeline_milestones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_timeline" ADD CONSTRAINT "pages_blocks_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_accordion_faqs" ADD CONSTRAINT "pages_blocks_faq_accordion_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq_accordion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_accordion" ADD CONSTRAINT "pages_blocks_faq_accordion_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_form_block_fields_options" ADD CONSTRAINT "pages_blocks_form_block_fields_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_form_block_fields"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_form_block_fields" ADD CONSTRAINT "pages_blocks_form_block_fields_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_form_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_form_block" ADD CONSTRAINT "pages_blocks_form_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_gallery_images" ADD CONSTRAINT "pages_blocks_image_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_gallery_images" ADD CONSTRAINT "pages_blocks_image_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_image_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_gallery" ADD CONSTRAINT "pages_blocks_image_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_video_embed" ADD CONSTRAINT "pages_blocks_video_embed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_map_contact" ADD CONSTRAINT "pages_blocks_map_contact_map_image_id_media_id_fk" FOREIGN KEY ("map_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_map_contact" ADD CONSTRAINT "pages_blocks_map_contact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_cards_cards" ADD CONSTRAINT "pages_blocks_feature_cards_cards_icon_id_graphics_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."graphics"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_cards_cards" ADD CONSTRAINT "pages_blocks_feature_cards_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_feature_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_cards" ADD CONSTRAINT "pages_blocks_feature_cards_download_cta_file_id_documents_id_fk" FOREIGN KEY ("download_cta_file_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_cards" ADD CONSTRAINT "pages_blocks_feature_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_home_intro_section_featured_project_images" ADD CONSTRAINT "pages_blocks_home_intro_section_featured_project_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_home_intro_section_featured_project_images" ADD CONSTRAINT "pages_blocks_home_intro_section_featured_project_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_home_intro_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_home_intro_section_get_involved_items" ADD CONSTRAINT "pages_blocks_home_intro_section_get_involved_items_icon_id_graphics_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."graphics"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_home_intro_section_get_involved_items" ADD CONSTRAINT "pages_blocks_home_intro_section_get_involved_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_home_intro_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_home_intro_section" ADD CONSTRAINT "pages_blocks_home_intro_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_why_o_d_h_foundation_features" ADD CONSTRAINT "pages_blocks_why_o_d_h_foundation_features_icon_id_graphics_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."graphics"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_why_o_d_h_foundation_features" ADD CONSTRAINT "pages_blocks_why_o_d_h_foundation_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_why_o_d_h_foundation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_why_o_d_h_foundation" ADD CONSTRAINT "pages_blocks_why_o_d_h_foundation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_our_causes_causes" ADD CONSTRAINT "pages_blocks_our_causes_causes_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_our_causes_causes" ADD CONSTRAINT "pages_blocks_our_causes_causes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_our_causes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_our_causes" ADD CONSTRAINT "pages_blocks_our_causes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_volunteer_c_t_a" ADD CONSTRAINT "pages_blocks_volunteer_c_t_a_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_volunteer_c_t_a" ADD CONSTRAINT "pages_blocks_volunteer_c_t_a_foreground_image_id_media_id_fk" FOREIGN KEY ("foreground_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_volunteer_c_t_a" ADD CONSTRAINT "pages_blocks_volunteer_c_t_a_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_about_intro_section_slider_images" ADD CONSTRAINT "pages_blocks_about_intro_section_slider_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_about_intro_section_slider_images" ADD CONSTRAINT "pages_blocks_about_intro_section_slider_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_about_intro_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_about_intro_section" ADD CONSTRAINT "pages_blocks_about_intro_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_vision_mission" ADD CONSTRAINT "pages_blocks_vision_mission_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_finalctabanner" ADD CONSTRAINT "pages_blocks_finalctabanner_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_finalctabanner" ADD CONSTRAINT "pages_blocks_finalctabanner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_events_and_causes_section_events" ADD CONSTRAINT "pages_blocks_events_and_causes_section_events_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_events_and_causes_section_events" ADD CONSTRAINT "pages_blocks_events_and_causes_section_events_read_more_link_id_pages_id_fk" FOREIGN KEY ("read_more_link_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_events_and_causes_section_events" ADD CONSTRAINT "pages_blocks_events_and_causes_section_events_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_events_and_causes_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_events_and_causes_section_causes" ADD CONSTRAINT "pages_blocks_events_and_causes_section_causes_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_events_and_causes_section_causes" ADD CONSTRAINT "pages_blocks_events_and_causes_section_causes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_events_and_causes_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_events_and_causes_section" ADD CONSTRAINT "pages_blocks_events_and_causes_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_information" ADD CONSTRAINT "pages_blocks_contact_information_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_contact_c_t_a" ADD CONSTRAINT "pages_blocks_faq_contact_c_t_a_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_contact_c_t_a" ADD CONSTRAINT "pages_blocks_faq_contact_c_t_a_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_campaigns_fk" FOREIGN KEY ("campaigns_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_slides" ADD CONSTRAINT "_pages_v_blocks_hero_slides_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_slides" ADD CONSTRAINT "_pages_v_blocks_hero_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_page_header_crumbs" ADD CONSTRAINT "_pages_v_blocks_page_header_crumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_page_header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_page_header" ADD CONSTRAINT "_pages_v_blocks_page_header_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_page_header" ADD CONSTRAINT "_pages_v_blocks_page_header_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats_bar_stats" ADD CONSTRAINT "_pages_v_blocks_stats_bar_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_stats_bar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats_bar" ADD CONSTRAINT "_pages_v_blocks_stats_bar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_about_strip_paragraphs" ADD CONSTRAINT "_pages_v_blocks_about_strip_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_about_strip"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_about_strip" ADD CONSTRAINT "_pages_v_blocks_about_strip_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_about_strip" ADD CONSTRAINT "_pages_v_blocks_about_strip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_category_grid" ADD CONSTRAINT "_pages_v_blocks_category_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_featured_campaigns" ADD CONSTRAINT "_pages_v_blocks_featured_campaigns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_featured_projects" ADD CONSTRAINT "_pages_v_blocks_featured_projects_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_how_you_can_help_options" ADD CONSTRAINT "_pages_v_blocks_how_you_can_help_options_icon_id_graphics_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."graphics"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_how_you_can_help_options" ADD CONSTRAINT "_pages_v_blocks_how_you_can_help_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_how_you_can_help"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_how_you_can_help" ADD CONSTRAINT "_pages_v_blocks_how_you_can_help_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonial_carousel" ADD CONSTRAINT "_pages_v_blocks_testimonial_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_grid_filter_by_type" ADD CONSTRAINT "_pages_v_blocks_media_grid_filter_by_type_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v_blocks_media_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_grid" ADD CONSTRAINT "_pages_v_blocks_media_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_trust_strip_badges" ADD CONSTRAINT "_pages_v_blocks_trust_strip_badges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_trust_strip"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_trust_strip_logos" ADD CONSTRAINT "_pages_v_blocks_trust_strip_logos_logo_id_graphics_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."graphics"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_trust_strip_logos" ADD CONSTRAINT "_pages_v_blocks_trust_strip_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_trust_strip"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_trust_strip" ADD CONSTRAINT "_pages_v_blocks_trust_strip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_band_trust_badges" ADD CONSTRAINT "_pages_v_blocks_cta_band_trust_badges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cta_band"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_band" ADD CONSTRAINT "_pages_v_blocks_cta_band_qr_image_id_graphics_id_fk" FOREIGN KEY ("qr_image_id") REFERENCES "public"."graphics"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_band" ADD CONSTRAINT "_pages_v_blocks_cta_band_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rich_text" ADD CONSTRAINT "_pages_v_blocks_rich_text_button_page_id_pages_id_fk" FOREIGN KEY ("button_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rich_text" ADD CONSTRAINT "_pages_v_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_team_grid" ADD CONSTRAINT "_pages_v_blocks_team_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_timeline_milestones" ADD CONSTRAINT "_pages_v_blocks_timeline_milestones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_timeline" ADD CONSTRAINT "_pages_v_blocks_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_accordion_faqs" ADD CONSTRAINT "_pages_v_blocks_faq_accordion_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq_accordion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_accordion" ADD CONSTRAINT "_pages_v_blocks_faq_accordion_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form_block_fields_options" ADD CONSTRAINT "_pages_v_blocks_form_block_fields_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_form_block_fields"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form_block_fields" ADD CONSTRAINT "_pages_v_blocks_form_block_fields_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_form_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form_block" ADD CONSTRAINT "_pages_v_blocks_form_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_gallery_images" ADD CONSTRAINT "_pages_v_blocks_image_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_gallery_images" ADD CONSTRAINT "_pages_v_blocks_image_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_image_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_gallery" ADD CONSTRAINT "_pages_v_blocks_image_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video_embed" ADD CONSTRAINT "_pages_v_blocks_video_embed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_map_contact" ADD CONSTRAINT "_pages_v_blocks_map_contact_map_image_id_media_id_fk" FOREIGN KEY ("map_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_map_contact" ADD CONSTRAINT "_pages_v_blocks_map_contact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_cards_cards" ADD CONSTRAINT "_pages_v_blocks_feature_cards_cards_icon_id_graphics_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."graphics"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_cards_cards" ADD CONSTRAINT "_pages_v_blocks_feature_cards_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_feature_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_cards" ADD CONSTRAINT "_pages_v_blocks_feature_cards_download_cta_file_id_documents_id_fk" FOREIGN KEY ("download_cta_file_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_cards" ADD CONSTRAINT "_pages_v_blocks_feature_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_home_intro_section_featured_project_images" ADD CONSTRAINT "_pages_v_blocks_home_intro_section_featured_project_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_home_intro_section_featured_project_images" ADD CONSTRAINT "_pages_v_blocks_home_intro_section_featured_project_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_home_intro_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_home_intro_section_get_involved_items" ADD CONSTRAINT "_pages_v_blocks_home_intro_section_get_involved_items_icon_id_graphics_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."graphics"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_home_intro_section_get_involved_items" ADD CONSTRAINT "_pages_v_blocks_home_intro_section_get_involved_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_home_intro_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_home_intro_section" ADD CONSTRAINT "_pages_v_blocks_home_intro_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_why_o_d_h_foundation_features" ADD CONSTRAINT "_pages_v_blocks_why_o_d_h_foundation_features_icon_id_graphics_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."graphics"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_why_o_d_h_foundation_features" ADD CONSTRAINT "_pages_v_blocks_why_o_d_h_foundation_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_why_o_d_h_foundation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_why_o_d_h_foundation" ADD CONSTRAINT "_pages_v_blocks_why_o_d_h_foundation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_our_causes_causes" ADD CONSTRAINT "_pages_v_blocks_our_causes_causes_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_our_causes_causes" ADD CONSTRAINT "_pages_v_blocks_our_causes_causes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_our_causes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_our_causes" ADD CONSTRAINT "_pages_v_blocks_our_causes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_volunteer_c_t_a" ADD CONSTRAINT "_pages_v_blocks_volunteer_c_t_a_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_volunteer_c_t_a" ADD CONSTRAINT "_pages_v_blocks_volunteer_c_t_a_foreground_image_id_media_id_fk" FOREIGN KEY ("foreground_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_volunteer_c_t_a" ADD CONSTRAINT "_pages_v_blocks_volunteer_c_t_a_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_about_intro_section_slider_images" ADD CONSTRAINT "_pages_v_blocks_about_intro_section_slider_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_about_intro_section_slider_images" ADD CONSTRAINT "_pages_v_blocks_about_intro_section_slider_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_about_intro_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_about_intro_section" ADD CONSTRAINT "_pages_v_blocks_about_intro_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_vision_mission" ADD CONSTRAINT "_pages_v_blocks_vision_mission_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_finalctabanner" ADD CONSTRAINT "_pages_v_blocks_finalctabanner_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_finalctabanner" ADD CONSTRAINT "_pages_v_blocks_finalctabanner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_events_and_causes_section_events" ADD CONSTRAINT "_pages_v_blocks_events_and_causes_section_events_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_events_and_causes_section_events" ADD CONSTRAINT "_pages_v_blocks_events_and_causes_section_events_read_more_link_id_pages_id_fk" FOREIGN KEY ("read_more_link_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_events_and_causes_section_events" ADD CONSTRAINT "_pages_v_blocks_events_and_causes_section_events_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_events_and_causes_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_events_and_causes_section_causes" ADD CONSTRAINT "_pages_v_blocks_events_and_causes_section_causes_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_events_and_causes_section_causes" ADD CONSTRAINT "_pages_v_blocks_events_and_causes_section_causes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_events_and_causes_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_events_and_causes_section" ADD CONSTRAINT "_pages_v_blocks_events_and_causes_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact_information" ADD CONSTRAINT "_pages_v_blocks_contact_information_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_contact_c_t_a" ADD CONSTRAINT "_pages_v_blocks_faq_contact_c_t_a_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_contact_c_t_a" ADD CONSTRAINT "_pages_v_blocks_faq_contact_c_t_a_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_campaigns_fk" FOREIGN KEY ("campaigns_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "project_categories_crumbs" ADD CONSTRAINT "project_categories_crumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."project_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "project_categories" ADD CONSTRAINT "project_categories_icon_id_graphics_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."graphics"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "project_categories" ADD CONSTRAINT "project_categories_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "project_categories" ADD CONSTRAINT "project_categories_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_project_categories_v_version_crumbs" ADD CONSTRAINT "_project_categories_v_version_crumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_project_categories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_project_categories_v" ADD CONSTRAINT "_project_categories_v_parent_id_project_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."project_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_project_categories_v" ADD CONSTRAINT "_project_categories_v_version_icon_id_graphics_id_fk" FOREIGN KEY ("version_icon_id") REFERENCES "public"."graphics"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_project_categories_v" ADD CONSTRAINT "_project_categories_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_project_categories_v" ADD CONSTRAINT "_project_categories_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_impact_stats" ADD CONSTRAINT "projects_impact_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_gallery" ADD CONSTRAINT "projects_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_gallery" ADD CONSTRAINT "projects_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_partners" ADD CONSTRAINT "projects_partners_logo_id_graphics_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."graphics"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_partners" ADD CONSTRAINT "projects_partners_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_category_id_project_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."project_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_version_impact_stats" ADD CONSTRAINT "_projects_v_version_impact_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_gallery" ADD CONSTRAINT "_projects_v_version_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_version_gallery" ADD CONSTRAINT "_projects_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_partners" ADD CONSTRAINT "_projects_v_version_partners_logo_id_graphics_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."graphics"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_version_partners" ADD CONSTRAINT "_projects_v_version_partners_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_parent_id_projects_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_category_id_project_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."project_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "team_members" ADD CONSTRAINT "team_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_team_members_v" ADD CONSTRAINT "_team_members_v_parent_id_team_members_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_team_members_v" ADD CONSTRAINT "_team_members_v_version_photo_id_media_id_fk" FOREIGN KEY ("version_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_related_project_id_projects_id_fk" FOREIGN KEY ("related_project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_testimonials_v" ADD CONSTRAINT "_testimonials_v_parent_id_testimonials_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."testimonials"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_testimonials_v" ADD CONSTRAINT "_testimonials_v_version_photo_id_media_id_fk" FOREIGN KEY ("version_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_testimonials_v" ADD CONSTRAINT "_testimonials_v_version_related_project_id_projects_id_fk" FOREIGN KEY ("version_related_project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "campaigns_crumbs" ADD CONSTRAINT "campaigns_crumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "campaigns_faqs" ADD CONSTRAINT "campaigns_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "campaigns_gallery" ADD CONSTRAINT "campaigns_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "campaigns_gallery" ADD CONSTRAINT "campaigns_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_campaigns_v_version_crumbs" ADD CONSTRAINT "_campaigns_v_version_crumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_campaigns_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_campaigns_v_version_faqs" ADD CONSTRAINT "_campaigns_v_version_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_campaigns_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_campaigns_v_version_gallery" ADD CONSTRAINT "_campaigns_v_version_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_campaigns_v_version_gallery" ADD CONSTRAINT "_campaigns_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_campaigns_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_campaigns_v" ADD CONSTRAINT "_campaigns_v_parent_id_campaigns_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."campaigns"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_campaigns_v" ADD CONSTRAINT "_campaigns_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_campaigns_v" ADD CONSTRAINT "_campaigns_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media_posts_gallery_images" ADD CONSTRAINT "media_posts_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media_posts_gallery_images" ADD CONSTRAINT "media_posts_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_posts_tags" ADD CONSTRAINT "media_posts_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_posts" ADD CONSTRAINT "media_posts_author_id_team_members_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media_posts" ADD CONSTRAINT "media_posts_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media_posts" ADD CONSTRAINT "media_posts_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_media_posts_v_version_gallery_images" ADD CONSTRAINT "_media_posts_v_version_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_media_posts_v_version_gallery_images" ADD CONSTRAINT "_media_posts_v_version_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_media_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_media_posts_v_version_tags" ADD CONSTRAINT "_media_posts_v_version_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_media_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_media_posts_v" ADD CONSTRAINT "_media_posts_v_parent_id_media_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."media_posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_media_posts_v" ADD CONSTRAINT "_media_posts_v_version_author_id_team_members_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_media_posts_v" ADD CONSTRAINT "_media_posts_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_media_posts_v" ADD CONSTRAINT "_media_posts_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "careers" ADD CONSTRAINT "careers_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_careers_v" ADD CONSTRAINT "_careers_v_parent_id_careers_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."careers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_careers_v" ADD CONSTRAINT "_careers_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "donations" ADD CONSTRAINT "donations_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "donations" ADD CONSTRAINT "donations_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "form_submissions_files" ADD CONSTRAINT "form_submissions_files_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "form_submissions_files" ADD CONSTRAINT "form_submissions_files_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_graphics_fk" FOREIGN KEY ("graphics_id") REFERENCES "public"."graphics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_documents_fk" FOREIGN KEY ("documents_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_project_categories_fk" FOREIGN KEY ("project_categories_id") REFERENCES "public"."project_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_team_members_fk" FOREIGN KEY ("team_members_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_campaigns_fk" FOREIGN KEY ("campaigns_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_posts_fk" FOREIGN KEY ("media_posts_id") REFERENCES "public"."media_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_careers_fk" FOREIGN KEY ("careers_id") REFERENCES "public"."careers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_donations_fk" FOREIGN KEY ("donations_id") REFERENCES "public"."donations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_subscriptions_fk" FOREIGN KEY ("subscriptions_id") REFERENCES "public"."subscriptions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_form_submissions_fk" FOREIGN KEY ("form_submissions_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redirects_fk" FOREIGN KEY ("redirects_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_contact_donation_info_bank_accounts" ADD CONSTRAINT "site_settings_contact_donation_info_bank_accounts_bank_logo_id_graphics_id_fk" FOREIGN KEY ("bank_logo_id") REFERENCES "public"."graphics"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_contact_donation_info_bank_accounts" ADD CONSTRAINT "site_settings_contact_donation_info_bank_accounts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_registrations_certificates" ADD CONSTRAINT "site_settings_registrations_certificates_file_id_documents_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_registrations_certificates" ADD CONSTRAINT "site_settings_registrations_certificates_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_social_links" ADD CONSTRAINT "site_settings_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_top_header_items" ADD CONSTRAINT "site_settings_top_header_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_id_graphics_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."graphics"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_light_id_graphics_id_fk" FOREIGN KEY ("logo_light_id") REFERENCES "public"."graphics"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_favicon_id_graphics_id_fk" FOREIGN KEY ("favicon_id") REFERENCES "public"."graphics"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_default_og_image_id_media_id_fk" FOREIGN KEY ("default_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_contact_qr_code_id_graphics_id_fk" FOREIGN KEY ("contact_qr_code_id") REFERENCES "public"."graphics"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigation_header_items_children" ADD CONSTRAINT "navigation_header_items_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_header_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_header_items" ADD CONSTRAINT "navigation_header_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer_columns_links" ADD CONSTRAINT "navigation_footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer_columns" ADD CONSTRAINT "navigation_footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "donation_settings_preset_amounts" ADD CONSTRAINT "donation_settings_preset_amounts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."donation_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "donation_settings_impact_cards" ADD CONSTRAINT "donation_settings_impact_cards_icon_id_graphics_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."graphics"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "donation_settings_impact_cards" ADD CONSTRAINT "donation_settings_impact_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."donation_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "donation_settings" ADD CONSTRAINT "donation_settings_receipt_signature_image_id_graphics_id_fk" FOREIGN KEY ("receipt_signature_image_id") REFERENCES "public"."graphics"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "donation_settings" ADD CONSTRAINT "donation_settings_upi_qr_id_graphics_id_fk" FOREIGN KEY ("upi_qr_id") REFERENCES "public"."graphics"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumb_sizes_thumb_filename_idx" ON "media" USING btree ("sizes_thumb_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_feature_sizes_feature_filename_idx" ON "media" USING btree ("sizes_feature_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE INDEX "graphics_updated_at_idx" ON "graphics" USING btree ("updated_at");
  CREATE INDEX "graphics_created_at_idx" ON "graphics" USING btree ("created_at");
  CREATE UNIQUE INDEX "graphics_filename_idx" ON "graphics" USING btree ("filename");
  CREATE INDEX "documents_updated_at_idx" ON "documents" USING btree ("updated_at");
  CREATE INDEX "documents_created_at_idx" ON "documents" USING btree ("created_at");
  CREATE UNIQUE INDEX "documents_filename_idx" ON "documents" USING btree ("filename");
  CREATE INDEX "pages_blocks_hero_slides_order_idx" ON "pages_blocks_hero_slides" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_slides_parent_id_idx" ON "pages_blocks_hero_slides" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_slides_background_image_idx" ON "pages_blocks_hero_slides" USING btree ("background_image_id");
  CREATE INDEX "pages_blocks_hero_order_idx" ON "pages_blocks_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_parent_id_idx" ON "pages_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_path_idx" ON "pages_blocks_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_page_header_crumbs_order_idx" ON "pages_blocks_page_header_crumbs" USING btree ("_order");
  CREATE INDEX "pages_blocks_page_header_crumbs_parent_id_idx" ON "pages_blocks_page_header_crumbs" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_page_header_order_idx" ON "pages_blocks_page_header" USING btree ("_order");
  CREATE INDEX "pages_blocks_page_header_parent_id_idx" ON "pages_blocks_page_header" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_page_header_path_idx" ON "pages_blocks_page_header" USING btree ("_path");
  CREATE INDEX "pages_blocks_page_header_image_idx" ON "pages_blocks_page_header" USING btree ("image_id");
  CREATE INDEX "pages_blocks_stats_bar_stats_order_idx" ON "pages_blocks_stats_bar_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_bar_stats_parent_id_idx" ON "pages_blocks_stats_bar_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_bar_order_idx" ON "pages_blocks_stats_bar" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_bar_parent_id_idx" ON "pages_blocks_stats_bar" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_bar_path_idx" ON "pages_blocks_stats_bar" USING btree ("_path");
  CREATE INDEX "pages_blocks_about_strip_paragraphs_order_idx" ON "pages_blocks_about_strip_paragraphs" USING btree ("_order");
  CREATE INDEX "pages_blocks_about_strip_paragraphs_parent_id_idx" ON "pages_blocks_about_strip_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_about_strip_order_idx" ON "pages_blocks_about_strip" USING btree ("_order");
  CREATE INDEX "pages_blocks_about_strip_parent_id_idx" ON "pages_blocks_about_strip" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_about_strip_path_idx" ON "pages_blocks_about_strip" USING btree ("_path");
  CREATE INDEX "pages_blocks_about_strip_image_idx" ON "pages_blocks_about_strip" USING btree ("image_id");
  CREATE INDEX "pages_blocks_category_grid_order_idx" ON "pages_blocks_category_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_category_grid_parent_id_idx" ON "pages_blocks_category_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_category_grid_path_idx" ON "pages_blocks_category_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_featured_campaigns_order_idx" ON "pages_blocks_featured_campaigns" USING btree ("_order");
  CREATE INDEX "pages_blocks_featured_campaigns_parent_id_idx" ON "pages_blocks_featured_campaigns" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_featured_campaigns_path_idx" ON "pages_blocks_featured_campaigns" USING btree ("_path");
  CREATE INDEX "pages_blocks_featured_projects_order_idx" ON "pages_blocks_featured_projects" USING btree ("_order");
  CREATE INDEX "pages_blocks_featured_projects_parent_id_idx" ON "pages_blocks_featured_projects" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_featured_projects_path_idx" ON "pages_blocks_featured_projects" USING btree ("_path");
  CREATE INDEX "pages_blocks_how_you_can_help_options_order_idx" ON "pages_blocks_how_you_can_help_options" USING btree ("_order");
  CREATE INDEX "pages_blocks_how_you_can_help_options_parent_id_idx" ON "pages_blocks_how_you_can_help_options" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_how_you_can_help_options_icon_idx" ON "pages_blocks_how_you_can_help_options" USING btree ("icon_id");
  CREATE INDEX "pages_blocks_how_you_can_help_order_idx" ON "pages_blocks_how_you_can_help" USING btree ("_order");
  CREATE INDEX "pages_blocks_how_you_can_help_parent_id_idx" ON "pages_blocks_how_you_can_help" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_how_you_can_help_path_idx" ON "pages_blocks_how_you_can_help" USING btree ("_path");
  CREATE INDEX "pages_blocks_testimonial_carousel_order_idx" ON "pages_blocks_testimonial_carousel" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonial_carousel_parent_id_idx" ON "pages_blocks_testimonial_carousel" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonial_carousel_path_idx" ON "pages_blocks_testimonial_carousel" USING btree ("_path");
  CREATE INDEX "pages_blocks_media_grid_filter_by_type_order_idx" ON "pages_blocks_media_grid_filter_by_type" USING btree ("order");
  CREATE INDEX "pages_blocks_media_grid_filter_by_type_parent_idx" ON "pages_blocks_media_grid_filter_by_type" USING btree ("parent_id");
  CREATE INDEX "pages_blocks_media_grid_order_idx" ON "pages_blocks_media_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_media_grid_parent_id_idx" ON "pages_blocks_media_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_media_grid_path_idx" ON "pages_blocks_media_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_trust_strip_badges_order_idx" ON "pages_blocks_trust_strip_badges" USING btree ("_order");
  CREATE INDEX "pages_blocks_trust_strip_badges_parent_id_idx" ON "pages_blocks_trust_strip_badges" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_trust_strip_logos_order_idx" ON "pages_blocks_trust_strip_logos" USING btree ("_order");
  CREATE INDEX "pages_blocks_trust_strip_logos_parent_id_idx" ON "pages_blocks_trust_strip_logos" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_trust_strip_logos_logo_idx" ON "pages_blocks_trust_strip_logos" USING btree ("logo_id");
  CREATE INDEX "pages_blocks_trust_strip_order_idx" ON "pages_blocks_trust_strip" USING btree ("_order");
  CREATE INDEX "pages_blocks_trust_strip_parent_id_idx" ON "pages_blocks_trust_strip" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_trust_strip_path_idx" ON "pages_blocks_trust_strip" USING btree ("_path");
  CREATE INDEX "pages_blocks_cta_band_trust_badges_order_idx" ON "pages_blocks_cta_band_trust_badges" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_band_trust_badges_parent_id_idx" ON "pages_blocks_cta_band_trust_badges" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_band_order_idx" ON "pages_blocks_cta_band" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_band_parent_id_idx" ON "pages_blocks_cta_band" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_band_path_idx" ON "pages_blocks_cta_band" USING btree ("_path");
  CREATE INDEX "pages_blocks_cta_band_qr_image_idx" ON "pages_blocks_cta_band" USING btree ("qr_image_id");
  CREATE INDEX "pages_blocks_rich_text_order_idx" ON "pages_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_rich_text_parent_id_idx" ON "pages_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rich_text_path_idx" ON "pages_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "pages_blocks_rich_text_button_page_idx" ON "pages_blocks_rich_text" USING btree ("button_page_id");
  CREATE INDEX "pages_blocks_team_grid_order_idx" ON "pages_blocks_team_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_team_grid_parent_id_idx" ON "pages_blocks_team_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_team_grid_path_idx" ON "pages_blocks_team_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_timeline_milestones_order_idx" ON "pages_blocks_timeline_milestones" USING btree ("_order");
  CREATE INDEX "pages_blocks_timeline_milestones_parent_id_idx" ON "pages_blocks_timeline_milestones" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_timeline_order_idx" ON "pages_blocks_timeline" USING btree ("_order");
  CREATE INDEX "pages_blocks_timeline_parent_id_idx" ON "pages_blocks_timeline" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_timeline_path_idx" ON "pages_blocks_timeline" USING btree ("_path");
  CREATE INDEX "pages_blocks_faq_accordion_faqs_order_idx" ON "pages_blocks_faq_accordion_faqs" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_accordion_faqs_parent_id_idx" ON "pages_blocks_faq_accordion_faqs" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_accordion_order_idx" ON "pages_blocks_faq_accordion" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_accordion_parent_id_idx" ON "pages_blocks_faq_accordion" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_accordion_path_idx" ON "pages_blocks_faq_accordion" USING btree ("_path");
  CREATE INDEX "pages_blocks_form_block_fields_options_order_idx" ON "pages_blocks_form_block_fields_options" USING btree ("_order");
  CREATE INDEX "pages_blocks_form_block_fields_options_parent_id_idx" ON "pages_blocks_form_block_fields_options" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_form_block_fields_order_idx" ON "pages_blocks_form_block_fields" USING btree ("_order");
  CREATE INDEX "pages_blocks_form_block_fields_parent_id_idx" ON "pages_blocks_form_block_fields" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_form_block_order_idx" ON "pages_blocks_form_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_form_block_parent_id_idx" ON "pages_blocks_form_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_form_block_path_idx" ON "pages_blocks_form_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_image_gallery_images_order_idx" ON "pages_blocks_image_gallery_images" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_gallery_images_parent_id_idx" ON "pages_blocks_image_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_gallery_images_image_idx" ON "pages_blocks_image_gallery_images" USING btree ("image_id");
  CREATE INDEX "pages_blocks_image_gallery_order_idx" ON "pages_blocks_image_gallery" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_gallery_parent_id_idx" ON "pages_blocks_image_gallery" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_gallery_path_idx" ON "pages_blocks_image_gallery" USING btree ("_path");
  CREATE INDEX "pages_blocks_video_embed_order_idx" ON "pages_blocks_video_embed" USING btree ("_order");
  CREATE INDEX "pages_blocks_video_embed_parent_id_idx" ON "pages_blocks_video_embed" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_video_embed_path_idx" ON "pages_blocks_video_embed" USING btree ("_path");
  CREATE INDEX "pages_blocks_map_contact_order_idx" ON "pages_blocks_map_contact" USING btree ("_order");
  CREATE INDEX "pages_blocks_map_contact_parent_id_idx" ON "pages_blocks_map_contact" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_map_contact_path_idx" ON "pages_blocks_map_contact" USING btree ("_path");
  CREATE INDEX "pages_blocks_map_contact_map_image_idx" ON "pages_blocks_map_contact" USING btree ("map_image_id");
  CREATE INDEX "pages_blocks_feature_cards_cards_order_idx" ON "pages_blocks_feature_cards_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_cards_cards_parent_id_idx" ON "pages_blocks_feature_cards_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_cards_cards_icon_idx" ON "pages_blocks_feature_cards_cards" USING btree ("icon_id");
  CREATE INDEX "pages_blocks_feature_cards_order_idx" ON "pages_blocks_feature_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_cards_parent_id_idx" ON "pages_blocks_feature_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_cards_path_idx" ON "pages_blocks_feature_cards" USING btree ("_path");
  CREATE INDEX "pages_blocks_feature_cards_download_cta_download_cta_fil_idx" ON "pages_blocks_feature_cards" USING btree ("download_cta_file_id");
  CREATE INDEX "pages_blocks_home_intro_section_featured_project_images_order_idx" ON "pages_blocks_home_intro_section_featured_project_images" USING btree ("_order");
  CREATE INDEX "pages_blocks_home_intro_section_featured_project_images_parent_id_idx" ON "pages_blocks_home_intro_section_featured_project_images" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_home_intro_section_featured_project_images__idx" ON "pages_blocks_home_intro_section_featured_project_images" USING btree ("image_id");
  CREATE INDEX "pages_blocks_home_intro_section_get_involved_items_order_idx" ON "pages_blocks_home_intro_section_get_involved_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_home_intro_section_get_involved_items_parent_id_idx" ON "pages_blocks_home_intro_section_get_involved_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_home_intro_section_get_involved_items_icon_idx" ON "pages_blocks_home_intro_section_get_involved_items" USING btree ("icon_id");
  CREATE INDEX "pages_blocks_home_intro_section_order_idx" ON "pages_blocks_home_intro_section" USING btree ("_order");
  CREATE INDEX "pages_blocks_home_intro_section_parent_id_idx" ON "pages_blocks_home_intro_section" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_home_intro_section_path_idx" ON "pages_blocks_home_intro_section" USING btree ("_path");
  CREATE INDEX "pages_blocks_why_o_d_h_foundation_features_order_idx" ON "pages_blocks_why_o_d_h_foundation_features" USING btree ("_order");
  CREATE INDEX "pages_blocks_why_o_d_h_foundation_features_parent_id_idx" ON "pages_blocks_why_o_d_h_foundation_features" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_why_o_d_h_foundation_features_icon_idx" ON "pages_blocks_why_o_d_h_foundation_features" USING btree ("icon_id");
  CREATE INDEX "pages_blocks_why_o_d_h_foundation_order_idx" ON "pages_blocks_why_o_d_h_foundation" USING btree ("_order");
  CREATE INDEX "pages_blocks_why_o_d_h_foundation_parent_id_idx" ON "pages_blocks_why_o_d_h_foundation" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_why_o_d_h_foundation_path_idx" ON "pages_blocks_why_o_d_h_foundation" USING btree ("_path");
  CREATE INDEX "pages_blocks_our_causes_causes_order_idx" ON "pages_blocks_our_causes_causes" USING btree ("_order");
  CREATE INDEX "pages_blocks_our_causes_causes_parent_id_idx" ON "pages_blocks_our_causes_causes" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_our_causes_causes_image_idx" ON "pages_blocks_our_causes_causes" USING btree ("image_id");
  CREATE INDEX "pages_blocks_our_causes_order_idx" ON "pages_blocks_our_causes" USING btree ("_order");
  CREATE INDEX "pages_blocks_our_causes_parent_id_idx" ON "pages_blocks_our_causes" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_our_causes_path_idx" ON "pages_blocks_our_causes" USING btree ("_path");
  CREATE INDEX "pages_blocks_volunteer_c_t_a_order_idx" ON "pages_blocks_volunteer_c_t_a" USING btree ("_order");
  CREATE INDEX "pages_blocks_volunteer_c_t_a_parent_id_idx" ON "pages_blocks_volunteer_c_t_a" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_volunteer_c_t_a_path_idx" ON "pages_blocks_volunteer_c_t_a" USING btree ("_path");
  CREATE INDEX "pages_blocks_volunteer_c_t_a_background_image_idx" ON "pages_blocks_volunteer_c_t_a" USING btree ("background_image_id");
  CREATE INDEX "pages_blocks_volunteer_c_t_a_foreground_image_idx" ON "pages_blocks_volunteer_c_t_a" USING btree ("foreground_image_id");
  CREATE INDEX "pages_blocks_about_intro_section_slider_images_order_idx" ON "pages_blocks_about_intro_section_slider_images" USING btree ("_order");
  CREATE INDEX "pages_blocks_about_intro_section_slider_images_parent_id_idx" ON "pages_blocks_about_intro_section_slider_images" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_about_intro_section_slider_images_image_idx" ON "pages_blocks_about_intro_section_slider_images" USING btree ("image_id");
  CREATE INDEX "pages_blocks_about_intro_section_order_idx" ON "pages_blocks_about_intro_section" USING btree ("_order");
  CREATE INDEX "pages_blocks_about_intro_section_parent_id_idx" ON "pages_blocks_about_intro_section" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_about_intro_section_path_idx" ON "pages_blocks_about_intro_section" USING btree ("_path");
  CREATE INDEX "pages_blocks_vision_mission_order_idx" ON "pages_blocks_vision_mission" USING btree ("_order");
  CREATE INDEX "pages_blocks_vision_mission_parent_id_idx" ON "pages_blocks_vision_mission" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_vision_mission_path_idx" ON "pages_blocks_vision_mission" USING btree ("_path");
  CREATE INDEX "pages_blocks_finalctabanner_order_idx" ON "pages_blocks_finalctabanner" USING btree ("_order");
  CREATE INDEX "pages_blocks_finalctabanner_parent_id_idx" ON "pages_blocks_finalctabanner" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_finalctabanner_path_idx" ON "pages_blocks_finalctabanner" USING btree ("_path");
  CREATE INDEX "pages_blocks_finalctabanner_background_image_idx" ON "pages_blocks_finalctabanner" USING btree ("background_image_id");
  CREATE INDEX "pages_blocks_events_and_causes_section_events_order_idx" ON "pages_blocks_events_and_causes_section_events" USING btree ("_order");
  CREATE INDEX "pages_blocks_events_and_causes_section_events_parent_id_idx" ON "pages_blocks_events_and_causes_section_events" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_events_and_causes_section_events_image_idx" ON "pages_blocks_events_and_causes_section_events" USING btree ("image_id");
  CREATE INDEX "pages_blocks_events_and_causes_section_events_read_more__idx" ON "pages_blocks_events_and_causes_section_events" USING btree ("read_more_link_id");
  CREATE INDEX "pages_blocks_events_and_causes_section_causes_order_idx" ON "pages_blocks_events_and_causes_section_causes" USING btree ("_order");
  CREATE INDEX "pages_blocks_events_and_causes_section_causes_parent_id_idx" ON "pages_blocks_events_and_causes_section_causes" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_events_and_causes_section_causes_image_idx" ON "pages_blocks_events_and_causes_section_causes" USING btree ("image_id");
  CREATE INDEX "pages_blocks_events_and_causes_section_order_idx" ON "pages_blocks_events_and_causes_section" USING btree ("_order");
  CREATE INDEX "pages_blocks_events_and_causes_section_parent_id_idx" ON "pages_blocks_events_and_causes_section" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_events_and_causes_section_path_idx" ON "pages_blocks_events_and_causes_section" USING btree ("_path");
  CREATE INDEX "pages_blocks_contact_information_order_idx" ON "pages_blocks_contact_information" USING btree ("_order");
  CREATE INDEX "pages_blocks_contact_information_parent_id_idx" ON "pages_blocks_contact_information" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contact_information_path_idx" ON "pages_blocks_contact_information" USING btree ("_path");
  CREATE INDEX "pages_blocks_faq_contact_c_t_a_order_idx" ON "pages_blocks_faq_contact_c_t_a" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_contact_c_t_a_parent_id_idx" ON "pages_blocks_faq_contact_c_t_a" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_contact_c_t_a_path_idx" ON "pages_blocks_faq_contact_c_t_a" USING btree ("_path");
  CREATE INDEX "pages_blocks_faq_contact_c_t_a_background_image_idx" ON "pages_blocks_faq_contact_c_t_a" USING btree ("background_image_id");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_seo_seo_og_image_idx" ON "pages" USING btree ("seo_og_image_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_campaigns_id_idx" ON "pages_rels" USING btree ("campaigns_id");
  CREATE INDEX "pages_rels_projects_id_idx" ON "pages_rels" USING btree ("projects_id");
  CREATE INDEX "pages_rels_testimonials_id_idx" ON "pages_rels" USING btree ("testimonials_id");
  CREATE INDEX "_pages_v_blocks_hero_slides_order_idx" ON "_pages_v_blocks_hero_slides" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_slides_parent_id_idx" ON "_pages_v_blocks_hero_slides" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_slides_background_image_idx" ON "_pages_v_blocks_hero_slides" USING btree ("background_image_id");
  CREATE INDEX "_pages_v_blocks_hero_order_idx" ON "_pages_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_parent_id_idx" ON "_pages_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_path_idx" ON "_pages_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_page_header_crumbs_order_idx" ON "_pages_v_blocks_page_header_crumbs" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_page_header_crumbs_parent_id_idx" ON "_pages_v_blocks_page_header_crumbs" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_page_header_order_idx" ON "_pages_v_blocks_page_header" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_page_header_parent_id_idx" ON "_pages_v_blocks_page_header" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_page_header_path_idx" ON "_pages_v_blocks_page_header" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_page_header_image_idx" ON "_pages_v_blocks_page_header" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_stats_bar_stats_order_idx" ON "_pages_v_blocks_stats_bar_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_bar_stats_parent_id_idx" ON "_pages_v_blocks_stats_bar_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_bar_order_idx" ON "_pages_v_blocks_stats_bar" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_bar_parent_id_idx" ON "_pages_v_blocks_stats_bar" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_bar_path_idx" ON "_pages_v_blocks_stats_bar" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_about_strip_paragraphs_order_idx" ON "_pages_v_blocks_about_strip_paragraphs" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_about_strip_paragraphs_parent_id_idx" ON "_pages_v_blocks_about_strip_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_about_strip_order_idx" ON "_pages_v_blocks_about_strip" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_about_strip_parent_id_idx" ON "_pages_v_blocks_about_strip" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_about_strip_path_idx" ON "_pages_v_blocks_about_strip" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_about_strip_image_idx" ON "_pages_v_blocks_about_strip" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_category_grid_order_idx" ON "_pages_v_blocks_category_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_category_grid_parent_id_idx" ON "_pages_v_blocks_category_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_category_grid_path_idx" ON "_pages_v_blocks_category_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_featured_campaigns_order_idx" ON "_pages_v_blocks_featured_campaigns" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_featured_campaigns_parent_id_idx" ON "_pages_v_blocks_featured_campaigns" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_featured_campaigns_path_idx" ON "_pages_v_blocks_featured_campaigns" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_featured_projects_order_idx" ON "_pages_v_blocks_featured_projects" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_featured_projects_parent_id_idx" ON "_pages_v_blocks_featured_projects" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_featured_projects_path_idx" ON "_pages_v_blocks_featured_projects" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_how_you_can_help_options_order_idx" ON "_pages_v_blocks_how_you_can_help_options" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_how_you_can_help_options_parent_id_idx" ON "_pages_v_blocks_how_you_can_help_options" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_how_you_can_help_options_icon_idx" ON "_pages_v_blocks_how_you_can_help_options" USING btree ("icon_id");
  CREATE INDEX "_pages_v_blocks_how_you_can_help_order_idx" ON "_pages_v_blocks_how_you_can_help" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_how_you_can_help_parent_id_idx" ON "_pages_v_blocks_how_you_can_help" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_how_you_can_help_path_idx" ON "_pages_v_blocks_how_you_can_help" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_testimonial_carousel_order_idx" ON "_pages_v_blocks_testimonial_carousel" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonial_carousel_parent_id_idx" ON "_pages_v_blocks_testimonial_carousel" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonial_carousel_path_idx" ON "_pages_v_blocks_testimonial_carousel" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_media_grid_filter_by_type_order_idx" ON "_pages_v_blocks_media_grid_filter_by_type" USING btree ("order");
  CREATE INDEX "_pages_v_blocks_media_grid_filter_by_type_parent_idx" ON "_pages_v_blocks_media_grid_filter_by_type" USING btree ("parent_id");
  CREATE INDEX "_pages_v_blocks_media_grid_order_idx" ON "_pages_v_blocks_media_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_media_grid_parent_id_idx" ON "_pages_v_blocks_media_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_media_grid_path_idx" ON "_pages_v_blocks_media_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_trust_strip_badges_order_idx" ON "_pages_v_blocks_trust_strip_badges" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_trust_strip_badges_parent_id_idx" ON "_pages_v_blocks_trust_strip_badges" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_trust_strip_logos_order_idx" ON "_pages_v_blocks_trust_strip_logos" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_trust_strip_logos_parent_id_idx" ON "_pages_v_blocks_trust_strip_logos" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_trust_strip_logos_logo_idx" ON "_pages_v_blocks_trust_strip_logos" USING btree ("logo_id");
  CREATE INDEX "_pages_v_blocks_trust_strip_order_idx" ON "_pages_v_blocks_trust_strip" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_trust_strip_parent_id_idx" ON "_pages_v_blocks_trust_strip" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_trust_strip_path_idx" ON "_pages_v_blocks_trust_strip" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_cta_band_trust_badges_order_idx" ON "_pages_v_blocks_cta_band_trust_badges" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_band_trust_badges_parent_id_idx" ON "_pages_v_blocks_cta_band_trust_badges" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_band_order_idx" ON "_pages_v_blocks_cta_band" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_band_parent_id_idx" ON "_pages_v_blocks_cta_band" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_band_path_idx" ON "_pages_v_blocks_cta_band" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_cta_band_qr_image_idx" ON "_pages_v_blocks_cta_band" USING btree ("qr_image_id");
  CREATE INDEX "_pages_v_blocks_rich_text_order_idx" ON "_pages_v_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_rich_text_parent_id_idx" ON "_pages_v_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_rich_text_path_idx" ON "_pages_v_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_rich_text_button_page_idx" ON "_pages_v_blocks_rich_text" USING btree ("button_page_id");
  CREATE INDEX "_pages_v_blocks_team_grid_order_idx" ON "_pages_v_blocks_team_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_team_grid_parent_id_idx" ON "_pages_v_blocks_team_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_team_grid_path_idx" ON "_pages_v_blocks_team_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_timeline_milestones_order_idx" ON "_pages_v_blocks_timeline_milestones" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_timeline_milestones_parent_id_idx" ON "_pages_v_blocks_timeline_milestones" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_timeline_order_idx" ON "_pages_v_blocks_timeline" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_timeline_parent_id_idx" ON "_pages_v_blocks_timeline" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_timeline_path_idx" ON "_pages_v_blocks_timeline" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_faq_accordion_faqs_order_idx" ON "_pages_v_blocks_faq_accordion_faqs" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_accordion_faqs_parent_id_idx" ON "_pages_v_blocks_faq_accordion_faqs" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_accordion_order_idx" ON "_pages_v_blocks_faq_accordion" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_accordion_parent_id_idx" ON "_pages_v_blocks_faq_accordion" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_accordion_path_idx" ON "_pages_v_blocks_faq_accordion" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_form_block_fields_options_order_idx" ON "_pages_v_blocks_form_block_fields_options" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_form_block_fields_options_parent_id_idx" ON "_pages_v_blocks_form_block_fields_options" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_form_block_fields_order_idx" ON "_pages_v_blocks_form_block_fields" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_form_block_fields_parent_id_idx" ON "_pages_v_blocks_form_block_fields" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_form_block_order_idx" ON "_pages_v_blocks_form_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_form_block_parent_id_idx" ON "_pages_v_blocks_form_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_form_block_path_idx" ON "_pages_v_blocks_form_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_image_gallery_images_order_idx" ON "_pages_v_blocks_image_gallery_images" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_image_gallery_images_parent_id_idx" ON "_pages_v_blocks_image_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_image_gallery_images_image_idx" ON "_pages_v_blocks_image_gallery_images" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_image_gallery_order_idx" ON "_pages_v_blocks_image_gallery" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_image_gallery_parent_id_idx" ON "_pages_v_blocks_image_gallery" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_image_gallery_path_idx" ON "_pages_v_blocks_image_gallery" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_video_embed_order_idx" ON "_pages_v_blocks_video_embed" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_video_embed_parent_id_idx" ON "_pages_v_blocks_video_embed" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_video_embed_path_idx" ON "_pages_v_blocks_video_embed" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_map_contact_order_idx" ON "_pages_v_blocks_map_contact" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_map_contact_parent_id_idx" ON "_pages_v_blocks_map_contact" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_map_contact_path_idx" ON "_pages_v_blocks_map_contact" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_map_contact_map_image_idx" ON "_pages_v_blocks_map_contact" USING btree ("map_image_id");
  CREATE INDEX "_pages_v_blocks_feature_cards_cards_order_idx" ON "_pages_v_blocks_feature_cards_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_feature_cards_cards_parent_id_idx" ON "_pages_v_blocks_feature_cards_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_cards_cards_icon_idx" ON "_pages_v_blocks_feature_cards_cards" USING btree ("icon_id");
  CREATE INDEX "_pages_v_blocks_feature_cards_order_idx" ON "_pages_v_blocks_feature_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_feature_cards_parent_id_idx" ON "_pages_v_blocks_feature_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_cards_path_idx" ON "_pages_v_blocks_feature_cards" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_feature_cards_download_cta_download_cta__idx" ON "_pages_v_blocks_feature_cards" USING btree ("download_cta_file_id");
  CREATE INDEX "_pages_v_blocks_home_intro_section_featured_project_images_order_idx" ON "_pages_v_blocks_home_intro_section_featured_project_images" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_home_intro_section_featured_project_images_parent_id_idx" ON "_pages_v_blocks_home_intro_section_featured_project_images" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_home_intro_section_featured_project_imag_idx" ON "_pages_v_blocks_home_intro_section_featured_project_images" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_home_intro_section_get_involved_items_order_idx" ON "_pages_v_blocks_home_intro_section_get_involved_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_home_intro_section_get_involved_items_parent_id_idx" ON "_pages_v_blocks_home_intro_section_get_involved_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_home_intro_section_get_involved_items_ic_idx" ON "_pages_v_blocks_home_intro_section_get_involved_items" USING btree ("icon_id");
  CREATE INDEX "_pages_v_blocks_home_intro_section_order_idx" ON "_pages_v_blocks_home_intro_section" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_home_intro_section_parent_id_idx" ON "_pages_v_blocks_home_intro_section" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_home_intro_section_path_idx" ON "_pages_v_blocks_home_intro_section" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_why_o_d_h_foundation_features_order_idx" ON "_pages_v_blocks_why_o_d_h_foundation_features" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_why_o_d_h_foundation_features_parent_id_idx" ON "_pages_v_blocks_why_o_d_h_foundation_features" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_why_o_d_h_foundation_features_icon_idx" ON "_pages_v_blocks_why_o_d_h_foundation_features" USING btree ("icon_id");
  CREATE INDEX "_pages_v_blocks_why_o_d_h_foundation_order_idx" ON "_pages_v_blocks_why_o_d_h_foundation" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_why_o_d_h_foundation_parent_id_idx" ON "_pages_v_blocks_why_o_d_h_foundation" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_why_o_d_h_foundation_path_idx" ON "_pages_v_blocks_why_o_d_h_foundation" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_our_causes_causes_order_idx" ON "_pages_v_blocks_our_causes_causes" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_our_causes_causes_parent_id_idx" ON "_pages_v_blocks_our_causes_causes" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_our_causes_causes_image_idx" ON "_pages_v_blocks_our_causes_causes" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_our_causes_order_idx" ON "_pages_v_blocks_our_causes" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_our_causes_parent_id_idx" ON "_pages_v_blocks_our_causes" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_our_causes_path_idx" ON "_pages_v_blocks_our_causes" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_volunteer_c_t_a_order_idx" ON "_pages_v_blocks_volunteer_c_t_a" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_volunteer_c_t_a_parent_id_idx" ON "_pages_v_blocks_volunteer_c_t_a" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_volunteer_c_t_a_path_idx" ON "_pages_v_blocks_volunteer_c_t_a" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_volunteer_c_t_a_background_image_idx" ON "_pages_v_blocks_volunteer_c_t_a" USING btree ("background_image_id");
  CREATE INDEX "_pages_v_blocks_volunteer_c_t_a_foreground_image_idx" ON "_pages_v_blocks_volunteer_c_t_a" USING btree ("foreground_image_id");
  CREATE INDEX "_pages_v_blocks_about_intro_section_slider_images_order_idx" ON "_pages_v_blocks_about_intro_section_slider_images" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_about_intro_section_slider_images_parent_id_idx" ON "_pages_v_blocks_about_intro_section_slider_images" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_about_intro_section_slider_images_image_idx" ON "_pages_v_blocks_about_intro_section_slider_images" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_about_intro_section_order_idx" ON "_pages_v_blocks_about_intro_section" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_about_intro_section_parent_id_idx" ON "_pages_v_blocks_about_intro_section" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_about_intro_section_path_idx" ON "_pages_v_blocks_about_intro_section" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_vision_mission_order_idx" ON "_pages_v_blocks_vision_mission" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_vision_mission_parent_id_idx" ON "_pages_v_blocks_vision_mission" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_vision_mission_path_idx" ON "_pages_v_blocks_vision_mission" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_finalctabanner_order_idx" ON "_pages_v_blocks_finalctabanner" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_finalctabanner_parent_id_idx" ON "_pages_v_blocks_finalctabanner" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_finalctabanner_path_idx" ON "_pages_v_blocks_finalctabanner" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_finalctabanner_background_image_idx" ON "_pages_v_blocks_finalctabanner" USING btree ("background_image_id");
  CREATE INDEX "_pages_v_blocks_events_and_causes_section_events_order_idx" ON "_pages_v_blocks_events_and_causes_section_events" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_events_and_causes_section_events_parent_id_idx" ON "_pages_v_blocks_events_and_causes_section_events" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_events_and_causes_section_events_image_idx" ON "_pages_v_blocks_events_and_causes_section_events" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_events_and_causes_section_events_read_mo_idx" ON "_pages_v_blocks_events_and_causes_section_events" USING btree ("read_more_link_id");
  CREATE INDEX "_pages_v_blocks_events_and_causes_section_causes_order_idx" ON "_pages_v_blocks_events_and_causes_section_causes" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_events_and_causes_section_causes_parent_id_idx" ON "_pages_v_blocks_events_and_causes_section_causes" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_events_and_causes_section_causes_image_idx" ON "_pages_v_blocks_events_and_causes_section_causes" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_events_and_causes_section_order_idx" ON "_pages_v_blocks_events_and_causes_section" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_events_and_causes_section_parent_id_idx" ON "_pages_v_blocks_events_and_causes_section" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_events_and_causes_section_path_idx" ON "_pages_v_blocks_events_and_causes_section" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_contact_information_order_idx" ON "_pages_v_blocks_contact_information" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_contact_information_parent_id_idx" ON "_pages_v_blocks_contact_information" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_contact_information_path_idx" ON "_pages_v_blocks_contact_information" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_faq_contact_c_t_a_order_idx" ON "_pages_v_blocks_faq_contact_c_t_a" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_contact_c_t_a_parent_id_idx" ON "_pages_v_blocks_faq_contact_c_t_a" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_contact_c_t_a_path_idx" ON "_pages_v_blocks_faq_contact_c_t_a" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_faq_contact_c_t_a_background_image_idx" ON "_pages_v_blocks_faq_contact_c_t_a" USING btree ("background_image_id");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_seo_version_seo_og_image_idx" ON "_pages_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_rels_order_idx" ON "_pages_v_rels" USING btree ("order");
  CREATE INDEX "_pages_v_rels_parent_idx" ON "_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_pages_v_rels_path_idx" ON "_pages_v_rels" USING btree ("path");
  CREATE INDEX "_pages_v_rels_campaigns_id_idx" ON "_pages_v_rels" USING btree ("campaigns_id");
  CREATE INDEX "_pages_v_rels_projects_id_idx" ON "_pages_v_rels" USING btree ("projects_id");
  CREATE INDEX "_pages_v_rels_testimonials_id_idx" ON "_pages_v_rels" USING btree ("testimonials_id");
  CREATE INDEX "project_categories_crumbs_order_idx" ON "project_categories_crumbs" USING btree ("_order");
  CREATE INDEX "project_categories_crumbs_parent_id_idx" ON "project_categories_crumbs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "project_categories_slug_idx" ON "project_categories" USING btree ("slug");
  CREATE INDEX "project_categories_icon_idx" ON "project_categories" USING btree ("icon_id");
  CREATE INDEX "project_categories_hero_image_idx" ON "project_categories" USING btree ("hero_image_id");
  CREATE INDEX "project_categories_seo_seo_og_image_idx" ON "project_categories" USING btree ("seo_og_image_id");
  CREATE INDEX "project_categories_updated_at_idx" ON "project_categories" USING btree ("updated_at");
  CREATE INDEX "project_categories_created_at_idx" ON "project_categories" USING btree ("created_at");
  CREATE INDEX "project_categories__status_idx" ON "project_categories" USING btree ("_status");
  CREATE INDEX "_project_categories_v_version_crumbs_order_idx" ON "_project_categories_v_version_crumbs" USING btree ("_order");
  CREATE INDEX "_project_categories_v_version_crumbs_parent_id_idx" ON "_project_categories_v_version_crumbs" USING btree ("_parent_id");
  CREATE INDEX "_project_categories_v_parent_idx" ON "_project_categories_v" USING btree ("parent_id");
  CREATE INDEX "_project_categories_v_version_version_slug_idx" ON "_project_categories_v" USING btree ("version_slug");
  CREATE INDEX "_project_categories_v_version_version_icon_idx" ON "_project_categories_v" USING btree ("version_icon_id");
  CREATE INDEX "_project_categories_v_version_version_hero_image_idx" ON "_project_categories_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_project_categories_v_version_seo_version_seo_og_image_idx" ON "_project_categories_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_project_categories_v_version_version_updated_at_idx" ON "_project_categories_v" USING btree ("version_updated_at");
  CREATE INDEX "_project_categories_v_version_version_created_at_idx" ON "_project_categories_v" USING btree ("version_created_at");
  CREATE INDEX "_project_categories_v_version_version__status_idx" ON "_project_categories_v" USING btree ("version__status");
  CREATE INDEX "_project_categories_v_created_at_idx" ON "_project_categories_v" USING btree ("created_at");
  CREATE INDEX "_project_categories_v_updated_at_idx" ON "_project_categories_v" USING btree ("updated_at");
  CREATE INDEX "_project_categories_v_latest_idx" ON "_project_categories_v" USING btree ("latest");
  CREATE INDEX "projects_impact_stats_order_idx" ON "projects_impact_stats" USING btree ("_order");
  CREATE INDEX "projects_impact_stats_parent_id_idx" ON "projects_impact_stats" USING btree ("_parent_id");
  CREATE INDEX "projects_gallery_order_idx" ON "projects_gallery" USING btree ("_order");
  CREATE INDEX "projects_gallery_parent_id_idx" ON "projects_gallery" USING btree ("_parent_id");
  CREATE INDEX "projects_gallery_image_idx" ON "projects_gallery" USING btree ("image_id");
  CREATE INDEX "projects_partners_order_idx" ON "projects_partners" USING btree ("_order");
  CREATE INDEX "projects_partners_parent_id_idx" ON "projects_partners" USING btree ("_parent_id");
  CREATE INDEX "projects_partners_logo_idx" ON "projects_partners" USING btree ("logo_id");
  CREATE UNIQUE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");
  CREATE INDEX "projects_category_idx" ON "projects" USING btree ("category_id");
  CREATE INDEX "projects_hero_image_idx" ON "projects" USING btree ("hero_image_id");
  CREATE INDEX "projects_seo_seo_og_image_idx" ON "projects" USING btree ("seo_og_image_id");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE INDEX "projects__status_idx" ON "projects" USING btree ("_status");
  CREATE INDEX "_projects_v_version_impact_stats_order_idx" ON "_projects_v_version_impact_stats" USING btree ("_order");
  CREATE INDEX "_projects_v_version_impact_stats_parent_id_idx" ON "_projects_v_version_impact_stats" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_gallery_order_idx" ON "_projects_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_projects_v_version_gallery_parent_id_idx" ON "_projects_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_gallery_image_idx" ON "_projects_v_version_gallery" USING btree ("image_id");
  CREATE INDEX "_projects_v_version_partners_order_idx" ON "_projects_v_version_partners" USING btree ("_order");
  CREATE INDEX "_projects_v_version_partners_parent_id_idx" ON "_projects_v_version_partners" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_partners_logo_idx" ON "_projects_v_version_partners" USING btree ("logo_id");
  CREATE INDEX "_projects_v_parent_idx" ON "_projects_v" USING btree ("parent_id");
  CREATE INDEX "_projects_v_version_version_slug_idx" ON "_projects_v" USING btree ("version_slug");
  CREATE INDEX "_projects_v_version_version_category_idx" ON "_projects_v" USING btree ("version_category_id");
  CREATE INDEX "_projects_v_version_version_hero_image_idx" ON "_projects_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_projects_v_version_seo_version_seo_og_image_idx" ON "_projects_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_projects_v_version_version_updated_at_idx" ON "_projects_v" USING btree ("version_updated_at");
  CREATE INDEX "_projects_v_version_version_created_at_idx" ON "_projects_v" USING btree ("version_created_at");
  CREATE INDEX "_projects_v_version_version__status_idx" ON "_projects_v" USING btree ("version__status");
  CREATE INDEX "_projects_v_created_at_idx" ON "_projects_v" USING btree ("created_at");
  CREATE INDEX "_projects_v_updated_at_idx" ON "_projects_v" USING btree ("updated_at");
  CREATE INDEX "_projects_v_latest_idx" ON "_projects_v" USING btree ("latest");
  CREATE INDEX "team_members_photo_idx" ON "team_members" USING btree ("photo_id");
  CREATE INDEX "team_members_updated_at_idx" ON "team_members" USING btree ("updated_at");
  CREATE INDEX "team_members_created_at_idx" ON "team_members" USING btree ("created_at");
  CREATE INDEX "team_members__status_idx" ON "team_members" USING btree ("_status");
  CREATE INDEX "_team_members_v_parent_idx" ON "_team_members_v" USING btree ("parent_id");
  CREATE INDEX "_team_members_v_version_version_photo_idx" ON "_team_members_v" USING btree ("version_photo_id");
  CREATE INDEX "_team_members_v_version_version_updated_at_idx" ON "_team_members_v" USING btree ("version_updated_at");
  CREATE INDEX "_team_members_v_version_version_created_at_idx" ON "_team_members_v" USING btree ("version_created_at");
  CREATE INDEX "_team_members_v_version_version__status_idx" ON "_team_members_v" USING btree ("version__status");
  CREATE INDEX "_team_members_v_created_at_idx" ON "_team_members_v" USING btree ("created_at");
  CREATE INDEX "_team_members_v_updated_at_idx" ON "_team_members_v" USING btree ("updated_at");
  CREATE INDEX "_team_members_v_latest_idx" ON "_team_members_v" USING btree ("latest");
  CREATE INDEX "testimonials_photo_idx" ON "testimonials" USING btree ("photo_id");
  CREATE INDEX "testimonials_related_project_idx" ON "testimonials" USING btree ("related_project_id");
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  CREATE INDEX "testimonials__status_idx" ON "testimonials" USING btree ("_status");
  CREATE INDEX "_testimonials_v_parent_idx" ON "_testimonials_v" USING btree ("parent_id");
  CREATE INDEX "_testimonials_v_version_version_photo_idx" ON "_testimonials_v" USING btree ("version_photo_id");
  CREATE INDEX "_testimonials_v_version_version_related_project_idx" ON "_testimonials_v" USING btree ("version_related_project_id");
  CREATE INDEX "_testimonials_v_version_version_updated_at_idx" ON "_testimonials_v" USING btree ("version_updated_at");
  CREATE INDEX "_testimonials_v_version_version_created_at_idx" ON "_testimonials_v" USING btree ("version_created_at");
  CREATE INDEX "_testimonials_v_version_version__status_idx" ON "_testimonials_v" USING btree ("version__status");
  CREATE INDEX "_testimonials_v_created_at_idx" ON "_testimonials_v" USING btree ("created_at");
  CREATE INDEX "_testimonials_v_updated_at_idx" ON "_testimonials_v" USING btree ("updated_at");
  CREATE INDEX "_testimonials_v_latest_idx" ON "_testimonials_v" USING btree ("latest");
  CREATE INDEX "campaigns_crumbs_order_idx" ON "campaigns_crumbs" USING btree ("_order");
  CREATE INDEX "campaigns_crumbs_parent_id_idx" ON "campaigns_crumbs" USING btree ("_parent_id");
  CREATE INDEX "campaigns_faqs_order_idx" ON "campaigns_faqs" USING btree ("_order");
  CREATE INDEX "campaigns_faqs_parent_id_idx" ON "campaigns_faqs" USING btree ("_parent_id");
  CREATE INDEX "campaigns_gallery_order_idx" ON "campaigns_gallery" USING btree ("_order");
  CREATE INDEX "campaigns_gallery_parent_id_idx" ON "campaigns_gallery" USING btree ("_parent_id");
  CREATE INDEX "campaigns_gallery_image_idx" ON "campaigns_gallery" USING btree ("image_id");
  CREATE UNIQUE INDEX "campaigns_slug_idx" ON "campaigns" USING btree ("slug");
  CREATE INDEX "campaigns_hero_image_idx" ON "campaigns" USING btree ("hero_image_id");
  CREATE INDEX "campaigns_seo_seo_og_image_idx" ON "campaigns" USING btree ("seo_og_image_id");
  CREATE INDEX "campaigns_updated_at_idx" ON "campaigns" USING btree ("updated_at");
  CREATE INDEX "campaigns_created_at_idx" ON "campaigns" USING btree ("created_at");
  CREATE INDEX "campaigns__status_idx" ON "campaigns" USING btree ("_status");
  CREATE INDEX "_campaigns_v_version_crumbs_order_idx" ON "_campaigns_v_version_crumbs" USING btree ("_order");
  CREATE INDEX "_campaigns_v_version_crumbs_parent_id_idx" ON "_campaigns_v_version_crumbs" USING btree ("_parent_id");
  CREATE INDEX "_campaigns_v_version_faqs_order_idx" ON "_campaigns_v_version_faqs" USING btree ("_order");
  CREATE INDEX "_campaigns_v_version_faqs_parent_id_idx" ON "_campaigns_v_version_faqs" USING btree ("_parent_id");
  CREATE INDEX "_campaigns_v_version_gallery_order_idx" ON "_campaigns_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_campaigns_v_version_gallery_parent_id_idx" ON "_campaigns_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_campaigns_v_version_gallery_image_idx" ON "_campaigns_v_version_gallery" USING btree ("image_id");
  CREATE INDEX "_campaigns_v_parent_idx" ON "_campaigns_v" USING btree ("parent_id");
  CREATE INDEX "_campaigns_v_version_version_slug_idx" ON "_campaigns_v" USING btree ("version_slug");
  CREATE INDEX "_campaigns_v_version_version_hero_image_idx" ON "_campaigns_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_campaigns_v_version_seo_version_seo_og_image_idx" ON "_campaigns_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_campaigns_v_version_version_updated_at_idx" ON "_campaigns_v" USING btree ("version_updated_at");
  CREATE INDEX "_campaigns_v_version_version_created_at_idx" ON "_campaigns_v" USING btree ("version_created_at");
  CREATE INDEX "_campaigns_v_version_version__status_idx" ON "_campaigns_v" USING btree ("version__status");
  CREATE INDEX "_campaigns_v_created_at_idx" ON "_campaigns_v" USING btree ("created_at");
  CREATE INDEX "_campaigns_v_updated_at_idx" ON "_campaigns_v" USING btree ("updated_at");
  CREATE INDEX "_campaigns_v_latest_idx" ON "_campaigns_v" USING btree ("latest");
  CREATE INDEX "media_posts_gallery_images_order_idx" ON "media_posts_gallery_images" USING btree ("_order");
  CREATE INDEX "media_posts_gallery_images_parent_id_idx" ON "media_posts_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "media_posts_gallery_images_image_idx" ON "media_posts_gallery_images" USING btree ("image_id");
  CREATE INDEX "media_posts_tags_order_idx" ON "media_posts_tags" USING btree ("_order");
  CREATE INDEX "media_posts_tags_parent_id_idx" ON "media_posts_tags" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "media_posts_slug_idx" ON "media_posts" USING btree ("slug");
  CREATE INDEX "media_posts_author_idx" ON "media_posts" USING btree ("author_id");
  CREATE INDEX "media_posts_hero_image_idx" ON "media_posts" USING btree ("hero_image_id");
  CREATE INDEX "media_posts_seo_seo_og_image_idx" ON "media_posts" USING btree ("seo_og_image_id");
  CREATE INDEX "media_posts_updated_at_idx" ON "media_posts" USING btree ("updated_at");
  CREATE INDEX "media_posts_created_at_idx" ON "media_posts" USING btree ("created_at");
  CREATE INDEX "media_posts__status_idx" ON "media_posts" USING btree ("_status");
  CREATE INDEX "_media_posts_v_version_gallery_images_order_idx" ON "_media_posts_v_version_gallery_images" USING btree ("_order");
  CREATE INDEX "_media_posts_v_version_gallery_images_parent_id_idx" ON "_media_posts_v_version_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "_media_posts_v_version_gallery_images_image_idx" ON "_media_posts_v_version_gallery_images" USING btree ("image_id");
  CREATE INDEX "_media_posts_v_version_tags_order_idx" ON "_media_posts_v_version_tags" USING btree ("_order");
  CREATE INDEX "_media_posts_v_version_tags_parent_id_idx" ON "_media_posts_v_version_tags" USING btree ("_parent_id");
  CREATE INDEX "_media_posts_v_parent_idx" ON "_media_posts_v" USING btree ("parent_id");
  CREATE INDEX "_media_posts_v_version_version_slug_idx" ON "_media_posts_v" USING btree ("version_slug");
  CREATE INDEX "_media_posts_v_version_version_author_idx" ON "_media_posts_v" USING btree ("version_author_id");
  CREATE INDEX "_media_posts_v_version_version_hero_image_idx" ON "_media_posts_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_media_posts_v_version_seo_version_seo_og_image_idx" ON "_media_posts_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_media_posts_v_version_version_updated_at_idx" ON "_media_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_media_posts_v_version_version_created_at_idx" ON "_media_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_media_posts_v_version_version__status_idx" ON "_media_posts_v" USING btree ("version__status");
  CREATE INDEX "_media_posts_v_created_at_idx" ON "_media_posts_v" USING btree ("created_at");
  CREATE INDEX "_media_posts_v_updated_at_idx" ON "_media_posts_v" USING btree ("updated_at");
  CREATE INDEX "_media_posts_v_latest_idx" ON "_media_posts_v" USING btree ("latest");
  CREATE UNIQUE INDEX "careers_slug_idx" ON "careers" USING btree ("slug");
  CREATE INDEX "careers_seo_seo_og_image_idx" ON "careers" USING btree ("seo_og_image_id");
  CREATE INDEX "careers_updated_at_idx" ON "careers" USING btree ("updated_at");
  CREATE INDEX "careers_created_at_idx" ON "careers" USING btree ("created_at");
  CREATE INDEX "careers__status_idx" ON "careers" USING btree ("_status");
  CREATE INDEX "_careers_v_parent_idx" ON "_careers_v" USING btree ("parent_id");
  CREATE INDEX "_careers_v_version_version_slug_idx" ON "_careers_v" USING btree ("version_slug");
  CREATE INDEX "_careers_v_version_seo_version_seo_og_image_idx" ON "_careers_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_careers_v_version_version_updated_at_idx" ON "_careers_v" USING btree ("version_updated_at");
  CREATE INDEX "_careers_v_version_version_created_at_idx" ON "_careers_v" USING btree ("version_created_at");
  CREATE INDEX "_careers_v_version_version__status_idx" ON "_careers_v" USING btree ("version__status");
  CREATE INDEX "_careers_v_created_at_idx" ON "_careers_v" USING btree ("created_at");
  CREATE INDEX "_careers_v_updated_at_idx" ON "_careers_v" USING btree ("updated_at");
  CREATE INDEX "_careers_v_latest_idx" ON "_careers_v" USING btree ("latest");
  CREATE INDEX "donations_campaign_idx" ON "donations" USING btree ("campaign_id");
  CREATE INDEX "donations_project_idx" ON "donations" USING btree ("project_id");
  CREATE UNIQUE INDEX "donations_gateway_txn_id_idx" ON "donations" USING btree ("gateway_txn_id");
  CREATE UNIQUE INDEX "donations_receipt_number_idx" ON "donations" USING btree ("receipt_number");
  CREATE INDEX "donations_updated_at_idx" ON "donations" USING btree ("updated_at");
  CREATE INDEX "donations_created_at_idx" ON "donations" USING btree ("created_at");
  CREATE UNIQUE INDEX "subscriptions_gateway_subscription_id_idx" ON "subscriptions" USING btree ("gateway_subscription_id");
  CREATE UNIQUE INDEX "subscriptions_cancel_token_idx" ON "subscriptions" USING btree ("cancel_token");
  CREATE INDEX "subscriptions_updated_at_idx" ON "subscriptions" USING btree ("updated_at");
  CREATE INDEX "subscriptions_created_at_idx" ON "subscriptions" USING btree ("created_at");
  CREATE INDEX "form_submissions_files_order_idx" ON "form_submissions_files" USING btree ("_order");
  CREATE INDEX "form_submissions_files_parent_id_idx" ON "form_submissions_files" USING btree ("_parent_id");
  CREATE INDEX "form_submissions_files_file_idx" ON "form_submissions_files" USING btree ("file_id");
  CREATE INDEX "form_submissions_page_idx" ON "form_submissions" USING btree ("page_id");
  CREATE INDEX "form_submissions_updated_at_idx" ON "form_submissions" USING btree ("updated_at");
  CREATE INDEX "form_submissions_created_at_idx" ON "form_submissions" USING btree ("created_at");
  CREATE UNIQUE INDEX "redirects_from_idx" ON "redirects" USING btree ("from");
  CREATE INDEX "redirects_updated_at_idx" ON "redirects" USING btree ("updated_at");
  CREATE INDEX "redirects_created_at_idx" ON "redirects" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_graphics_id_idx" ON "payload_locked_documents_rels" USING btree ("graphics_id");
  CREATE INDEX "payload_locked_documents_rels_documents_id_idx" ON "payload_locked_documents_rels" USING btree ("documents_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_project_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("project_categories_id");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_team_members_id_idx" ON "payload_locked_documents_rels" USING btree ("team_members_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX "payload_locked_documents_rels_campaigns_id_idx" ON "payload_locked_documents_rels" USING btree ("campaigns_id");
  CREATE INDEX "payload_locked_documents_rels_media_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("media_posts_id");
  CREATE INDEX "payload_locked_documents_rels_careers_id_idx" ON "payload_locked_documents_rels" USING btree ("careers_id");
  CREATE INDEX "payload_locked_documents_rels_donations_id_idx" ON "payload_locked_documents_rels" USING btree ("donations_id");
  CREATE INDEX "payload_locked_documents_rels_subscriptions_id_idx" ON "payload_locked_documents_rels" USING btree ("subscriptions_id");
  CREATE INDEX "payload_locked_documents_rels_form_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("form_submissions_id");
  CREATE INDEX "payload_locked_documents_rels_redirects_id_idx" ON "payload_locked_documents_rels" USING btree ("redirects_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_contact_donation_info_bank_accounts_order_idx" ON "site_settings_contact_donation_info_bank_accounts" USING btree ("_order");
  CREATE INDEX "site_settings_contact_donation_info_bank_accounts_parent_id_idx" ON "site_settings_contact_donation_info_bank_accounts" USING btree ("_parent_id");
  CREATE INDEX "site_settings_contact_donation_info_bank_accounts_bank_l_idx" ON "site_settings_contact_donation_info_bank_accounts" USING btree ("bank_logo_id");
  CREATE INDEX "site_settings_registrations_certificates_order_idx" ON "site_settings_registrations_certificates" USING btree ("_order");
  CREATE INDEX "site_settings_registrations_certificates_parent_id_idx" ON "site_settings_registrations_certificates" USING btree ("_parent_id");
  CREATE INDEX "site_settings_registrations_certificates_file_idx" ON "site_settings_registrations_certificates" USING btree ("file_id");
  CREATE INDEX "site_settings_social_links_order_idx" ON "site_settings_social_links" USING btree ("_order");
  CREATE INDEX "site_settings_social_links_parent_id_idx" ON "site_settings_social_links" USING btree ("_parent_id");
  CREATE INDEX "site_settings_top_header_items_order_idx" ON "site_settings_top_header_items" USING btree ("_order");
  CREATE INDEX "site_settings_top_header_items_parent_id_idx" ON "site_settings_top_header_items" USING btree ("_parent_id");
  CREATE INDEX "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");
  CREATE INDEX "site_settings_logo_light_idx" ON "site_settings" USING btree ("logo_light_id");
  CREATE INDEX "site_settings_favicon_idx" ON "site_settings" USING btree ("favicon_id");
  CREATE INDEX "site_settings_default_og_image_idx" ON "site_settings" USING btree ("default_og_image_id");
  CREATE INDEX "site_settings_contact_contact_qr_code_idx" ON "site_settings" USING btree ("contact_qr_code_id");
  CREATE INDEX "navigation_header_items_children_order_idx" ON "navigation_header_items_children" USING btree ("_order");
  CREATE INDEX "navigation_header_items_children_parent_id_idx" ON "navigation_header_items_children" USING btree ("_parent_id");
  CREATE INDEX "navigation_header_items_order_idx" ON "navigation_header_items" USING btree ("_order");
  CREATE INDEX "navigation_header_items_parent_id_idx" ON "navigation_header_items" USING btree ("_parent_id");
  CREATE INDEX "navigation_footer_columns_links_order_idx" ON "navigation_footer_columns_links" USING btree ("_order");
  CREATE INDEX "navigation_footer_columns_links_parent_id_idx" ON "navigation_footer_columns_links" USING btree ("_parent_id");
  CREATE INDEX "navigation_footer_columns_order_idx" ON "navigation_footer_columns" USING btree ("_order");
  CREATE INDEX "navigation_footer_columns_parent_id_idx" ON "navigation_footer_columns" USING btree ("_parent_id");
  CREATE INDEX "donation_settings_preset_amounts_order_idx" ON "donation_settings_preset_amounts" USING btree ("_order");
  CREATE INDEX "donation_settings_preset_amounts_parent_id_idx" ON "donation_settings_preset_amounts" USING btree ("_parent_id");
  CREATE INDEX "donation_settings_impact_cards_order_idx" ON "donation_settings_impact_cards" USING btree ("_order");
  CREATE INDEX "donation_settings_impact_cards_parent_id_idx" ON "donation_settings_impact_cards" USING btree ("_parent_id");
  CREATE INDEX "donation_settings_impact_cards_icon_idx" ON "donation_settings_impact_cards" USING btree ("icon_id");
  CREATE INDEX "donation_settings_receipt_receipt_signature_image_idx" ON "donation_settings" USING btree ("receipt_signature_image_id");
  CREATE INDEX "donation_settings_upi_qr_idx" ON "donation_settings" USING btree ("upi_qr_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_roles" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "graphics" CASCADE;
  DROP TABLE "documents" CASCADE;
  DROP TABLE "pages_blocks_hero_slides" CASCADE;
  DROP TABLE "pages_blocks_hero" CASCADE;
  DROP TABLE "pages_blocks_page_header_crumbs" CASCADE;
  DROP TABLE "pages_blocks_page_header" CASCADE;
  DROP TABLE "pages_blocks_stats_bar_stats" CASCADE;
  DROP TABLE "pages_blocks_stats_bar" CASCADE;
  DROP TABLE "pages_blocks_about_strip_paragraphs" CASCADE;
  DROP TABLE "pages_blocks_about_strip" CASCADE;
  DROP TABLE "pages_blocks_category_grid" CASCADE;
  DROP TABLE "pages_blocks_featured_campaigns" CASCADE;
  DROP TABLE "pages_blocks_featured_projects" CASCADE;
  DROP TABLE "pages_blocks_how_you_can_help_options" CASCADE;
  DROP TABLE "pages_blocks_how_you_can_help" CASCADE;
  DROP TABLE "pages_blocks_testimonial_carousel" CASCADE;
  DROP TABLE "pages_blocks_media_grid_filter_by_type" CASCADE;
  DROP TABLE "pages_blocks_media_grid" CASCADE;
  DROP TABLE "pages_blocks_trust_strip_badges" CASCADE;
  DROP TABLE "pages_blocks_trust_strip_logos" CASCADE;
  DROP TABLE "pages_blocks_trust_strip" CASCADE;
  DROP TABLE "pages_blocks_cta_band_trust_badges" CASCADE;
  DROP TABLE "pages_blocks_cta_band" CASCADE;
  DROP TABLE "pages_blocks_rich_text" CASCADE;
  DROP TABLE "pages_blocks_team_grid" CASCADE;
  DROP TABLE "pages_blocks_timeline_milestones" CASCADE;
  DROP TABLE "pages_blocks_timeline" CASCADE;
  DROP TABLE "pages_blocks_faq_accordion_faqs" CASCADE;
  DROP TABLE "pages_blocks_faq_accordion" CASCADE;
  DROP TABLE "pages_blocks_form_block_fields_options" CASCADE;
  DROP TABLE "pages_blocks_form_block_fields" CASCADE;
  DROP TABLE "pages_blocks_form_block" CASCADE;
  DROP TABLE "pages_blocks_image_gallery_images" CASCADE;
  DROP TABLE "pages_blocks_image_gallery" CASCADE;
  DROP TABLE "pages_blocks_video_embed" CASCADE;
  DROP TABLE "pages_blocks_map_contact" CASCADE;
  DROP TABLE "pages_blocks_feature_cards_cards" CASCADE;
  DROP TABLE "pages_blocks_feature_cards" CASCADE;
  DROP TABLE "pages_blocks_home_intro_section_featured_project_images" CASCADE;
  DROP TABLE "pages_blocks_home_intro_section_get_involved_items" CASCADE;
  DROP TABLE "pages_blocks_home_intro_section" CASCADE;
  DROP TABLE "pages_blocks_why_o_d_h_foundation_features" CASCADE;
  DROP TABLE "pages_blocks_why_o_d_h_foundation" CASCADE;
  DROP TABLE "pages_blocks_our_causes_causes" CASCADE;
  DROP TABLE "pages_blocks_our_causes" CASCADE;
  DROP TABLE "pages_blocks_volunteer_c_t_a" CASCADE;
  DROP TABLE "pages_blocks_about_intro_section_slider_images" CASCADE;
  DROP TABLE "pages_blocks_about_intro_section" CASCADE;
  DROP TABLE "pages_blocks_vision_mission" CASCADE;
  DROP TABLE "pages_blocks_finalctabanner" CASCADE;
  DROP TABLE "pages_blocks_events_and_causes_section_events" CASCADE;
  DROP TABLE "pages_blocks_events_and_causes_section_causes" CASCADE;
  DROP TABLE "pages_blocks_events_and_causes_section" CASCADE;
  DROP TABLE "pages_blocks_contact_information" CASCADE;
  DROP TABLE "pages_blocks_faq_contact_c_t_a" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_slides" CASCADE;
  DROP TABLE "_pages_v_blocks_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_page_header_crumbs" CASCADE;
  DROP TABLE "_pages_v_blocks_page_header" CASCADE;
  DROP TABLE "_pages_v_blocks_stats_bar_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_stats_bar" CASCADE;
  DROP TABLE "_pages_v_blocks_about_strip_paragraphs" CASCADE;
  DROP TABLE "_pages_v_blocks_about_strip" CASCADE;
  DROP TABLE "_pages_v_blocks_category_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_featured_campaigns" CASCADE;
  DROP TABLE "_pages_v_blocks_featured_projects" CASCADE;
  DROP TABLE "_pages_v_blocks_how_you_can_help_options" CASCADE;
  DROP TABLE "_pages_v_blocks_how_you_can_help" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonial_carousel" CASCADE;
  DROP TABLE "_pages_v_blocks_media_grid_filter_by_type" CASCADE;
  DROP TABLE "_pages_v_blocks_media_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_trust_strip_badges" CASCADE;
  DROP TABLE "_pages_v_blocks_trust_strip_logos" CASCADE;
  DROP TABLE "_pages_v_blocks_trust_strip" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_band_trust_badges" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_band" CASCADE;
  DROP TABLE "_pages_v_blocks_rich_text" CASCADE;
  DROP TABLE "_pages_v_blocks_team_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_timeline_milestones" CASCADE;
  DROP TABLE "_pages_v_blocks_timeline" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_accordion_faqs" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_accordion" CASCADE;
  DROP TABLE "_pages_v_blocks_form_block_fields_options" CASCADE;
  DROP TABLE "_pages_v_blocks_form_block_fields" CASCADE;
  DROP TABLE "_pages_v_blocks_form_block" CASCADE;
  DROP TABLE "_pages_v_blocks_image_gallery_images" CASCADE;
  DROP TABLE "_pages_v_blocks_image_gallery" CASCADE;
  DROP TABLE "_pages_v_blocks_video_embed" CASCADE;
  DROP TABLE "_pages_v_blocks_map_contact" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_cards_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_home_intro_section_featured_project_images" CASCADE;
  DROP TABLE "_pages_v_blocks_home_intro_section_get_involved_items" CASCADE;
  DROP TABLE "_pages_v_blocks_home_intro_section" CASCADE;
  DROP TABLE "_pages_v_blocks_why_o_d_h_foundation_features" CASCADE;
  DROP TABLE "_pages_v_blocks_why_o_d_h_foundation" CASCADE;
  DROP TABLE "_pages_v_blocks_our_causes_causes" CASCADE;
  DROP TABLE "_pages_v_blocks_our_causes" CASCADE;
  DROP TABLE "_pages_v_blocks_volunteer_c_t_a" CASCADE;
  DROP TABLE "_pages_v_blocks_about_intro_section_slider_images" CASCADE;
  DROP TABLE "_pages_v_blocks_about_intro_section" CASCADE;
  DROP TABLE "_pages_v_blocks_vision_mission" CASCADE;
  DROP TABLE "_pages_v_blocks_finalctabanner" CASCADE;
  DROP TABLE "_pages_v_blocks_events_and_causes_section_events" CASCADE;
  DROP TABLE "_pages_v_blocks_events_and_causes_section_causes" CASCADE;
  DROP TABLE "_pages_v_blocks_events_and_causes_section" CASCADE;
  DROP TABLE "_pages_v_blocks_contact_information" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_contact_c_t_a" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_rels" CASCADE;
  DROP TABLE "project_categories_crumbs" CASCADE;
  DROP TABLE "project_categories" CASCADE;
  DROP TABLE "_project_categories_v_version_crumbs" CASCADE;
  DROP TABLE "_project_categories_v" CASCADE;
  DROP TABLE "projects_impact_stats" CASCADE;
  DROP TABLE "projects_gallery" CASCADE;
  DROP TABLE "projects_partners" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "_projects_v_version_impact_stats" CASCADE;
  DROP TABLE "_projects_v_version_gallery" CASCADE;
  DROP TABLE "_projects_v_version_partners" CASCADE;
  DROP TABLE "_projects_v" CASCADE;
  DROP TABLE "team_members" CASCADE;
  DROP TABLE "_team_members_v" CASCADE;
  DROP TABLE "testimonials" CASCADE;
  DROP TABLE "_testimonials_v" CASCADE;
  DROP TABLE "campaigns_crumbs" CASCADE;
  DROP TABLE "campaigns_faqs" CASCADE;
  DROP TABLE "campaigns_gallery" CASCADE;
  DROP TABLE "campaigns" CASCADE;
  DROP TABLE "_campaigns_v_version_crumbs" CASCADE;
  DROP TABLE "_campaigns_v_version_faqs" CASCADE;
  DROP TABLE "_campaigns_v_version_gallery" CASCADE;
  DROP TABLE "_campaigns_v" CASCADE;
  DROP TABLE "media_posts_gallery_images" CASCADE;
  DROP TABLE "media_posts_tags" CASCADE;
  DROP TABLE "media_posts" CASCADE;
  DROP TABLE "_media_posts_v_version_gallery_images" CASCADE;
  DROP TABLE "_media_posts_v_version_tags" CASCADE;
  DROP TABLE "_media_posts_v" CASCADE;
  DROP TABLE "careers" CASCADE;
  DROP TABLE "_careers_v" CASCADE;
  DROP TABLE "donations" CASCADE;
  DROP TABLE "subscriptions" CASCADE;
  DROP TABLE "form_submissions_files" CASCADE;
  DROP TABLE "form_submissions" CASCADE;
  DROP TABLE "redirects" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_contact_donation_info_bank_accounts" CASCADE;
  DROP TABLE "site_settings_registrations_certificates" CASCADE;
  DROP TABLE "site_settings_social_links" CASCADE;
  DROP TABLE "site_settings_top_header_items" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "navigation_header_items_children" CASCADE;
  DROP TABLE "navigation_header_items" CASCADE;
  DROP TABLE "navigation_footer_columns_links" CASCADE;
  DROP TABLE "navigation_footer_columns" CASCADE;
  DROP TABLE "navigation" CASCADE;
  DROP TABLE "donation_settings_preset_amounts" CASCADE;
  DROP TABLE "donation_settings_impact_cards" CASCADE;
  DROP TABLE "donation_settings" CASCADE;
  DROP TYPE "public"."enum_users_roles";
  DROP TYPE "public"."enum_pages_blocks_category_grid_columns";
  DROP TYPE "public"."enum_pages_blocks_featured_campaigns_mode";
  DROP TYPE "public"."enum_pages_blocks_featured_projects_mode";
  DROP TYPE "public"."enum_pages_blocks_testimonial_carousel_mode";
  DROP TYPE "public"."enum_pages_blocks_media_grid_filter_by_type";
  DROP TYPE "public"."enum_pages_blocks_form_block_fields_type";
  DROP TYPE "public"."enum_pages_blocks_form_block_fields_width";
  DROP TYPE "public"."enum_pages_blocks_form_block_form_type";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_blocks_category_grid_columns";
  DROP TYPE "public"."enum__pages_v_blocks_featured_campaigns_mode";
  DROP TYPE "public"."enum__pages_v_blocks_featured_projects_mode";
  DROP TYPE "public"."enum__pages_v_blocks_testimonial_carousel_mode";
  DROP TYPE "public"."enum__pages_v_blocks_media_grid_filter_by_type";
  DROP TYPE "public"."enum__pages_v_blocks_form_block_fields_type";
  DROP TYPE "public"."enum__pages_v_blocks_form_block_fields_width";
  DROP TYPE "public"."enum__pages_v_blocks_form_block_form_type";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum_project_categories_status";
  DROP TYPE "public"."enum__project_categories_v_version_status";
  DROP TYPE "public"."enum_projects_project_status";
  DROP TYPE "public"."enum_projects_status";
  DROP TYPE "public"."enum__projects_v_version_status";
  DROP TYPE "public"."enum_team_members_status";
  DROP TYPE "public"."enum__team_members_v_version_status";
  DROP TYPE "public"."enum_testimonials_status";
  DROP TYPE "public"."enum__testimonials_v_version_status";
  DROP TYPE "public"."enum_campaigns_status";
  DROP TYPE "public"."enum__campaigns_v_version_status";
  DROP TYPE "public"."enum_media_posts_type";
  DROP TYPE "public"."enum_media_posts_status";
  DROP TYPE "public"."enum__media_posts_v_version_type";
  DROP TYPE "public"."enum__media_posts_v_version_status";
  DROP TYPE "public"."enum_careers_type";
  DROP TYPE "public"."enum_careers_status";
  DROP TYPE "public"."enum__careers_v_version_type";
  DROP TYPE "public"."enum__careers_v_version_status";
  DROP TYPE "public"."enum_donations_currency";
  DROP TYPE "public"."enum_donations_frequency";
  DROP TYPE "public"."enum_donations_gateway";
  DROP TYPE "public"."enum_donations_internal_status";
  DROP TYPE "public"."enum_subscriptions_status";
  DROP TYPE "public"."enum_form_submissions_form_type";
  DROP TYPE "public"."enum_form_submissions_status";
  DROP TYPE "public"."enum_redirects_type";
  DROP TYPE "public"."enum_site_settings_social_links_platform";
  DROP TYPE "public"."enum_site_settings_top_header_items_type";
  DROP TYPE "public"."enum_navigation_header_items_style";
  DROP TYPE "public"."enum_donation_settings_gateway_mode";
  DROP TYPE "public"."enum_donation_settings_gateway";`)
}
