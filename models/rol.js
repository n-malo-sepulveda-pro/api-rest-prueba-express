const {Schema:esquema,model:modelo}=require("mongoose");

const EsquemaRol=esquema({
    glosa_rol:{
        type:String,
        required:[true,'Favor ingresar un nombre de rol']
    },
    es_vigente:{
        type:Boolean,
        default:true
    }
},
{
    collection:'ROLES'
});

module.exports=modelo('Rol',EsquemaRol);