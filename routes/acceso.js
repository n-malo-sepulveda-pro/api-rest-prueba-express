const { Router:enrutador }=require("express");
const {check:validar}=require("express-validator");

const {validarCampos}=require("../middleware/validador-campos");
const   {
            acceder
        }=require("../controllers/controladorAcceso");
const   {
            consultarUsuario
        }=require("../helpers/bdValidador");

const objEnrutador=enrutador();

//Métodos POST
objEnrutador.post('/acceder',[
    validar('usuario','Favor ingresar un apodo de usuario').not().isEmpty(),
    validar('usuario').custom(consultarUsuario),
    validar('contrasenna','Favor ingresar una contraseña de usuario').not().isEmpty(),
    validarCampos
],acceder);

module.exports=objEnrutador;