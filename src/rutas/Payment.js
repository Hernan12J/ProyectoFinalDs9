import { Router } from "express";
import { crearorden, capturarorden, cancelarorden } from "../views/controls/Pasarela_pago.js";

const router = Router();

router.post('/create-order', crearorden);

router.get('/cancel-order', cancelarorden);

router.get('/capture-order', capturarorden); 

export default router;