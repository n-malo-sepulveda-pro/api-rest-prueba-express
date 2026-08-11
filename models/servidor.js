require("dotenv").config();
const express=require("express");
const cors=require("cors");

class Servidor
{
    //Atributos:

    //Constructores:
    constructor()
    {
        this.puerto=process.env.PUERTO;
        this.rutaApiUsuarios="/api/usuarios";
        this.app=express();
        //Middleware:
        this.generarMiddleware();
        //Fin middleware
        //Establecer rutas:
        this.establecerRutas();
    }
    //Get-Set:

    //Métodos:
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
    }  

    oirPuerto()
    {
        this.app.listen(this.puerto,()=>{
            console.log(`Servidor ejecutándose en el puerto ${this.puerto}`);
        });
    }
}

module.exports=Servidor;