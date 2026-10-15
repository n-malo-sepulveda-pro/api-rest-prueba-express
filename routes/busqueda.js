const { Router:enrutador }=require("express");

const {buscar}=require("../controllers/busqueda");
const objEnrutador=enrutador();

objEnrutador.get('/:coleccion/:termino',
    buscar);

module.exports=objEnrutador;