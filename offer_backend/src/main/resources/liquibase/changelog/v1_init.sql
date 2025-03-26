--liquibase formatted sql
--changeset Shyller:v1_init

-- Таблица: role
CREATE TABLE role (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- Таблица: user
CREATE TABLE "user" (
    id UUID PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    subscription_expires_at TIMESTAMP WITH TIME ZONE,
    encrypted_password VARCHAR(255)
);

-- Таблица: contract
CREATE TABLE contract (
    id UUID PRIMARY KEY,
    contract_type VARCHAR(255),
    owner_type VARCHAR(255),
    owner_name VARCHAR(255),
    owner_phone VARCHAR(255),
    passport_series VARCHAR(50),
    passport_number VARCHAR(50),
    organization_name VARCHAR(255),
    ogrn VARCHAR(20),
    inn VARCHAR(20),
    kpp VARCHAR(20),
    legal_address TEXT,
    position_of_representative VARCHAR(255),
    document VARCHAR(255),
    email VARCHAR(255),
    registration_address TEXT,
    address TEXT,
    square INTEGER,
    cadastral_number VARCHAR(100),
    technical_type VARCHAR(255),
    technical_description TEXT,
    rent_type VARCHAR(255),
    rent_price NUMERIC,
    rent_amount VARCHAR(255),
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    is_deposit BOOLEAN,
    deposit_amount NUMERIC,
    deposit_backup VARCHAR(255),
    with_animals BOOLEAN,
    can_smoke BOOLEAN,
    date_of_signed TIMESTAMP,
    user_id UUID,
    CONSTRAINT fk_contract_user FOREIGN KEY (user_id) REFERENCES "user"(id)
);

-- Таблица: penalty
CREATE TABLE penalty (
    id UUID PRIMARY KEY,
    reason TEXT,
    amount NUMERIC,
    contract_id UUID,
    CONSTRAINT fk_penalty_contract FOREIGN KEY (contract_id) REFERENCES contract(id)
);

CREATE TABLE user_roles (
    user_id UUID NOT NULL,
    role_id UUID NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES "user"(id),
    FOREIGN KEY (role_id) REFERENCES role(id)
);

INSERT INTO role (id, name)
VALUES
    (gen_random_uuid(), 'ROLE_PAID_USER'),
    (gen_random_uuid(), 'ROLE_ADMIN');

