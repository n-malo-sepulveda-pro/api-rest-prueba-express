const{response,request}=require("express");
require("dotenv").config();

//Rutinas GET:
const obtenerDatosUsuario=(req=request,res=response)=>{
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
const ingresarUsuario=(req,res=response)=>{
    const {nombres,apellido01,apellido02, fecha_nacimiento:fechaNacimiento}=req.body, nombrePersona = `${nombres} ${apellido01} ${apellido02}`;
    const objetoSalida={
        mensaje:"petición a la API de tipo POST desde el controlador",
        nombrePersona,
        fechaNacimiento
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
const modificarUsuario=(req,res=response)=>{

    const idUsuario=req.params.idUsuarioEntrada;
    const objetoSalida={
        idUsuario,
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
const ajustarUsuario=(req,res=response)=>{
    const idUsuario=req.params.idUsuarioEntrada;
    const objetoSalida={
        idUsuario,
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
const quitarUsuario=(req,res=response)=>{
    const idUsuario=req.params.idUsuarioEntrada;
    const objetoSalida={
        idUsuario,
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
                        obtenerDatosUsuario,
                        ingresarUsuario,
                        modificarUsuario,
                        ajustarUsuario,
                        quitarUsuario,
                        mostrarMensajeDefectoGet,
                        mostrarMensajeDefectoPost,
                        mostrarMensajeDefectoPut,
                        mostrarMensajeDefectoPatch,
                        mostrarMensajeDefectoDelete
                    };