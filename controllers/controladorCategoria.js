const{response,request}=require("express");
require("dotenv-expand").expand({ ignoreProcessEnv: false });
const Categoria=require("../models/categoria");

//Rutinas GET:
const obtenerDatosCategoria=(req=request,res=response)=>{
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
const mostrarMensajeDefectoGet=(req, res=response)=> {
    const objetoSalida={
        mensaje:"ruta no encontrada (GET) en controlador"
    };
    res.status(404).json(objetoSalida);
};
//Rutinas POST:
const ingresarCategoria=async(req,res=response)=>{
    
    const {glosa_cat:glosaCategoria}=req.body;

    const objCategoria=new Categoria({
        glosa_cat:glosaCategoria
    });
    await objCategoria.save();
    const objetoSalida={
        mensaje:"petición a la API de tipo POST desde el controlador",
        id: objCategoria._id,
        glosa: glosaCategoria
    };
    res.status(201).json(objetoSalida);
};
const mostrarMensajeDefectoPost=(req, res=response)=> {
    const objetoSalida={
        mensaje:"ruta no encontrada (POST) en controlador"
    };
    res.status(404).json(objetoSalida);
};
//Rutinas PUT:
const modificarCategoria=(req,res=response)=>{

    const idCategoria=req.params.idCategoriaEntrada;
    const objetoSalida={
        idCategoria,
        mensaje:"petición a la API de tipo PUT desde el controlador"
    };
    res.json(objetoSalida);
};
const mostrarMensajeDefectoPut=(req, res=response)=>{
    const objetoSalida={
        mensaje:"ruta no encontrada (PUT) en controlador"
    };
    res.status(404).json(objetoSalida);
};
//Rutinas PATCH:
const ajustarCategoria=(req,res=response)=>{
    const idCategoria=req.params.idCategoriaEntrada;
    const objetoSalida={
        idCategoria,
        mensaje:"petición a la API de tipo PATCH desde el controlador"
    };
    res.status(400).json(objetoSalida);
};
const mostrarMensajeDefectoPatch=(req, res=response)=>{
    const objetoSalida={
        mensaje:"ruta no encontrada (PATCH) en controlador"
    };
    res.status(404).json(objetoSalida);
};
//Rutinas DELETE:
const quitarCategoria=(req,res=response)=>{
    const idCategoria=req.params.idCategoriaEntrada;
    const objetoSalida={
        Categoria,
        mensaje:"petición a la API de tipo DELETE desde el controlador"
    };
    res.json(objetoSalida);
};
const mostrarMensajeDefectoDelete=(req, res=response)=>{
    const objetoSalida={
        mensaje:"ruta no encontrada (DELETE) en controlador"
    };
    res.status(404).json(objetoSalida);
};

module.exports  =   {
                        obtener:obtenerDatosCategoria,
                        crear:ingresarCategoria,
                        modificar:modificarCategoria,
                        ajustar:ajustarCategoria,
                        quitar:quitarCategoria,
                        mostrarMensajeDefectoGet,
                        mostrarMensajeDefectoPost,
                        mostrarMensajeDefectoPut,
                        mostrarMensajeDefectoPatch,
                        mostrarMensajeDefectoDelete
                    };