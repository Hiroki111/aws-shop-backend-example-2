--CREATE EXTENSION IF NOT EXISTS "uuid-ossp"

--CREATE TABLE products (
--	id uuid PRIMARY KEY DEFAULT uuid_generate_V4() not null,
--	title text not null,
--	description text not null,
--	price decimal not null
--)

--CREATE TABLE stocks (
--	product_id uuid not null,
--	count integer not null,
--	FOREIGN KEY ("product_id") REFERENCES "products" ("id")
--)

--insert into products (title, description, price) values
--('Test1', 'test1', 2.4),
--('Test2', 'test2', 7),
--('Test3', 'test3', 5.2),
--('Test4', 'test4', 10),
--('Test5', 'test5', 27)

--insert into stocks (product_id, count) values
--('0f4ae980-c5ba-4b16-a70d-e89a2061a6d9', 6),
--('bceb65f5-bf9b-438a-8e56-c53f18c212cc', 2),
--('e6975121-d5ad-4658-8e45-6b46e1be71e8', 4),
--('ff7accb1-cd0f-4273-81dc-13999f8fedde', 11),
--('07687fdd-6247-408a-baeb-922684abdd54', 1)
