const { Router:enrutador }=require("express");
const {check:validar}=require("express-validator");
const LISTA_DE_ROLES_ADMIN=require("../constants/roles-admin");
const   {
            listar,
            consultar,
            crear,
            modificar,
            ajustar,
            quitar,
            mostrarMensajeDefectoGet,
            mostrarMensajeDefectoPost,
            mostrarMensajeDefectoPut,
            mostrarMensajeDefectoPatch,
            mostrarMensajeDefectoDelete,
        }=require("../controllers/controladorUsuario");
const   {
            validarCampos,
            validarJWT,
            validarAdministrador
        }=require("../middleware");
const   {
            validarIdUsuario,
            validarRol,
            validarApodo,
            validarPlataforma
        }=require("../helpers/bdValidador");
const Rol=require("../models/rol");

const objEnrutador=enrutador();

//Rutinas GET:
objEnrutador.get('/',listar);
objEnrutador.get('{*any}', mostrarMensajeDefectoGet);
//Rutinas POST:
objEnrutador.post('/',[
    validar('id_p_ori', 'No es un ID de Mongo válido').isMongoId(),
    validar('id_p_ori').custom(validarPlataforma),
    validar('apellido01','Favor ingresar el apellido principal').not().isEmpty(),
    validar('nombres','Favor ingresar los nombres').not().isEmpty(),
    validar('correo','La dirección de correo electrónico no es válida').isEmail(),
    validar('apodo','El apodo debe tener, al menos, ocho caracteres').isLength({min: 8}),
    validar('apodo').custom(validarApodo),
    validar('contrasenna','La contraseña debe tener, al menos, diez caracteres').isLength({min: 10}),
    validar('rol').custom(validarRol),
    validarCampos
],crear);
objEnrutador.post('{*any}',mostrarMensajeDefectoPost);
//Rutinas PUT:
objEnrutador.put('/:idUsuario',[
    validar('idUsuario', 'No es un ID de Mongo válido').isMongoId(),
    validar('idUsuario').custom(validarIdUsuario),
    validar('rol').custom(validarRol),
    validar('apellido01','Favor ingresar el apellido principal').not().isEmpty(),
    validar('nombres','Favor ingresar los nombres').not().isEmpty(),
    validar('correo','La dirección de correo electrónico no es válida').isEmail(),
    validar('apodo','El apodo debe tener, al menos, ocho caracteres').isLength({min: 8}),
    validar('apodo').custom(validarApodo),
    validar('contrasenna','La contraseña debe tener, al menos, diez caracteres').isLength({min: 10}),
    validarCampos
],modificar);
objEnrutador.put('{*any}', mostrarMensajeDefectoPut);
//Rutinas PATCH:
objEnrutador.patch('/:idUsuario'[
    validar('idUsuario', 'No es un ID de Mongo válido').isMongoId(),
    validar('idUsuario').custom(validarIdUsuario), 
    validarCampos
],ajustar);
objEnrutador.patch('{*any}',mostrarMensajeDefectoPatch);
//Rutinas DELETE:
objEnrutador.delete('/:idUsuario',[
    validarJWT,
    validarAdministrador(LISTA_DE_ROLES_ADMIN.ROL_ADMINISTRADOR,LISTA_DE_ROLES_ADMIN.ROL_SUPERUSUARIO),
    validar('idUsuario', 'No es un ID de Mongo válido').isMongoId(),
    validar('idUsuario').custom(validarIdUsuario),
    validarCampos
],quitar);        
objEnrutador.delete('{*any}', mostrarMensajeDefectoDelete);

module.exports=objEnrutador;