const { Router:enrutador }=require("express");
const {check:validar}=require("express-validator");
const   {
            obtener,
            crear,
            modificar,
            ajustar,
            quitar,
            mostrarMensajeDefectoGet,
            mostrarMensajeDefectoPost,
            mostrarMensajeDefectoPut,
            mostrarMensajeDefectoPatch,
            mostrarMensajeDefectoDelete,
        }=require("../controllers/controladorRol");
const {validarCampos}=require("../middleware/validador-campos");

const objEnrutador=enrutador();

//Rutinas GET:
objEnrutador.get('/',obtener);
objEnrutador.get('{*any}', mostrarMensajeDefectoGet);
//Rutinas POST:
objEnrutador.post('/',[
    validar('glosa_rol','Favor ingresar una glosa de rol').not().isEmpty(),
    validarCampos
],crear);
objEnrutador.post('{*any}',mostrarMensajeDefectoPost);
//Rutinas PUT:
objEnrutador.put('/:idRolEntrada',modificar);
objEnrutador.put('{*any}', mostrarMensajeDefectoPut);
//Rutinas PATCH:
objEnrutador.patch('/:idRolEntrada',ajustar);
objEnrutador.patch('{*any}',mostrarMensajeDefectoPatch);
//Rutinas DELETE:
objEnrutador.delete('/:idRolEntrada',quitar);        
objEnrutador.delete('{*any}', mostrarMensajeDefectoDelete);

module.exports=objEnrutador;