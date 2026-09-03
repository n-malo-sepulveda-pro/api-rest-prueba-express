const{request,response}=require("express");
const objJWT=require("jsonwebtoken");

const Usuario=require("../models/usuario");

const validarJWT=async(req=request,res=response,rutina)=>{
    const valorToken=req.header("x-api-key");
    if(!valorToken)
    {
        return res.status(401).json({
            mensaje:"No autorizado: favor ingresar un Token"
        });
    }
    try 
    {
        const {idUsuario}=objJWT.verify(valorToken,process.env.LLAVE_SECRETA);
        //Obtener usuario correspondiente al ID asociado al Token.
        const usuarioProceso=await Usuario.findById(idUsuario);
        if(!usuarioProceso)
        {
            return res.status(401).json({
            mensaje:"No autorizado: cuenta de usuario inexistente"
        });
        }
        //Verificar si el usuario está vigente
        if(!usuarioProceso.es_vigente)
        {
            return res.status(401).json({
                mensaje:"No autorizado: cuenta de usuario inactiva"
            });
        }

        req.usuarioProceso=usuarioProceso;

        rutina();
    } 
    catch (error)
    {
        console.log(error);
        res.status(401).json({
            mensaje:"No autorizado: favor ingresar un Token válido"
        });
    }
    
};

module.exports  =   {
                        validarJWT
                    };