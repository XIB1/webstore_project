CREATE TABLE Users (
  user_id integer PRIMARY KEY,
  username varchar(255),
  role varchar(255),
  created_at timestamp,
  hash varchar(255)
);

CREATE TABLE OrderHeader (
  order_id integer PRIMARY KEY,
  user_id integer,
  status varchar(255),
  order_datetime timestamp,
  FOREIGN KEY (user_id) REFERENCES Users (user_id)
);

CREATE TABLE Material (
  material_id varchar(255) PRIMARY KEY,
  description varchar(255),
  weight double,
  volume double,
  price double,
  price_valid_start datetime,
  price_valid_end datetime
);

CREATE TABLE OrderLine (
  order_id integer,
  order_item integer,
  order_key integer PRIMARY KEY,
  material_id varchar(255),
  order_text text,
  FOREIGN KEY (order_id) REFERENCES OrderHeader (order_id),
  FOREIGN KEY (material_id) REFERENCES Material (material_id)
);

CREATE TABLE Stock (
  material_id varchar(255) PRIMARY KEY,
  stock integer,
  location varchar(255),
  status varchar(255),
  FOREIGN KEY (material_id) REFERENCES Material (material_id)
);

CREATE TABLE BasketHeader (
  basket_id varchar(255) PRIMARY KEY,
  user_id integer,
  basket_saved datetime,
  order_placed integer,
  FOREIGN KEY (user_id) REFERENCES Users (user_id)
);

CREATE TABLE BasketLine (
  basket_id varchar(255) PRIMARY KEY,
  material_id varchar(255),
  order_key integer,
  FOREIGN KEY (basket_id) REFERENCES BasketHeader (basket_id),
  FOREIGN KEY (material_id) REFERENCES Material (material_id)
);

