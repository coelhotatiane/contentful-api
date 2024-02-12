import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSchema1707530687908 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE public.item (
            id serial PRIMARY KEY,
            sku varchar NULL,
            name text NULL,
            brand text NULL,
            model text NULL,
            category text NULL,
            color text NULL,
            price numeric,
            currency text,
            stock integer,
            hash text NOT NULL
        );
    `);

    await queryRunner.query(`
        CREATE TABLE public.sys (
            id varchar PRIMARY KEY,
            item_id integer NOT NULL,
            created_at timestamp with time zone NOT NULL,
            updated_at timestamp with time zone NOT NULL,
            space_id text,
            environment_id text,
            content_type_id text,
            type text,
            revision integer,
            locale text
        );
    `);

    await queryRunner.query(`
        CREATE TABLE public.sys_link (
            id varchar PRIMARY KEY,
            type text NULL,
            link_type text NULL
        );
    `);

    await queryRunner.query(`
        CREATE TABLE public.metadata (
            id serial PRIMARY KEY,
            item_id integer NOT NULL
        );
    `);

    await queryRunner.query(`
        CREATE TABLE public.tag (
            id serial PRIMARY KEY,
            value text NOT NULL
        );
    `);

    await queryRunner.query(`
        CREATE TABLE public.metadata_tag (
            id serial PRIMARY KEY,
            metadata_id integer NOT NULL,
            tag_id integer NOT NULL
        );
    `);

    await queryRunner.query(`
        CREATE UNIQUE INDEX "IDX_item_hash"
        ON public.item(hash)
    `);

    await queryRunner.query(`
        ALTER TABLE public.metadata
            ADD CONSTRAINT fk_item
            FOREIGN KEY (item_id)
            REFERENCES public.item(id);
    `);

    await queryRunner.query(`
        ALTER TABLE public.metadata_tag
            ADD CONSTRAINT fk_metadata
            FOREIGN KEY (metadata_id)
            REFERENCES public.metadata(id);
    `);

    await queryRunner.query(`
        ALTER TABLE public.metadata_tag
            ADD CONSTRAINT fk_tag
            FOREIGN KEY (tag_id)
            REFERENCES public.tag(id);
    `);

    await queryRunner.query(`
        ALTER TABLE public.sys
            ADD CONSTRAINT fk_sys_space
            FOREIGN KEY (space_id)
            REFERENCES public.sys_link(id);
    `);

    await queryRunner.query(`
        ALTER TABLE public.sys
            ADD CONSTRAINT fk_sys_environment
            FOREIGN KEY (environment_id)
            REFERENCES public.sys_link(id);
    `);

    await queryRunner.query(`
        ALTER TABLE public.sys
            ADD CONSTRAINT fk_sys_contentType
            FOREIGN KEY (content_type_id)
            REFERENCES public.sys_link(id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('metadata_tag');
    await queryRunner.dropTable('metadata');
    await queryRunner.dropTable('tag');
    await queryRunner.dropTable('item');
    await queryRunner.dropTable('sys');
    await queryRunner.dropTable('sys_link');
  }
}
