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
CREATE TABLE object (
    id UUID PRIMARY KEY,
    object_type VARCHAR(255),
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
    service_type VARCHAR(255),
    service_description TEXT,
    service_result TEXT,
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
    date_of_signed TIMESTAMP WITH TIME ZONE,
    payment_details text,
    is_generated BOOLEAN,
    owner_id UUID,
    signer_id UUID,

    CONSTRAINT fk_object_user FOREIGN KEY (owner_id) REFERENCES "user"(id),
    CONSTRAINT fk_object_signer FOREIGN KEY (signer_id) REFERENCES "user"(id)
);

-- Таблица: penalty
CREATE TABLE penalty (
    id UUID PRIMARY KEY,
    reason TEXT,
    amount NUMERIC,
    object_id UUID,
    CONSTRAINT fk_penalty_object FOREIGN KEY (object_id) REFERENCES object(id)
);

-- Таблица: user_roles
CREATE TABLE user_roles (
    user_id UUID NOT NULL,
    role_id UUID NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES "user"(id),
    FOREIGN KEY (role_id) REFERENCES role(id)
);

-- Инициализация ролей
INSERT INTO role (id, name)
VALUES
    (gen_random_uuid(), 'ROLE_PAID_USER'),
    (gen_random_uuid(), 'ROLE_ADMIN');
