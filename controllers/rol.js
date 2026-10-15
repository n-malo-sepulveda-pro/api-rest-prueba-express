const{response,request}=require("express");
require("dotenv-expand").expand({ parsed: process.env });
const {Rol}=require("../models");

//Rutinas GET:
const obtenerDatosRol=(req=request,res=response)=>{
    const {q:operacion,nombre:nombreEntrada="sin datos",apikey:claveAPI,pag:pagina="1",lim:cantidadMaximaFilas=parseInt(process.env.LIMITE_FILAS,10)}=req.query;
    
    const objetoSalida={
        mensaje:"petición a la API de tipo GET desde el controlador",
        operacion,
        nombreEntrada,
        claveAPI,
        pagina,
        cantidadMaximaFilas
    };
    res.json(objetoSalida);
};
//Rutinas POST:
const ingresarRol=async(req,res=response)=>{
    
    const {glosa_rol:glosaRol}=req.body;

    const objRol=new Rol({
        glosa_rol:glosaRol
    });
    await objRol.save();
    const objetoSalida={
        mensaje:"petición a la API de tipo POST desde el controlador",
        id: objRol._id,
        glosa: glosaRol
    };
    res.status(201).json(objetoSalida);
};
//Rutinas PUT:
const modificarRol=(req,res=response)=>{

    const idRol=req.params.idRolEntrada;
    const objetoSalida={
        idRol,
        mensaje:"petición a la API de tipo PUT desde el controlador"
    };
    res.json(objetoSalida);
};
//Rutinas PATCH:
const ajustarRol=(req,res=response)=>{
    const idRol=req.params.idRolEntrada;
    const objetoSalida={
        idRol,
        mensaje:"petición a la API de tipo PATCH desde el controlador"
    };
    res.status(400).json(objetoSalida);
};
//Rutinas DELETE:
const quitarRol=(req,res=response)=>{
    const idRol=req.params.idRolEntrada;
    const objetoSalida={
        idRol,
        mensaje:"petición a la API de tipo DELETE desde el controlador"
    };
    res.json(objetoSalida);
};
module.exports  =   {
                        obtener:obtenerDatosRol,
                        crear:ingresarRol,
                        modificar:modificarRol,
                        ajustar:ajustarRol,
                        quitar:quitarRol
                    };