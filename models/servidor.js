process.loadEnvFile();
require("dotenv-expand").expand({ ignoreProcessEnv: false });
const express=require("express");
const cors=require("cors");

const   {
            conectarMongo
        }=require("../db/db-configurador");

class Servidor
{
    //Atributos:

    //Constructores:
    constructor()
    {
        this.puerto=process.env.PUERTO;
        this.rutas  =   {
                            rutaAPIAcceso       :   "/api/acceso",
                            rutaAPIBusqueda     :   "/api/busqueda",
                            rutaAPICategorias   :   "/api/categorias",
                            rutaAPIMonedas      :   "/api/monedas",
                            rutaAPIPaises       :   "/api/paises",
                            rutaAPIPlataformas  :   "/api/plataformas",
                            rutaAPIProductos    :   "/api/productos",
                            rutaAPIRoles        :   "/api/roles",
                            rutaAPIUsuarios     :   "/api/usuarios",
                        };
        this.app=express();
        //Enlace a BD Mongo:
        this.conectarBase();
        //Middleware:
        this.generarMiddleware();
        //Fin middleware
        //Establecer rutas:
        this.establecerRutas();
    }
    //Get-Set:

    //Métodos:
    async conectarBase()
    {
        await conectarMongo();
    }

    generarMiddleware()
    {
        //Activar CORS:
        this.app.use(cors());
        //Lectura y análisis de datos del cuerpo de una petición.
        this.app.use(express.json());
        //Establecer carpeta pública:
        this.app.use(express.static("public"));
    }

    establecerRutas()
    {
        this.app.use(this.rutas.rutaAPIAcceso,require("../routes/acceso"));
        this.app.use(this.rutas.rutaAPIBusqueda,require("../routes/busqueda"));
        this.app.use(this.rutas.rutaAPICategorias,require("../routes/categoria"));
        this.app.use(this.rutas.rutaAPIMonedas,require("../routes/moneda"));
        this.app.use(this.rutas.rutaAPIPaises,require("../routes/pais"));
        this.app.use(this.rutas.rutaAPIPlataformas,require("../routes/plataforma_origen"));
        this.app.use(this.rutas.rutaAPIProductos,require("../routes/producto"));
        this.app.use(this.rutas.rutaAPIRoles,require("../routes/rol"));
        this.app.use(this.rutas.rutaAPIUsuarios,require("../routes/usuario"));
    }  

    oirPuerto()
    {
        this.app.listen(this.puerto,()=>{
            console.log(`Servidor ejecutándose en el puerto ${this.puerto}`);
        });
    }
}

module.exports=Servidor;