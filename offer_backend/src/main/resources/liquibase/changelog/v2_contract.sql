--liquibase formatted sql
--changeset Shyller:v1_init

CREATE TABLE contract (
    id UUID PRIMARY KEY,

    object_id UUID NOT NULL,
    CONSTRAINT fk_contract_object FOREIGN KEY (object_id) REFERENCES object(id) ON DELETE CASCADE,

    full_name TEXT NOT NULL,
    passport_series TEXT NOT NULL,
    passport_number TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT NOT NULL,
    signed_at TIMESTAMPTZ NOT NULL,

    ip_address TEXT,
    user_agent TEXT
);
