const{response,request}=require("express");

//Rutina GET:
const mostrarMensajeDefectoGet=(req, res=response)=> {
    const objetoSalida={
        mensaje:"ruta no encontrada (GET) en controlador"
    };
    res.status(404).json(objetoSalida);
};
//Rutina POST:
const mostrarMensajeDefectoPost=(req, res=response)=> {
    const objetoSalida={
        mensaje:"ruta no encontrada (POST) en controlador"
    };
    res.status(404).json(objetoSalida);
};
//Rutina PUT:
const mostrarMensajeDefectoPut=(req, res=response)=>{
    const objetoSalida={
        mensaje:"ruta no encontrada (PUT) en controlador"
    };
    res.status(404).json(objetoSalida);
};
//Rutina PATCH:
const mostrarMensajeDefectoPatch=(req, res=response)=>{
    const objetoSalida={
        mensaje:"ruta no encontrada (PATCH) en controlador"
    };
    res.status(404).json(objetoSalida);
};
//Rutina DELETE:
const mostrarMensajeDefectoDelete=(req, res=response)=>{
    const objetoSalida={
        mensaje:"ruta no encontrada (DELETE) en controlador"
    };
    res.status(404).json(objetoSalida);
};

module.exports  =   {
                        mostrarMensajeDefectoGet,
                        mostrarMensajeDefectoPost,
                        mostrarMensajeDefectoPut,
                        mostrarMensajeDefectoPatch,
                        mostrarMensajeDefectoDelete
                    };