import mysql from 'mysql2';

const connection = mysql.createConnection({
  host: 'localhost', // Host de la base de datos (puede ser 'localhost' si estás usando XAMPP en tu máquina local)
  port: 3306, // Puerto de la base de datos
  user: 'root', // Usuario de la base de datos
  password: '', // Contraseña de la base de datos
  database: 'proyecto_ds9' // Nombre de la base de datos a la que deseas conectarte
});

// Establecer la conexión
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos!');
});

// Aquí puedes realizar consultas a la base de datos utilizando la conexión

// Cerrar la conexión cuando hayas terminado de utilizarla
export default connection;
