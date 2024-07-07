DROP DATABASE proyecto_ds9;
	
CREATE DATABASE proyecto_ds9;

USE proyecto_ds9;

-- CREACION DE LA TABLA CLIENTE
CREATE TABLE cliente (
id INT AUTO_INCREMENT,
CONSTRAINT pk_id_cliente PRIMARY KEY (id),
nombre VARCHAR(50),
apellido VARCHAR(50)
);

-- CREACION DE LA TABLA DE CREDENCILES
create table credenciales(
id INT AUTO_INCREMENT,
CONSTRAINT pk_id_credenciales PRIMARY KEY (id),
id_cliente INT NOT NULL,
CONSTRAINT credenciales_id_fk foreign key (id_cliente) references cliente(id),
correo varchar(50),
CONSTRAINT credenciales_correo_unique UNIQUE (correo),
CONSTRAINT credenciales_correo_ck CHECK (correo RLIKE ('.@.')),
contrasena VARCHAR(50) NOT NULL,
CONSTRAINT credenciales_contrasena_ck CHECK (contrasena RLIKE ('.[A-Z].') and contrasena RLIKE ('.[0-9].'))
);


-- CREACION DE LA TABLA DE PRODUCTOS
CREATE TABLE productos (
  id_producto INT AUTO_INCREMENT PRIMARY KEY,
  producto VARCHAR(100),
  descripcion VARCHAR(800),
  precio DECIMAL(10, 2),
  cantidad INT,
  imagen VARCHAR(200)
);


-- CREACION DE LA TABLA CARRITO 
CREATE TABLE carrito (
  id_carrito INT AUTO_INCREMENT PRIMARY KEY,
  cantidad int,
  tamaño VARCHAR(200),
  id_cliente INT NOT NULL,
  CONSTRAINT id_cliente_fk2 foreign key (id_cliente) references cliente(id),
  id_producto INT NOT NULL,
  CONSTRAINT id_producto_fk2 foreign key (id_producto) references productos(id_producto)
);

-- CREACION DE LA TABLA DE EL HISOTRIAL DE LAS ORDENES

CREATE TABLE historial (
  id_historial INT AUTO_INCREMENT PRIMARY KEY,
  imagen_producto VARCHAR(255),
  nombre_producto VARCHAR(255),
  tamaño VARCHAR(200),
  precio DECIMAL(10, 2),
  cantidad INT,
  fecha VARCHAR(50),
  id_cliente INT NOT NULL,
  CONSTRAINT fk_id_cliente FOREIGN KEY (id_cliente) REFERENCES cliente(id)
);





USE proyecto_ds9;


INSERT INTO cliente (nombre, apellido)
VALUES
  ('Hernan', 'Hernandez')
  -- Agrega más filas de datos aleatorios si es necesario
;

INSERT INTO credenciales (id_cliente, correo, contrasena)
VALUES
  (1, 'hernan.hernandez@utp.ac.pa', 'Utp12345')
  -- Agrega más filas de datos aleatorios si es necesario
;




INSERT INTO productos (producto, descripcion, precio, cantidad, imagen) VALUES ('Pizza de pepperoni', 'Pizza de masa delgada con queso mozzarella pepperoni y salsa de tomate', 10.00, 5, 'p1.png');
INSERT INTO productos (producto, descripcion, precio, cantidad, imagen) VALUES ('Pizza 4 Quesos', 'Pizza de 5 quesos masa delgada', 14.00, 5, 'p2.png');
INSERT INTO productos (producto, descripcion, precio, cantidad, imagen) VALUES ('Pizza Hawaiana', 'Pizza Jamón, piña, plátano y cereza', 15.00, 5, 'p3.png');
INSERT INTO productos (producto, descripcion, precio, cantidad, imagen) VALUES ('Pizza Champiñón', 'Pizza con queso y champiñón', 13.00, 5, 'p4.png');
INSERT INTO productos (producto, descripcion, precio, cantidad, imagen) VALUES ('Pizza Salami', 'Pizza con queso y Salami', 10.00, 5, 'p5.png');
INSERT INTO productos (producto, descripcion, precio, cantidad, imagen) VALUES ('Pizza Jamón', 'Pizza con queso y Jamón', 10.00, 5, 'p6.png');
INSERT INTO productos (producto, descripcion, precio, cantidad, imagen) VALUES ('Pizza Italiana', 'Pizza Italiana', 16.00, 5, 'p7.png');
INSERT INTO productos (producto, descripcion, precio, cantidad, imagen) VALUES ('Pizza Americana', 'Pizza Americana con Jamón y tocino', 18.00, 5, 'p8.png');
INSERT INTO productos (producto, descripcion, precio, cantidad, imagen) VALUES ('Pizza Alemana', 'Pizza Alemana de Salchicha y champiñón', 16.00, 5, 'p9.png');
INSERT INTO productos (producto, descripcion, precio, cantidad, imagen) VALUES ('Pizza Dorada', 'Pizza Dorada de Maiz y champiñón', 13.00, 5, 'p10.png');





