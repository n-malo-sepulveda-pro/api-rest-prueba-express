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
        }=require("../controllers/producto");

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
            validarProducto,
            validarCategorias,
            validarPrecios
        }=require("../helpers/db-validador");
const objEnrutador=enrutador();
//Rutinas GET:
objEnrutador.get('/',listar);
objEnrutador.get('/:idProducto',[
    validar('idProducto', 'No es un ID de Mongo válido').isMongoId(),
    validar('idProducto').custom(validarProducto),
    validarCampos
],obtener);
objEnrutador.get('{*any}', mostrarMensajeDefectoGet);
//Rutinas POST:
objEnrutador.post('/',[    
    validarJWT,
    validar('categorias').custom(validarCategorias),
    validar('precios').custom(validarPrecios),
    validar('nombre_prod','Favor ingresar un nombre de producto').not().isEmpty(),
    validar('descr_prod','Favor ingresar una descripción de producto').not().isEmpty(),
    validarCampos
],crear);
//Rutinas PUT:
objEnrutador.put('/:idProducto',[
    validarJWT,
    validar('idProducto', 'No es un ID de Mongo válido').isMongoId(),
    validar('idProducto').custom(validarProducto),
    validar('nombre_prod','Favor ingresar un nombre de producto').not().isEmpty(),
    validar('descr_prod','Favor ingresar una descripción de producto').not().isEmpty(),
    validar('categorias').custom(validarCategorias),
    validar('precios').custom(validarPrecios),
    validarCampos
],modificar);
objEnrutador.put('{*any}', mostrarMensajeDefectoPut);
//Rutinas PATCH:
objEnrutador.patch('/:idProducto',ajustar);
objEnrutador.patch('{*any}',mostrarMensajeDefectoPatch);
//Rutinas DELETE:
objEnrutador.delete('/:idProducto',[
    validarJWT,
    validarAdministrador(LISTA_DE_ROLES_ADMIN.ROL_ADMINISTRADOR,LISTA_DE_ROLES_ADMIN.ROL_SUPERUSUARIO),
    validar('idProducto', 'No es un ID de Mongo válido').isMongoId(),
    validar('idProducto').custom(validarProducto),
    validarCampos
],quitar);
objEnrutador.delete('{*any}', mostrarMensajeDefectoDelete);


module.exports=objEnrutador;