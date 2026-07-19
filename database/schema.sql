CREATE DATABASE IF NOT EXISTS afno_ghar
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE afno_ghar;

-- =========================================================
-- USERS
-- =========================================================

CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('customer', 'admin', 'worker', 'delivery_staff')
        NOT NULL DEFAULT 'customer',
    status ENUM('active', 'inactive', 'banned')
        NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =========================================================
-- ADDRESSES
-- =========================================================

CREATE TABLE IF NOT EXISTS addresses (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    province VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    municipality VARCHAR(100) NOT NULL,
    ward_number VARCHAR(20),
    street_address VARCHAR(255) NOT NULL,
    landmark VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_addresses_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================================================
-- CATEGORIES
-- =========================================================

CREATE TABLE IF NOT EXISTS categories (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    image_url VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =========================================================
-- PRODUCTS
-- =========================================================

CREATE TABLE IF NOT EXISTS products (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category_id INT UNSIGNED NOT NULL,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(180) NOT NULL UNIQUE,
    description TEXT,
    base_price DECIMAL(12, 2) NOT NULL,
    stock_quantity INT UNSIGNED NOT NULL DEFAULT 0,

    product_type ENUM('ready_made', 'custom_made', 'both')
        NOT NULL DEFAULT 'ready_made',

    is_customizable BOOLEAN NOT NULL DEFAULT FALSE,
    is_rentable BOOLEAN NOT NULL DEFAULT FALSE,
    image_url VARCHAR(500),
    status ENUM('active', 'inactive', 'out_of_stock')
        NOT NULL DEFAULT 'active',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_products_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT chk_products_price
        CHECK (base_price >= 0)
) ENGINE=InnoDB;

CREATE INDEX idx_products_category
ON products(category_id);

CREATE INDEX idx_products_status
ON products(status);

-- =========================================================
-- PRODUCT IMAGES
-- =========================================================

CREATE TABLE IF NOT EXISTS product_images (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id INT UNSIGNED NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    alternative_text VARCHAR(255),
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_product_images_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================================================
-- MATERIALS
-- =========================================================

CREATE TABLE IF NOT EXISTS materials (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS product_materials (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id INT UNSIGNED NOT NULL,
    material_id INT UNSIGNED NOT NULL,
    additional_price DECIMAL(12, 2) NOT NULL DEFAULT 0,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT uq_product_material
        UNIQUE (product_id, material_id),

    CONSTRAINT fk_product_materials_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_product_materials_material
        FOREIGN KEY (material_id)
        REFERENCES materials(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT chk_material_additional_price
        CHECK (additional_price >= 0)
) ENGINE=InnoDB;

-- =========================================================
-- COLORS
-- =========================================================

CREATE TABLE IF NOT EXISTS colors (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    hex_code VARCHAR(7),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS product_colors (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id INT UNSIGNED NOT NULL,
    color_id INT UNSIGNED NOT NULL,
    additional_price DECIMAL(12, 2) NOT NULL DEFAULT 0,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT uq_product_color
        UNIQUE (product_id, color_id),

    CONSTRAINT fk_product_colors_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_product_colors_color
        FOREIGN KEY (color_id)
        REFERENCES colors(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT chk_color_additional_price
        CHECK (additional_price >= 0)
) ENGINE=InnoDB;

-- =========================================================
-- CARTS
-- =========================================================

CREATE TABLE IF NOT EXISTS carts (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_carts_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS cart_items (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    cart_id INT UNSIGNED NOT NULL,
    product_id INT UNSIGNED NOT NULL,
    material_id INT UNSIGNED NULL,
    color_id INT UNSIGNED NULL,
    quantity INT UNSIGNED NOT NULL DEFAULT 1,
    custom_length DECIMAL(10, 2),
    custom_width DECIMAL(10, 2),
    custom_height DECIMAL(10, 2),
    special_instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_cart_items_cart
        FOREIGN KEY (cart_id)
        REFERENCES carts(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_cart_items_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_cart_items_material
        FOREIGN KEY (material_id)
        REFERENCES materials(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT fk_cart_items_color
        FOREIGN KEY (color_id)
        REFERENCES colors(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT chk_cart_quantity
        CHECK (quantity > 0)
) ENGINE=InnoDB;

-- =========================================================
-- ORDERS
-- =========================================================

CREATE TABLE IF NOT EXISTS orders (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(40) NOT NULL UNIQUE,
    user_id INT UNSIGNED NOT NULL,
    address_id INT UNSIGNED NOT NULL,

    order_type ENUM('ready_made', 'custom', 'mixed', 'rental')
        NOT NULL DEFAULT 'ready_made',

    order_status ENUM(
        'pending',
        'confirmed',
        'advance_paid',
        'in_production',
        'ready_for_delivery',
        'out_for_delivery',
        'delivered',
        'cancelled'
    ) NOT NULL DEFAULT 'pending',

    subtotal DECIMAL(12, 2) NOT NULL,
    customization_charge DECIMAL(12, 2) NOT NULL DEFAULT 0,
    delivery_charge DECIMAL(12, 2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(12, 2) NOT NULL,
    advance_required DECIMAL(12, 2) NOT NULL DEFAULT 0,
    remaining_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
    estimated_delivery_date DATE,
    notes TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_orders_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_orders_address
        FOREIGN KEY (address_id)
        REFERENCES addresses(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS order_items (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id INT UNSIGNED NOT NULL,
    product_id INT UNSIGNED NULL,

    product_name VARCHAR(150) NOT NULL,
    selected_material VARCHAR(100),
    selected_color VARCHAR(100),

    quantity INT UNSIGNED NOT NULL,
    unit_price DECIMAL(12, 2) NOT NULL,
    customization_price DECIMAL(12, 2) NOT NULL DEFAULT 0,

    custom_length DECIMAL(10, 2),
    custom_width DECIMAL(10, 2),
    custom_height DECIMAL(10, 2),
    special_instructions TEXT,

    item_total DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_order_items_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_order_items_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT chk_order_item_quantity
        CHECK (quantity > 0)
) ENGINE=InnoDB;

-- =========================================================
-- PAYMENTS
-- =========================================================

CREATE TABLE IF NOT EXISTS payments (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id INT UNSIGNED NOT NULL,

    payment_type ENUM(
        'advance',
        'remaining',
        'full_payment',
        'rental_deposit',
        'refund'
    ) NOT NULL,

    payment_method ENUM(
        'esewa',
        'khalti',
        'bank_transfer',
        'cash_on_delivery',
        'cash'
    ) NOT NULL,

    amount DECIMAL(12, 2) NOT NULL,
    transaction_reference VARCHAR(150),

    payment_status ENUM(
        'pending',
        'completed',
        'failed',
        'refunded'
    ) NOT NULL DEFAULT 'pending',

    paid_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_payments_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT chk_payment_amount
        CHECK (amount >= 0)
) ENGINE=InnoDB;

-- =========================================================
-- PRODUCTION TRACKING
-- =========================================================

CREATE TABLE IF NOT EXISTS production_stages (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    stage_order INT UNSIGNED NOT NULL,
    description TEXT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS production_tracking (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_item_id INT UNSIGNED NOT NULL,
    stage_id INT UNSIGNED NOT NULL,

    tracking_status ENUM(
        'pending',
        'in_progress',
        'completed',
        'delayed'
    ) NOT NULL DEFAULT 'pending',

    started_at DATETIME,
    completed_at DATETIME,
    remarks TEXT,
    updated_by INT UNSIGNED NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_production_tracking_order_item
        FOREIGN KEY (order_item_id)
        REFERENCES order_items(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_production_tracking_stage
        FOREIGN KEY (stage_id)
        REFERENCES production_stages(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_production_tracking_user
        FOREIGN KEY (updated_by)
        REFERENCES users(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================================================
-- DELIVERY ZONES
-- =========================================================

CREATE TABLE IF NOT EXISTS delivery_zones (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    province VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    municipality VARCHAR(100),
    estimated_days INT UNSIGNED NOT NULL,
    delivery_charge DECIMAL(12, 2) NOT NULL DEFAULT 0,
    is_serviceable BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =========================================================
-- SAMPLE DATA
-- =========================================================

INSERT IGNORE INTO categories (id, name, description)
VALUES
    (1, 'Sofas', 'Comfortable sofas and sectionals'),
    (2, 'Beds', 'Beds and bedroom furniture'),
    (3, 'Tables', 'Dining, coffee and office tables'),
    (4, 'Chairs', 'Dining, lounge and office chairs'),
    (5, 'Wardrobes', 'Storage and wardrobe furniture');

INSERT IGNORE INTO materials (id, name, description)
VALUES
    (1, 'Sal Wood', 'Strong locally available hardwood'),
    (2, 'Sisau Wood', 'Durable premium hardwood'),
    (3, 'Plywood', 'Affordable engineered wood'),
    (4, 'MDF', 'Smooth engineered fibreboard'),
    (5, 'Metal', 'Strong metal construction');

INSERT IGNORE INTO colors (id, name, hex_code)
VALUES
    (1, 'Natural Brown', '#8B5A2B'),
    (2, 'Dark Walnut', '#4A2C2A'),
    (3, 'White', '#FFFFFF'),
    (4, 'Black', '#000000'),
    (5, 'Cream', '#FFFDD0');

INSERT IGNORE INTO production_stages (id, name, stage_order, description)
VALUES
    (1, 'Order Confirmed', 1, 'Customer order has been confirmed'),
    (2, 'Design Approved', 2, 'Final furniture design has been approved'),
    (3, 'Materials Collected', 3, 'Required materials have been collected'),
    (4, 'Cutting', 4, 'Materials are being measured and cut'),
    (5, 'Assembly', 5, 'Furniture parts are being assembled'),
    (6, 'Polishing', 6, 'Furniture is being polished or painted'),
    (7, 'Quality Inspection', 7, 'Furniture is being checked'),
    (8, 'Ready for Delivery', 8, 'Furniture is ready for dispatch');

INSERT IGNORE INTO products (
    id,
    category_id,
    name,
    slug,
    description,
    base_price,
    stock_quantity,
    product_type,
    is_customizable,
    is_rentable,
    status
)
VALUES
    (
        1,
        1,
        'Royal Velvet 3-Seater',
        'royal-velvet-3-seater',
        'Comfortable three-seater sofa with a strong wooden frame.',
        45000,
        10,
        'both',
        TRUE,
        TRUE,
        'active'
    ),
    (
        2,
        2,
        'Modern Wooden Bed',
        'modern-wooden-bed',
        'Modern wooden double bed suitable for Nepali homes.',
        55000,
        5,
        'both',
        TRUE,
        FALSE,
        'active'
    ),
    (
        3,
        3,
        'Six-Seater Dining Table',
        'six-seater-dining-table',
        'Dining table designed for six people.',
        65000,
        4,
        'both',
        TRUE,
        TRUE,
        'active'
    );