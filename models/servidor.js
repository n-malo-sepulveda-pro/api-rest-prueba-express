process.loadEnvFile();
require("dotenv-expand").expand({ ignoreProcessEnv: false });
const express=require("express");
const cors=require("cors");

const   {
            conectarMongo
        }=require("../db/bdConfigurador");

class Servidor
{
    //Atributos:

    //Constructores:
    constructor()
    {
        this.puerto=process.env.PUERTO;
        this.rutaApiUsuarios="/api/usuarios";
        this.rutaApiRoles="/api/roles";
        this.rutaApiCategorias="/api/categorias";
        this.rutaApiPlataformas="/api/plataformas";
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
        this.app.use(this.rutaApiUsuarios,require("../routes/usuario"));
        this.app.use(this.rutaApiCategorias,require("../routes/categoria"));
        this.app.use(this.rutaApiPlataformas,require("../routes/plataforma_origen"));
        this.app.use(this.rutaApiRoles,require("../routes/rol"));
    }  

    oirPuerto()
    {
        this.app.listen(this.puerto,()=>{
            console.log(`Servidor ejecutándose en el puerto ${this.puerto}`);
        });
    }
}

module.exports=Servidor;