

-- Таблица для контрактов
CREATE TABLE contract (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
    legal_address VARCHAR(255),
    position_of_representative VARCHAR(255),
    document VARCHAR(255),
    email VARCHAR(255),
    registration_address VARCHAR(255),
    address VARCHAR(255),
    square INT,
    cadastral_number VARCHAR(255),
    technical_type VARCHAR(255),
    technical_description VARCHAR(255),
    rent_type VARCHAR(255),
    rent_price DOUBLE PRECISION,
    rent_amount VARCHAR(255),
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    is_deposit BOOLEAN,
    deposit_amount DOUBLE PRECISION,
    deposit_backup VARCHAR(255),
    with_animals BOOLEAN,
    can_smoke BOOLEAN
);

-- Таблица для штрафов
CREATE TABLE penalty (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reason VARCHAR(255) NOT NULL,
    amount DOUBLE PRECISION NOT NULL,
    contract_id UUID,
    FOREIGN KEY (contract_id) REFERENCES contract(id) ON DELETE CASCADE
);

-- Таблица для ролей
CREATE TABLE role (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE
);

-- Таблица для пользователей
CREATE TABLE "user" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    subscription_expires_at TIMESTAMPTZ,
    role_id UUID,
    FOREIGN KEY (role_id) REFERENCES role(id),
    email VARCHAR(255)
);

-- Добавление индексов для повышения производительности
CREATE INDEX idx_contract_owner_name ON contract(owner_name);
CREATE INDEX idx_contract_owner_phone ON contract(owner_phone);
CREATE INDEX idx_penalty_contract_id ON penalty(contract_id);
CREATE INDEX idx_user_username ON "user"(username);
CREATE INDEX idx_user_email ON "user"(email);
