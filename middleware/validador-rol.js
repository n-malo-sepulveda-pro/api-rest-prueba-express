const {request,response}=require("express");

const validarRolAdministrador=(...listaRolesAdmitidos)=>{

    return (req=request,res=response,rutinaSiguiente)=>{
        if(!req.usuarioProceso)
        {
            return res.status(500).json({
                mensaje:"No autorizado: favor ingresar un Token para su revisión"
            });
        }
        const {rol:rolUsuarioProceso,apodo}=req.usuarioProceso;

        if((!listaRolesAdmitidos.includes(rolUsuarioProceso)))
        {
            return res.status(401).json({
                mensaje:`El usuario ${apodo} no tiene autorización para efectuar la operación solicitada`
            });
        }

        rutinaSiguiente();
    }
    
};

module.exports  =   {
                        validarAdministrador:validarRolAdministrador
                    };