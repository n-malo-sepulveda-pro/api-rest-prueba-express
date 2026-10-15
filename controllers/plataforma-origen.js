const{response,request}=require("express");
require("dotenv-expand").expand({ parsed: process.env });
const PlataformaOrigen=require("../models");

//Rutinas GET:
const obtenerDatosPlataformaOrigen=(req=request,res=response)=>{
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
const ingresarPlataformaOrigen=async(req,res=response)=>{
    
    const {glosa_p_ori:glosaPlataformaOrigen}=req.body;

    const objPlataformaOrigen=new PlataformaOrigen({
        glosa_p_ori:glosaPlataformaOrigen
    });
    await objPlataformaOrigen.save();
    const objetoSalida={
        mensaje:"petición a la API de tipo POST desde el controlador",
        _id: objPlataformaOrigen._id,
        glosa: glosaPlataformaOrigen
    };
    res.status(201).json(objetoSalida);
};
//Rutinas PUT:
const modificarPlataformaOrigen=(req,res=response)=>{

    const idPlataforma=req.params.idPlataformaEntrada;
    const objetoSalida={
        idPlataforma,
        mensaje:"petición a la API de tipo PUT desde el controlador"
    };
    res.json(objetoSalida);
};
//Rutinas PATCH:
const ajustarPlataformaOrigen=(req,res=response)=>{
    const idPlataforma=req.params.idPlataformaEntrada;
    const objetoSalida={
        idPlataforma,
        mensaje:"petición a la API de tipo PATCH desde el controlador"
    };
    res.status(400).json(objetoSalida);
};
//Rutinas DELETE:
const quitarPlataformaOrigen=(req,res=response)=>{
    const idPlataforma=req.params.idPlataformaEntrada;
    const objetoSalida={
        idPlataforma,
        mensaje:"petición a la API de tipo DELETE desde el controlador"
    };
    res.json(objetoSalida);
};

module.exports  =   {
                        obtener:obtenerDatosPlataformaOrigen,
                        crear:ingresarPlataformaOrigen,
                        modificar:modificarPlataformaOrigen,
                        ajustar:ajustarPlataformaOrigen,
                        quitar:quitarPlataformaOrigen,
                    };