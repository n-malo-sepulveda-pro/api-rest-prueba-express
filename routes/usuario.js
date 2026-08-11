const { Router:enrutador }=require("express");
const   {
            obtenerDatosUsuario,
            ingresarUsuario,
            modificarUsuario,
            ajustarUsuario,
            quitarUsuario,
            mostrarMensajeDefectoGet,
            mostrarMensajeDefectoPost,
            mostrarMensajeDefectoPut,
            mostrarMensajeDefectoPatch,
            mostrarMensajeDefectoDelete,
        }=require("../controllers/controladorUsuario")

const objEnrutador=enrutador();

//Rutinas GET:
objEnrutador.get('/',obtenerDatosUsuario);
objEnrutador.get('{*any}', mostrarMensajeDefectoGet);
//Rutinas POST:
objEnrutador.post('/',ingresarUsuario);
objEnrutador.post('{*any}',mostrarMensajeDefectoPost);
//Rutinas PUT:
objEnrutador.put('/:idUsuarioEntrada',modificarUsuario);
objEnrutador.put('{*any}', mostrarMensajeDefectoPut);
//Rutinas PATCH:
objEnrutador.patch('/:idUsuarioEntrada',ajustarUsuario);
objEnrutador.patch('{*any}',mostrarMensajeDefectoPatch);
//Rutinas DELETE:
objEnrutador.delete('/:idUsuarioEntrada',quitarUsuario);        
objEnrutador.delete('{*any}', mostrarMensajeDefectoDelete);

module.exports=objEnrutador;