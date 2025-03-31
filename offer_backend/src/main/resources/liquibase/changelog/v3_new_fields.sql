--liquibase formatted sql
--changeset Shyller:v1_init

ALTER TABLE object
ADD COLUMN apartment_condition TEXT,
ADD COLUMN list_of_appartment_properties TEXT,
ADD COLUMN penalty_for_incorrect_exit TEXT,
ADD COLUMN key_amount INTEGER,
ADD COLUMN people_amount INTEGER,
ADD COLUMN given_by TEXT,
ADD COLUMN when_pledge_not_return TEXT,
ADD COLUMN conditions_for_return_pledge TEXT;