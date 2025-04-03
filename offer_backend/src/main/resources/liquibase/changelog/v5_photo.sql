--liquibase formatted sql
--changeset Shyller:v4_custom_document

ALTER TABLE contract
ADD COLUMN document_photo_url TEXT;