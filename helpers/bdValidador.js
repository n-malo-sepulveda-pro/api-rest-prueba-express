const Rol=require("../models/rol");
const PlataformaOrigen=require("../models/plataforma_origen");
const Usuario=require("../models/usuario");

const consultarRolIngresado=async(rol='')=>{
    const existeRol=await Rol.findOne({glosa_rol:rol});
    if(!existeRol){
        throw new Error(`El rol ingresado no es válido ${rol}`);
    }
};

const consultarApodoIngresado=async(apodo='')=>{
    const existeCasilla=await Usuario.findOne({apodo});
    if(existeCasilla){
        throw new Error(`El apodo ${apodo} está siendo utilizado. Favor ingresar otro`);
    }
};

const consultarUsuarioIngresado=async(idUsuario="")=>{
    const existeUsuario=await Usuario.findById(idUsuario);
    if(!existeUsuario){
        throw new Error(`No existe usuario con el ID ingresado`);
    }
};

const consultarPlataformaIngresada=async(id_p_ori="")=>{
    const existePlataforma=await PlataformaOrigen.findById(id_p_ori);
    if(!existePlataforma)
    {
        throw new Error(`No existe plataforma asociada al ID ingresado`);
    }
};



module.exports  =   {
                        validarIdUsuario:consultarUsuarioIngresado,
                        validarRol:consultarRolIngresado,
                        validarApodo:consultarApodoIngresado,
                        validarPlataforma:consultarPlataformaIngresada
                    };
