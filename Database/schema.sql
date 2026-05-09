-- Create Database
CREATE DATABASE ShopEZDB;
GO

USE ShopEZDB;
GO

-- Create Users Table
CREATE TABLE Users (
    UserId INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Email NVARCHAR(150) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    Role NVARCHAR(50) DEFAULT 'Customer',
    CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- Create Products Table
CREATE TABLE Products (
    ProductId INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(200) NOT NULL,
    Description NVARCHAR(1000),
    Price DECIMAL(18,2) NOT NULL,
    ImageUrl NVARCHAR(500),
    Stock INT NOT NULL DEFAULT 0,
    Category NVARCHAR(50),
    IsFeatured BIT DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- Create Orders Table
CREATE TABLE Orders (
    OrderId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    OrderDate DATETIME2 DEFAULT GETUTCDATE(),
    TotalAmount DECIMAL(18,2) NOT NULL,
    Status NVARCHAR(50) DEFAULT 'Pending',
    ShippingAddress NVARCHAR(500),
    PaymentMethod NVARCHAR(50),
    FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

-- Create OrderItems Table
CREATE TABLE OrderItems (
    OrderItemId INT IDENTITY(1,1) PRIMARY KEY,
    OrderId INT NOT NULL,
    ProductId INT NOT NULL,
    Quantity INT NOT NULL,
    Price DECIMAL(18,2) NOT NULL,
    FOREIGN KEY (OrderId) REFERENCES Orders(OrderId) ON DELETE CASCADE,
    FOREIGN KEY (ProductId) REFERENCES Products(ProductId)
);

-- Create Indexes for Performance
CREATE INDEX IX_Orders_UserId ON Orders(UserId);
CREATE INDEX IX_Orders_OrderDate ON Orders(OrderDate);
CREATE INDEX IX_OrderItems_OrderId ON OrderItems(OrderId);
CREATE INDEX IX_OrderItems_ProductId ON OrderItems(ProductId);
CREATE INDEX IX_Products_Category ON Products(Category);
CREATE INDEX IX_Products_IsFeatured ON Products(IsFeatured);

-- Insert Sample Data
INSERT INTO Users (Name, Email, PasswordHash, Role) VALUES
('Admin User', 'admin@shopez.com', '$2a$11$K8X9Y7Z6W5V4U3T2S1Q0O9N8M7L6K5J4I3H2G1F0E9D8C7B6A5', 'Admin'),
('John Doe', 'john@example.com', '$2a$11$K8X9Y7Z6W5V4U3T2S1Q0O9N8M7L6K5J4I3H2G1F0E9D8C7B6A5', 'Customer'),
('Jane Smith', 'jane@example.com', '$2a$11$K8X9Y7Z6W5V4U3T2S1Q0O9N8M7L6K5J4I3H2G1F0E9D8C7B6A5', 'Customer');

INSERT INTO Products (Name, Description, Price, ImageUrl, Stock, Category, IsFeatured) VALUES
('MacBook Pro 14', 'Apple M3 Pro chip, 18GB RAM, 512GB SSD, 14-inch Liquid Retina XDR display', 189999, 'https://picsum.photos/id/0/400/400', 10, 'Electronics', 1),
('iPhone 15 Pro Max', '6.7-inch Super Retina XDR, A17 Pro chip, 256GB, Titanium design', 149999, 'https://picsum.photos/id/1/400/400', 15, 'Electronics', 1),
('Sony WH-1000XM5', 'Industry-leading noise cancellation, 30-hour battery life, Premium sound quality', 29999, 'https://picsum.photos/id/2/400/400', 25, 'Audio', 1),
('Logitech MX Master 3S', 'Quiet clicks, 8K DPI any-surface tracking, MagSpeed scroll wheel', 8999, 'https://picsum.photos/id/3/400/400', 30, 'Accessories', 0),
('Samsung Odyssey G9', '49-inch Dual QHD curved gaming monitor, 240Hz refresh rate, 1ms response', 149999, 'https://picsum.photos/id/4/400/400', 5, 'Electronics', 1),
('Keychron K2 Pro', 'Wireless mechanical keyboard, Hot-swappable, RGB backlight', 7999, 'https://picsum.photos/id/5/400/400', 20, 'Accessories', 0),
('Apple Watch Ultra 2', '49mm titanium case, S9 SiP, 100m water resistance, Dual-frequency GPS', 89999, 'https://picsum.photos/id/6/400/400', 12, 'Electronics', 1),
('iPad Pro 12.9"', 'M2 chip, Liquid Retina XDR display, 256GB, Wi-Fi 6E, Apple Pencil hover support', 119999, 'https://picsum.photos/id/7/400/400', 8, 'Electronics', 0),
('Dell XPS 15', 'Intel Core i9, 32GB RAM, 1TB SSD, NVIDIA RTX 4070, 15.6-inch 4K OLED', 229999, 'https://picsum.photos/id/8/400/400', 7, 'Electronics', 1),
('Bose QuietComfort', 'Acoustic noise cancelling, Bluetooth 5.1, 24-hour battery life', 24999, 'https://picsum.photos/id/9/400/400', 18, 'Audio', 0),
('Razer DeathAdder V3', 'Optical mouse switches, Focus Pro 30K sensor, 59g ultra-lightweight', 5499, 'https://picsum.photos/id/10/400/400', 35, 'Accessories', 0),
('LG C3 OLED', '65-inch 4K Smart OLED TV, α9 Gen6 AI Processor, 120Hz refresh rate', 189999, 'https://picsum.photos/id/11/400/400', 6, 'Electronics', 1);

-- Insert Sample Orders (optional)
INSERT INTO Orders (UserId, TotalAmount, Status, ShippingAddress, PaymentMethod) VALUES
(2, 189999, 'Delivered', '123 Main St, Mumbai', 'COD'),
(2, 29999, 'Processing', '123 Main St, Mumbai', 'Credit Card'),
(3, 149999, 'Shipped', '456 Park Ave, Delhi', 'UPI');

INSERT INTO OrderItems (OrderId, ProductId, Quantity, Price) VALUES
(1, 1, 1, 189999),
(2, 3, 1, 29999),
(3, 2, 1, 149999);