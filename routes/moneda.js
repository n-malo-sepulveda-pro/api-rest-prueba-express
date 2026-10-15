const { Router:enrutador }=require("express");
const {check:validar}=require("express-validator");

const LISTA_DE_ROLES_ADMIN=require("../constants/roles-admin");
const   {
            listar,
            obtener,
            crear,
            modificar,
            ajustar,
            quitar
        }=require("../controllers/moneda");
const   {
            mostrarMensajeDefectoGet,
            mostrarMensajeDefectoPost,
            mostrarMensajeDefectoPut,
            mostrarMensajeDefectoPatch,
            mostrarMensajeDefectoDelete,
        }=require("../controllers/defecto");
const   {
            validarJWT,
            validarCampos,
            validarAdministrador
        }=require("../middleware");
const   {
            validarMoneda,
            validarPais
        }=require("../helpers/db-validador");
const objEnrutador=enrutador();

//Rutinas GET:
objEnrutador.get('/',listar);
objEnrutador.get('/:idMoneda',[
    validar('idMoneda', 'No es un ID de Mongo válido').isMongoId(),
    validar('idMoneda').custom(validarMoneda),
    validarCampos
],obtener);
objEnrutador.get('{*any}', mostrarMensajeDefectoGet);
//Rutinas POST:
objEnrutador.post('/',[    
    validarJWT,
    validar('id_pais', 'No es un ID de Mongo válido').isMongoId(),
    validar('id_pais').custom(validarPais),
    validar('glosa_mon','Favor ingresar un nombre de moneda').not().isEmpty(),
    validar('simbol_mon','Favor ingresar un símbolo de moneda').not().isEmpty(),
    validarCampos
],crear);
objEnrutador.post('{*any}',mostrarMensajeDefectoPost);
//Rutinas PUT:
objEnrutador.put('/:idMoneda',[
    validarJWT,
    validar('idMoneda', 'No es un ID de Mongo válido').isMongoId(),
    validar('idMoneda').custom(validarMoneda),
    validar('id_pais', 'No es un ID de Mongo válido').isMongoId(),
    validar('id_pais').custom(validarPais),
    validar('glosa_mon','Favor ingresar un nombre de moneda').not().isEmpty(),
    validar('simbol_mon','Favor ingresar un símbolo de moneda').not().isEmpty(),
    validarCampos
],modificar);
objEnrutador.put('{*any}', mostrarMensajeDefectoPut);
//Rutinas PATCH:
objEnrutador.patch('/:idMoneda',ajustar);
objEnrutador.patch('{*any}',mostrarMensajeDefectoPatch);
//Rutinas DELETE:
objEnrutador.delete('/:idMoneda',[
    validarJWT,
    validarAdministrador(LISTA_DE_ROLES_ADMIN.ROL_ADMINISTRADOR,LISTA_DE_ROLES_ADMIN.ROL_SUPERUSUARIO),
    validar('idMoneda', 'No es un ID de Mongo válido').isMongoId(),
    validar('idMoneda').custom(validarMoneda),
    validarCampos
],quitar);
objEnrutador.delete('{*any}', mostrarMensajeDefectoDelete);

module.exports=objEnrutador;