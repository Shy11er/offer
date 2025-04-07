--liquibase formatted sql
--changeset Shyller:v6_pay.sql

CREATE TABLE pay (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    status VARCHAR(255) NOT NULL,
    last_pay_date TIMESTAMP WITH TIME ZONE,
    paid_until TIMESTAMP WITH TIME ZONE,
    payment_id VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    rebill_id VARCHAR(255),
    pan VARCHAR(255),
    card_id VARCHAR(255),
    order_id VARCHAR(255),
    timestamp TIMESTAMP WITH TIME ZONE,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE
);

-- Индексы для быстрого поиска по основным полям
CREATE INDEX idx_user_id ON pay(user_id);
CREATE INDEX idx_status ON pay(status);
CREATE INDEX idx_payment_id ON pay(payment_id);
CREATE INDEX idx_order_id ON pay(order_id);
CREATE INDEX idx_timestamp ON pay(timestamp);
