const validadorCampos=require("./validador-campos");
const validadorJWT=require("./validador-jwt");
const validadorRol=require("./validador-rol");

module.exports  =   {
                        ...validadorCampos,
                        ...validadorJWT,
                        ...validadorRol
                    };