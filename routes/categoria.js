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
        }=require("../controllers/categoria");
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
            validarCategoria
        }=require("../helpers/db-validador");
const objEnrutador=enrutador();

//Rutinas GET:
objEnrutador.get('/',listar);
objEnrutador.get('/:idCategoria',[
    validar('idCategoria', 'No es un ID de Mongo válido').isMongoId(),
    validar('idCategoria').custom(validarCategoria),
    validarCampos
],obtener);
objEnrutador.get('{*any}', mostrarMensajeDefectoGet);
//Rutinas POST:
objEnrutador.post('/',[    
    validarJWT,
    validar('glosa_cat','Favor ingresar una glosa de categoría').not().isEmpty(),    
    validarCampos
],crear);
objEnrutador.post('{*any}',mostrarMensajeDefectoPost);
//Rutinas PUT:
objEnrutador.put('/:idCategoria',[
    validarJWT,
    validar('idCategoria', 'No es un ID de Mongo válido').isMongoId(),
    validar('idCategoria').custom(validarCategoria),
    validar('glosa_cat','Favor ingresar una glosa de categoría').not().isEmpty(),
    validarCampos
],modificar);
objEnrutador.put('{*any}', mostrarMensajeDefectoPut);
//Rutinas PATCH:
objEnrutador.patch('/:idCategoria',ajustar);
objEnrutador.patch('{*any}',mostrarMensajeDefectoPatch);
//Rutinas DELETE:
objEnrutador.delete('/:idCategoria',[
    validarJWT,
    validarAdministrador(LISTA_DE_ROLES_ADMIN.ROL_ADMINISTRADOR,LISTA_DE_ROLES_ADMIN.ROL_SUPERUSUARIO),
    validar('idCategoria', 'No es un ID de Mongo válido').isMongoId(),
    validar('idCategoria').custom(validarCategoria),
    validarCampos
],quitar);        
objEnrutador.delete('{*any}', mostrarMensajeDefectoDelete);

module.exports=objEnrutador;