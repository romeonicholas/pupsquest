CREATE TABLE "answer_choices" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "answer_choices_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"key" text NOT NULL,
	"display" text NOT NULL,
	"img_path" text NOT NULL,
	CONSTRAINT "answer_choices_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "game_states" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "game_states_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer NOT NULL,
	"current_guesses" integer[] DEFAULT '{}' NOT NULL,
	"hints_remaining" integer DEFAULT 7 NOT NULL,
	"current_score" integer DEFAULT 0 NOT NULL,
	"starting_index" integer DEFAULT 0 NOT NULL,
	"riddle_queue" integer[] NOT NULL,
	"queue_cursor" integer DEFAULT 0 NOT NULL,
	"current_shuffled_choices" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"current_correct_answer_index" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "game_states_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "riddle_analytics" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "riddle_analytics_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"riddle_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"was_answered" boolean DEFAULT false NOT NULL,
	"was_answered_correctly" boolean,
	"hints_used" integer,
	CONSTRAINT "riddle_analytics_check_hints_used_check" CHECK ("riddle_analytics"."hints_used" IS NULL OR "riddle_analytics"."hints_used" >= 0)
);
--> statement-breakpoint
CREATE TABLE "riddle_answer_choices" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "riddle_answer_choices_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"riddle_id" integer NOT NULL,
	"answer_choice_id" integer NOT NULL,
	"slot_index" integer NOT NULL,
	CONSTRAINT "riddle_answer_choices_slot_index_check" CHECK ("riddle_answer_choices"."slot_index" BETWEEN 0 AND 3)
);
--> statement-breakpoint
CREATE TABLE "riddles" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "riddles_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"riddle_key" text NOT NULL,
	"headline" text NOT NULL,
	"body" text[] NOT NULL,
	"answer_details" text NOT NULL,
	"answer_img_path" text NOT NULL,
	CONSTRAINT "riddles_riddle_key_unique" UNIQUE("riddle_key"),
	CONSTRAINT "riddles_body_not_empty" CHECK (cardinality("riddles"."body") > 0)
);
--> statement-breakpoint
CREATE TABLE "user_analytics" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_analytics_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_locally" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_animals" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_animals_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"img_path" text NOT NULL,
	CONSTRAINT "user_animals_name_unique" UNIQUE("name"),
	CONSTRAINT "user_animals_img_path_unique" UNIQUE("img_path")
);
--> statement-breakpoint
CREATE TABLE "user_colors" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_colors_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"hex" text NOT NULL,
	CONSTRAINT "user_colors_name_unique" UNIQUE("name"),
	CONSTRAINT "user_colors_hex_unique" UNIQUE("hex")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_animal" integer NOT NULL,
	"user_color" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"scores" integer[] DEFAULT '{}' NOT NULL,
	"has_viewed_exit_panel" boolean DEFAULT false NOT NULL,
	"created_locally" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "game_states" ADD CONSTRAINT "game_states_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "riddle_analytics" ADD CONSTRAINT "riddle_analytics_riddle_id_riddles_id_fk" FOREIGN KEY ("riddle_id") REFERENCES "public"."riddles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "riddle_answer_choices" ADD CONSTRAINT "riddle_answer_choices_riddle_id_riddles_id_fk" FOREIGN KEY ("riddle_id") REFERENCES "public"."riddles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "riddle_answer_choices" ADD CONSTRAINT "riddle_answer_choices_answer_choice_id_answer_choices_id_fk" FOREIGN KEY ("answer_choice_id") REFERENCES "public"."answer_choices"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_user_animal_user_animals_id_fk" FOREIGN KEY ("user_animal") REFERENCES "public"."user_animals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_user_color_user_colors_id_fk" FOREIGN KEY ("user_color") REFERENCES "public"."user_colors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_answer_choices_display" ON "answer_choices" USING btree ("display");--> statement-breakpoint
CREATE INDEX "idx_game_states_user_id" ON "game_states" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_ruo_riddle_id" ON "riddle_analytics" USING btree ("riddle_id");--> statement-breakpoint
CREATE INDEX "idx_ruo_created_at" ON "riddle_analytics" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_rac_choice_id" ON "riddle_answer_choices" USING btree ("answer_choice_id");--> statement-breakpoint
CREATE INDEX "idx_rac_riddle_id" ON "riddle_answer_choices" USING btree ("riddle_id");--> statement-breakpoint
CREATE INDEX "idx_user_analytics_created_at" ON "user_analytics" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_users_created_at" ON "users" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "users_color_animal_unique" ON "users" USING btree ("user_color","user_animal");