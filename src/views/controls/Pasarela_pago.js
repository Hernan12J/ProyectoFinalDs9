
import axios from "axios";
import { PAYPAL_API, PAYPAL_API_CLIENT, PAYPAL_API_SECRET, HOST } from "../../rutas/configuracion/config.js";
import conexion from "../../rutas/DataBase/coneccion.js";

let datosCapturarOrden = {};
let datosProducto = [];

export const crearorden = async (req, res) => {
   try {

    const idUsuario = req.body.idUsuario;
    datosCapturarOrden = { idUsuario };

    const datos = req.body.datos;
    datosProducto = JSON.parse(datos);
    // console.log (datosProducto)
    const total= req.body.total

    const order = {
        intent: "CAPTURE",
        purchase_units:   
    [{
        amount:
        {
           currency_code: "USD",
           value: total
        },
        description: "fdfdfdff",

    },
    ],
    application_context: 
    {
        brand_name: "ProyectoDS9.com",
        landing_page: "LOGIN",
        user_action: "PAY_NOW",
        return_url: `${HOST}/capture-order` ,
        cancel_url: `${HOST}/cancel-order`,
    }
    };

    const params = new URLSearchParams()
    params.append("grant_type", "client_credentials")

    const { data: {access_token} } = await axios.post('https://api-m.sandbox.paypal.com/v1/oauth2/token',params , {
        headers:{
          'Content-Type': 'application/x-www-form-urlencoded',  
        }, 
        auth:
        {
            username: PAYPAL_API_CLIENT,
            password: PAYPAL_API_SECRET,
        }
    })


    const response = await axios.post(`${PAYPAL_API}/v2/checkout/orders`, order, {
        headers:
        {
            Authorization: `Bearer ${access_token}`
        }
    });

    res.json(response.data);


   } catch (error) {
        return res.status(500).send("Algo fallo");
   }
}

export const capturarorden = async (req, res) => {
    
    const {token, PayerID } = req.query

    try {

        const response = await axios.post(`${PAYPAL_API}/v2/checkout/orders/${token}/capture`, {}, {
            auth: 
            {
                username: PAYPAL_API_CLIENT,
                password: PAYPAL_API_SECRET,
            },
        });

        const query = `DELETE FROM carrito WHERE id_cliente =  '${datosCapturarOrden.idUsuario}'`;
        conexion.query(query, (error) => {
        if (error) {
        throw error;
        }
        res.redirect("/historial_compras");
        });

        datosProducto.forEach((producto) => {
            const fecha = new Date().toISOString().split("T")[0];

            const queryhistorial = `INSERT INTO historial (imagen_producto, nombre_producto, tamaño, precio, cantidad, id_cliente, fecha) VALUES ('${producto.imagen}', '${producto.producto}','${producto.tamaño}', ${parseFloat(producto.precio)}, ${parseInt(producto.cantidad)}, ${parseInt(producto.idUsuario)}, '${fecha}')`;            conexion.query(queryhistorial, (error) => {
                if (error) {
                throw error;
                }

                });
        });
        
    } catch (error) 

    {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server error" });
    }
};


export const cancelarorden = (req, res) => res.redirect("http://localhost:3000/carrito");
