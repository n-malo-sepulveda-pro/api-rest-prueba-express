const{response,request}=require("express");
const objMongoose=require('mongoose');
require("dotenv-expand").expand({ ignoreProcessEnv: false });
const {encriptarSimple}=require("../helpers/encriptador");
const {Usuario}=require("../models");

//Rutinas GET:
const obtenerUsuarios=async(req=request,res=response)=>{
    const{limite=5,desde=0}=req.query;    

    const [cantidadRegistros,listaDeUsuarios]=await Promise.all([
        Usuario.countDocuments({es_vigente:true}),
        Usuario.find({es_vigente:true})
            .skip(parseInt(desde,10))
            .limit(parseInt(limite,10))
    ]);
    res.json({
        "status"    :   process.env.TODO_BIEN,
        "salida"    :   {
                            "cantidad"  :   cantidadRegistros,
                            "detalle"   :   listaDeUsuarios
                        }
    })
};
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
//Rutinas POST:
const ingresarUsuario=async(req,res=response)=>{    
    
    const {id_p_ori,rol,apellido01,apellido02,nombres,apodo,correo,contrasenna,fecha_nacimiento}=req.body,nombre_persona = `${nombres} ${apellido01}`;
    let apellidoSecundario = (apellido02 === "null") ? "" : apellido02;
    const pase_encriptado=encriptarSimple(contrasenna);
    const objUsuario=new Usuario({
        id_p_ori:new objMongoose.Types.ObjectId(id_p_ori),
        rol,
        apellido01,
        apellido02:apellidoSecundario,
        nombres,
        fecha_nacimiento,
        apodo,
        correo,
        contrasenna:pase_encriptado
    });
    await objUsuario.save();

    //const {nombres,apellido01,apellido02, fecha_nacimiento:fechaNacimiento}=req.body, nombre_persona = `${nombres} ${apellido01} ${apellido02}`;
    const objetoSalida={
        mensaje:"petición a la API de tipo POST desde el controlador",
        nombre_persona,
        fecha_nacimiento,
        correo,
        apodo
    };
    res.status(201).json(objetoSalida);
};
//Rutinas PUT:
const modificarUsuario=async(req,res=response)=>{

    const {idUsuario}=req.params;
    const {uid,contrasenna,id_p_ori,correo,...ficha}=req.body,nombre_persona = `${nombres} ${apellido01}`;
    //Rutina de verificación de contraseña
    if(contrasenna)
    {
        const pase_encriptado=encriptarSimple(contrasenna);
    }
    //Fin rutina
    const objUsuario=new Usuario({
        
        rol,
        apellido01,
        apellido02:apellidoSecundario,
        nombres,
        fecha_nacimiento,
        apodo,
        correo,
        contrasenna:pase_encriptado
    });
    const objUsuarioActualizable=await Usuario.findByIdAndUpdate(idUsuario, objUsuario);
    
    const objetoSalida={
        idUsuario,
        mensaje:"petición a la API de tipo PUT desde el controlador"
    };
    res.json(objetoSalida);
};
//Rutinas PATCH:
const ajustarUsuario=async(req,res=response)=>{
    const idUsuario=req.params.idUsuario;
    const objetoSalida={
        idUsuario,
        mensaje:"petición a la API de tipo PATCH desde el controlador"
    };
    res.status(400).json(objetoSalida);
};
//Rutinas DELETE:
const quitarUsuario=async(req,res=response)=>{
    const {idUsuario}=req.params;
    
    const usuarioProcesado=await Usuario.findByIdAndUpdate(idUsuario,{es_vigente:false});
    //obtener usuario ejecutor del proceso.
    
    const usuarioProceso=req.usuarioProceso;
    const objetoSalida={
        mensaje:"Usuario eliminado",
        usuarioProcesado,
        usuarioProceso
    };
    res.json(objetoSalida);
};

module.exports  =   {
                        listar:obtenerUsuarios,
                        consultar:obtenerDatosUsuario,
                        crear:ingresarUsuario,
                        modificar:modificarUsuario,
                        ajustar:ajustarUsuario,
                        quitar:quitarUsuario
                    };