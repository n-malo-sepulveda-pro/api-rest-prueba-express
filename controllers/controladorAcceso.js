const{response,request}=require("express");
const objMongoose=require('mongoose');
require("dotenv-expand").expand({ ignoreProcessEnv: false });
const Usuario=require("../models/usuario");
const {comprobarCredenciales,consultarUsuarioApodo}=require("../helpers/bdValidador");
const {generarToken}=require("../helpers/rutinas-jwt");


const accederSistema=async(req=request,res=response)=>{
    const {usuario,contrasenna}=req.body;
    try 
    {
        let textoMensaje="Acceso en preparación";
        let estaCorrecto=true;
        const objUsuario=new Usuario({apodo:usuario,contrasenna});
        const existeUsuario=await comprobarCredenciales(usuario,contrasenna);
        if(existeUsuario!==true)
        {
            textoMensaje=existeUsuario;
            estaCorrecto=false;
        }
        const fichaUsuario=await consultarUsuarioApodo(usuario);
        const idUsuario=fichaUsuario._id.toString();


        let objetoSalida={
            mensaje:textoMensaje,
            token:null
        };
        if(estaCorrecto)
        {
            const valorToken=await generarToken(idUsuario);
            objetoSalida.usuario=usuario;
            objetoSalida.token=valorToken.toString();
        }
        res.json(objetoSalida);
    } 
    catch (error)
    {
        const objSalidaFallido={
            mensaje: "Favor comunicarse con el administrador"
        };
        console.log(`Detalle del error:\n${error}`);
        return res.status(500).json(objSalidaFallido);
    }
    
};

module.exports  =   {
                        acceder:accederSistema
                    };