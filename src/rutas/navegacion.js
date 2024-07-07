import { Router } from "express";
import session from "express-session";
import conexion from "./DataBase/coneccion.js";
import bodyParser from "body-parser";
const router = Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.get("/catalogo/api/productosDinamicos", (req, res) => {
  const obtenerProductosQuery =
    'SELECT * FROM productos';

  conexion.query(obtenerProductosQuery, (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error: "Error al obtener los productos" });
    } else {
      res.json(results);
    }
  });
});

router.use(
  session({
    secret: "ds9",
    resave: false,
    saveUninitialized: false,
  })
);

router.use((req, res, next) => {
  if (req.session.isAuthenticated) {
    res.locals.isAuthenticated = true;
    res.locals.idUsuario = req.session.idUsuario;
  } else {
    res.locals.isAuthenticated = false;
  }
  next();
});

const requireAuth = (req, res, next) => {
  if (req.session.isAuthenticated) {
    next();
  } else {
    res.redirect("/login");
  }
};

router.get("/", (req, res) => res.render("catalogo"));
router.get("/catalogo", (req, res) => res.render("catalogo"));
router.get("/contacto", (req, res) => res.render("contacto"));
router.get("/sproductos", (req, res) => {
  const id_producto = req.query.id_producto;
  const imagen = req.query.imagen;
  const descripcion = req.query.descripcion;
  const producto = req.query.producto;
  const precio = req.query.precio;
  const colores = req.query.colores ? req.query.colores.split(",") : [];

  if (id_producto && imagen && descripcion && producto && precio && colores) {
    res.render("sproductos", {
      id_producto,
      imagen,
      descripcion,
      producto,
      precio,
      colores,
    });
  } else {
    res.status(400).send("Datos incompletos");
  }
});

router.get("/login", (req, res) => {
  const alert = req.query.mensaje || "";
  const alertClass = req.query.alertClass || "";
  res.render("login", { alert, alertClass });
});
router.get("/registro", (req, res) => {
  const mensaje = req.query.mensaje || "";
  const alertClass = req.query.alertClass || "";
  res.render("registro", { mensaje, alertClass });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const selectQuery = `SELECT * FROM credenciales WHERE correo = ?`;

  conexion.query(selectQuery, [email], (error, results) => {
    if (error) {
      console.error("Error al consultar las credenciales:", error);
      res.render("login", { alert: "Ocurrió un error al iniciar sesión" });
    } else {
      if (results.length === 1) {
        const credenciales = results[0];
        if (password === credenciales.contrasena) {
          const selectQuery = `SELECT * FROM cliente WHERE id = ?`;
          conexion.query(
            selectQuery,
            [credenciales.id_cliente],
            (error, results) => {
              if (error) {
                console.error(
                  "Error al consultar los datos del cliente:",
                  error
                );
                res.render("login", {
                  alert: "Ocurrió un error al iniciar sesión",
                });
              } else {
                if (results.length === 1) {
                  const cliente = results[0];
                  req.session.isAuthenticated = true;
                  req.session.idUsuario = cliente.id;

                  res.redirect("/");
                } else {
                  res.render("login", {
                    alert: "Error al obtener los datos del cliente",
                  });
                }
              }
            }
          );
        } else {
          res.render("login", { alert: "Contraseña incorrecta" });
        }
      } else {
        res.render("login", { alert: "Correo no registrado" });
      }
    }
  });
});

router.post("/registro", (req, res) => {

  const nombre = req.body.nombre;
  const apellido = req.body.apellido;
  const email = req.body.email;
  const password = req.body.pass;


  const insertQuery = `INSERT INTO cliente (nombre,apellido) VALUES (?, ?)`;
  const values = [
    nombre,
    apellido,
  ];

  conexion.query(insertQuery, values, (error, resultado) => {
    if (error) {
      console.error("Error al insertar los datos de registro:", error);
      res.redirect(
        `/registro?mensaje=Error al crear la cuenta&alertClass=danger`
      );
    } else {
      console.log("Datos de registro insertados correctamente");
      const idCliente = resultado.insertId;
      const insertCredencialesQuery = `INSERT INTO credenciales (id_cliente, correo, contrasena) VALUES (?, ?, ?)`;
      const credencialesValues = [idCliente, email, password];
      conexion.query(
        insertCredencialesQuery,
        credencialesValues,
        (credencialesError) => {
          if (credencialesError) {
            console.error(
              "Error al insertar los datos de credenciales:",
              credencialesError
            );
            res.redirect(
              `/registro?mensaje=Cuenta ya registrada&alertClass=danger`
            );
          } else {
            console.log("Datos de credenciales insertados correctamente");
            res.redirect(
              "/login?mensaje=Cuenta creada, puedes iniciar sesión&alertClass=success"
            );
          }
        }
      );
    }
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  });
});

router.post("/agregar", requireAuth, (req, res) => {
  const idCliente = req.session.idUsuario;
  const productId = req.body.id;
  const cantidad = req.body.cantidad;
  const tamaño = req.body.tamaño;

  const query =
    "INSERT INTO carrito (id_cliente, id_producto, cantidad, tamaño) VALUES (?, ?, ?, ?);";
  const values = [idCliente, productId, cantidad, tamaño];

  conexion.query(query, values, (error, results) => {
    if (error) {
      throw error;
    } else {
      res.redirect("/carrito");
    }
  });
});

router.get("/carrito", requireAuth, (req, res) => {
  const idCliente = req.session.idUsuario;
  const query = `SELECT  c.cantidad, c.id_carrito, c.tamaño, p.id_producto, p.producto, p.descripcion, p.precio, p.imagen FROM carrito c INNER JOIN productos p ON c.id_producto = p.id_producto WHERE c.id_cliente = '${idCliente}'`;

  conexion.query(query, (error, results) => {
    if (error) {
      throw error;
    }
    const carrito = results;
    const alert = req.query.mensaje || "Debes iniciar sesión";
    res.render("carrito", { carrito: carrito, alert: alert });
  });
});

router.get("/historial_compras", requireAuth, (req, res) => {
  const idCliente = req.session.idUsuario;
  const query = `SELECT imagen_producto, nombre_producto,tamaño, precio, cantidad, fecha FROM historial WHERE id_cliente = '${idCliente}';`;

  conexion.query(query, (error, results) => {
    if (error) {
      throw error;
    }
    const carrito = results;
    res.render("historial_compras", { carrito: carrito });
  });
});

router.post("/eliminar", (req, res) => {
  const idcarrito = req.body.id_carrito;
  const query = `DELETE FROM carrito WHERE id_carrito = '${idcarrito}'`;

  conexion.query(query, (error, results) => {
    if (error) {
      throw error;
    }
    res.redirect("/carrito");
  });
});

router.post('/send', (req, res) => {
  var name = req.body.name;
  var correo = req.body.correo;
  var mensaje = req.body.mensaje;

  if(name == "" || correo == "" || mensaje == "") {
      res.status(400).send("Todos los campos son obligatorios.");
  } else if(!validateEmail(correo)) {
      res.status(400).send("Por favor, introduce un correo electrónico válido.");
  } else {
      // Inserta los datos en la base de datos
      var query = `INSERT INTO consultas (nombre, correo, asunto) VALUES ('${name}', '${correo}', '${mensaje}')`;
      conexion.query(query, (error, results) => {
        if (error) {
          throw error;
        }
        res.send("Mensaje recibido. Gracias por contactarnos.");
      });
  }
});

function validateEmail(correo) {
  var re = /\S+@\S+\.\S+/;
  return re.test(correo);
}



export default router;