const { Router:enrutador }=require("express");
const {check:validar}=require("express-validator");

const LISTA_DE_ROLES_ADMIN=require("../constants/roles-admin");
const   {
            validarPais
        }=require("../helpers/db-validador");
const   {
            validarJWT,
            validarCampos,
            validarAdministrador
        }=require("../middleware");
const   {
            listar,
            obtener,
            crear,
            modificar,
            ajustar,
            quitar
        }=require("../controllers/pais");
const   {
            mostrarMensajeDefectoGet,
            mostrarMensajeDefectoPost,
            mostrarMensajeDefectoPut,
            mostrarMensajeDefectoPatch,
            mostrarMensajeDefectoDelete
        }=require("../controllers/defecto");
const objEnrutador=enrutador();

//Rutinas GET:
objEnrutador.get('/',listar);
objEnrutador.get('/:idPais',[
    validar('idPais', 'No es un ID de Mongo válido').isMongoId(),
    validar('idPais').custom(validarPais),
    validarCampos
],obtener);
objEnrutador.get('{*any}', mostrarMensajeDefectoGet);
//Rutinas POST:
objEnrutador.post('/',[    
    validarJWT,
    validar('nom_pais','Favor ingresar un nombre de país').not().isEmpty(),    
    validarCampos
],crear);
objEnrutador.post('{*any}',mostrarMensajeDefectoPost);
//Rutinas PUT:
objEnrutador.put('/:idPais',[
    validarJWT,
    validar('idPais', 'No es un ID de Mongo válido').isMongoId(),
    validar('idPais').custom(validarPais),
    validar('nom_pais','Favor ingresar un nombre de país').not().isEmpty(),
    validarCampos
],modificar);
objEnrutador.put('{*any}', mostrarMensajeDefectoPut);
//Rutinas PATCH:
objEnrutador.patch('/:idPais',ajustar);
objEnrutador.patch('{*any}',mostrarMensajeDefectoPatch);
//Rutinas DELETE:
objEnrutador.delete('/:idPais',[
    validarJWT,
    validarAdministrador(LISTA_DE_ROLES_ADMIN.ROL_ADMINISTRADOR,LISTA_DE_ROLES_ADMIN.ROL_SUPERUSUARIO),
    validar('idPais', 'No es un ID de Mongo válido').isMongoId(),
    validar('idPais').custom(validarPais),
    validarCampos
],quitar);
objEnrutador.delete('{*any}', mostrarMensajeDefectoDelete);

module.exports=objEnrutador;