const{response,request}=require("express");
const objMongoose=require('mongoose');
require("dotenv-expand").expand({ ignoreProcessEnv: false });
const Usuario=require("../models/usuario");
const PlataformaOrigen=require("../models/plataforma_origen");
const UsuarioPerfilFoto=require("../models/usuario_perfil_foto");
const {comprobarCredenciales,consultarUsuarioApodo}=require("../helpers/bdValidador");
const {generarToken}=require("../helpers/rutinas-jwt");
const {verificarTokenGoogle}=require("../helpers/externo-helper");
const LISTA_DE_ORIGENES_EXTERNOS=require("../constants/origenes");

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

const accederExterno=async(req=request,res=response)=>{
    const {valor_token}=req.body;
    const id_origen=req.query.id_origen;

    try 
    {
        switch(parseInt(id_origen,10)){
            case 1  :   {
                            //const usuarioGoogle=await verificarTokenGoogle(valor_token);
                            const {name:nombreUsuario,email:correoUsuario,picture:rutaImagen}=await verificarTokenGoogle(valor_token);
                            const apodo=correoUsuario.slice(0,correoUsuario.indexOf("@"))+"_g";
                            let fichaUsuario=await Usuario.findOne({apodo});
                            if(fichaUsuario===null)
                            {
                                const {_id:id_p_ori}=await PlataformaOrigen.findOne({glosa_p_ori:LISTA_DE_ORIGENES_EXTERNOS.GOOGLE});
                                const fecha_nacimiento="1980-01-01";


                                const usuarioNuevo={
                                    rol:"Usuario normal",
                                    id_p_ori,
                                    apellido01:".",
                                    apellido02:".",
                                    nombres:nombreUsuario,
                                    apodo,
                                    correo:correoUsuario,
                                    contrasenna:"...",
                                    fecha_nacimiento
                                };
                                fichaUsuario=new Usuario(usuarioNuevo);                                
                                const fichaUsuarioNuevo=await fichaUsuario.save();
                                if(!fichaUsuarioNuevo.es_vigente)
                                {
                                    return res.status(401).json({
                                        mensaje:"Cuenta bloqueada. Favor comunicarse con el administrador"
                                    });
                                }
                                const id_usuario=fichaUsuarioNuevo._id;
                                const fichaImagenPerfil={
                                    id_usuario,
                                    ruta_imagen:rutaImagen, 
                                };
                                const imagenUsuario=new UsuarioPerfilFoto(fichaImagenPerfil);
                                await imagenUsuario.save();
                                const valorToken=await generarToken(id_usuario);
                                const salida=   {
                                                    origen:"Google",
                                                    estado: process.env.TODO_BIEN,
                                                    nombres: nombreUsuario,
                                                    apellido01: ".",
                                                    apellido02: ".",
                                                    apodo,
                                                    correo_electronico:correoUsuario,
                                                    ruta_imagen: rutaImagen,
                                                    token: valorToken

                                                };
                                res.json(salida);
                            }
                            else
                            {
                                const id_usuario=fichaUsuario._id;
                                const rol=fichaUsuario.rol;
                                const id_p_ori=fichaUsuario.id_p_ori;
                                const nombres=fichaUsuario.nombres;
                                const apellido01=fichaUsuario.apellido01;
                                const apellido02=fichaUsuario.apellido02;
                                const apodo=fichaUsuario.apodo;
                                const correo_electronico=fichaUsuario.correo;
                                const {ruta_imagen}=await UsuarioPerfilFoto.findOne({id_usuario,es_vigente:true});
                                const valorToken=await generarToken(id_usuario);

                                const {glosa_p_ori:origen}=await PlataformaOrigen.findById(id_p_ori);
                                const salida={
                                    origen,
                                    rol,
                                    estado: process.env.TODO_BIEN,
                                    nombres,
                                    apellido01,
                                    apellido02,
                                    correo_electronico,
                                    apodo,
                                    ruta_imagen,
                                    token:valorToken
                                };
                                res.json(salida);
                                
                            }
                            break;
                        }
        }
        
    } 
    catch (error) 
    {
        console.log(`error al verificar el token:\n\n${error}`);
        res.status(400).json({
            estado:"Problemas",
            mensaje:"Problemas al verificar el token"
        });
    }
    
};

module.exports  =   {
                        acceder:accederSistema,
                        accederExterno
                    };