const{validationResult:resultadoValidacion}=require("express-validator");

const validarCampos=(req,res,rutinaSiguiente)=>{
    const listaDeErrores=resultadoValidacion(req);
    if(!listaDeErrores.isEmpty())
    {
        return res.status(400).json(listaDeErrores);
    }
    rutinaSiguiente();
};

module.exports  =   {
                        validarCampos
                    };