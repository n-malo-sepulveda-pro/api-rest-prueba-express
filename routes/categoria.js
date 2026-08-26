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
        }=require("../controllers/controladorCategoria");
const {validarCampos}=require("../middleware/validador-campos");

const objEnrutador=enrutador();

//Rutinas GET:
objEnrutador.get('/',obtener);
objEnrutador.get('{*any}', mostrarMensajeDefectoGet);
//Rutinas POST:
objEnrutador.post('/',[
    validar('glosa_cat','Favor ingresar una glosa de categoría').not().isEmpty(),
    validarCampos
],crear);
objEnrutador.post('{*any}',mostrarMensajeDefectoPost);
//Rutinas PUT:
objEnrutador.put('/:idCategoriaEntrada',modificar);
objEnrutador.put('{*any}', mostrarMensajeDefectoPut);
//Rutinas PATCH:
objEnrutador.patch('/:idCategoriaEntrada',ajustar);
objEnrutador.patch('{*any}',mostrarMensajeDefectoPatch);
//Rutinas DELETE:
objEnrutador.delete('/:idCategoriaEntrada',quitar);        
objEnrutador.delete('{*any}', mostrarMensajeDefectoDelete);

module.exports=objEnrutador;