-- Таблица для хранения заявок на выезды
CREATE TABLE registrations (
    id SERIAL PRIMARY KEY,
    event_title VARCHAR(255) NOT NULL,
    event_date DATE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    vehicle VARCHAR(255),
    experience TEXT,
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индекс для быстрого поиска по статусу
CREATE INDEX idx_registrations_status ON registrations(status);

-- Индекс для поиска по дате события
CREATE INDEX idx_registrations_event_date ON registrations(event_date);

-- Индекс для поиска по email
CREATE INDEX idx_registrations_email ON registrations(email);