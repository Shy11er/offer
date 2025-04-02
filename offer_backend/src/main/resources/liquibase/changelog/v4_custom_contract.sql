--liquibase formatted sql
--changeset Shyller:v4_custom_document

ALTER TABLE object
ADD COLUMN custom_contract TEXT,
ADD COLUMN custom_contract_name TEXT,
ADD COLUMN is_template BOOLEAN DEFAULT TRUE,
ADD COLUMN application TEXT,
ADD COLUMN application_name TEXT;