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
        }=require("../controllers/controladorPlataformaOrigen");
const {validarCampos}=require("../middleware/validador-campos");

const objEnrutador=enrutador();

//Rutinas GET:
objEnrutador.get('/',obtener);
objEnrutador.get('{*any}', mostrarMensajeDefectoGet);
//Rutinas POST:
objEnrutador.post('/',[
    validar('glosa_p_ori','Favor ingresar una glosa de plataforma de origen').not().isEmpty(),
    validarCampos
],crear);
objEnrutador.post('{*any}',mostrarMensajeDefectoPost);
//Rutinas PUT:
objEnrutador.put('/:idPlataformaEntrada',modificar);
objEnrutador.put('{*any}', mostrarMensajeDefectoPut);
//Rutinas PATCH:
objEnrutador.patch('/:idPlataformaEntrada',ajustar);
objEnrutador.patch('{*any}',mostrarMensajeDefectoPatch);
//Rutinas DELETE:
objEnrutador.delete('/:idPlataformaEntrada',quitar);        
objEnrutador.delete('{*any}', mostrarMensajeDefectoDelete);

module.exports=objEnrutador;