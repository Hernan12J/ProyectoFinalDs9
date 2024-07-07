import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import bodyParser from 'body-parser';
import Payment from "./rutas/Payment.js";
import indexRoutes from "./rutas/navegacion.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ruta = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

// Configuración de middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(join(__dirname, 'public')));

// Rutas
app.use(Payment);
app.use(indexRoutes);

// Configuración de vistas y motor de plantillas
app.set("views", join(ruta, "views"));
app.set("view engine", "ejs");

// Rutas estáticas adicionales
const staticPaths = [
  "public/img/productos",
  "public/img/Banners-logo",
  "public/css",
  "views/controls"
];
staticPaths.forEach((staticPath) => {
  app.use(express.static(join(ruta, staticPath)));
});

// Iniciar servidor
app.listen(port, () => {
  console.log("Servidor encendido en el puerto", port);
});
