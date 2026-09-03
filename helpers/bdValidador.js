const Rol=require("../models/rol");
const PlataformaOrigen=require("../models/plataforma_origen");
const Usuario=require("../models/usuario");
const {verificarEncriptado}=require("./cripto");

const consultarRolIngresado=async(rol='')=>{
    const existeRol=await Rol.findOne({glosa_rol:rol});
    if(!existeRol){
        throw new Error(`El rol ingresado no es válido ${rol}`);
    }
};

const consultarApodoIngresado=async(usuario='')=>{
    const existeCasilla=await Usuario.findOne({apodo:usuario});
    if(existeCasilla){
        throw new Error(`El apodo ${apodo} está siendo utilizado. Favor ingresar otro`);
    }
};

const comprobarApodoIngresado=async(usuario='')=>{
    const existeApodo=await Usuario.findOne({apodo:usuario,es_vigente:true});
    if(existeApodo==="null"){
        throw new Error(`El apodo ${apodo} no existe en el sistema. Favor ingresar otro`);
    }
};

const comprobarUsuarioYContrasenna=async(apodo='',contrasenna="")=>{
    const objUsuario=await Usuario.findOne({apodo,es_vigente:true});
    if(!objUsuario)
    {
        return (`Credenciales de acceso no válidas. Favor intentar nuevamente`);
    }
   if(!verificarEncriptado(contrasenna,objUsuario.contrasenna))
    {
        return (`Contraseña no válida. Favor intentar nuevamente`);
    }
    return true;
};

const consultarUsuarioIngresado=async(idUsuario="")=>{
    const existeUsuario=await Usuario.findById(idUsuario);
    if(!existeUsuario){
        throw new Error(`No existe usuario con el ID ingresado`);
    }
};

const obtenerUsuarioPorApodo=async(apodo="")=>{
    const fichaUsuario=await Usuario.find({apodo}).limit(1);
    return fichaUsuario[0];
}

const consultarPlataformaIngresada=async(id_p_ori="")=>{
    const existePlataforma=await PlataformaOrigen.findById(id_p_ori);
    if(!existePlataforma)
    {
        throw new Error(`No existe plataforma asociada al ID ingresado`);
    }
};



module.exports  =   {
                        comprobarCredenciales:comprobarUsuarioYContrasenna,
                        consultarUsuario:comprobarApodoIngresado,
                        validarIdUsuario:consultarUsuarioIngresado,
                        validarRol:consultarRolIngresado,
                        validarApodo:consultarApodoIngresado,
                        validarPlataforma:consultarPlataformaIngresada,
                        consultarUsuarioApodo:obtenerUsuarioPorApodo
                    };
