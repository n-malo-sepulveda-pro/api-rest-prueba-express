const {Schema:esquema,model:modelo}=require("mongoose");
const EsquemaMoneda=esquema({
    id_usuario:{
        type:esquema.Types.ObjectId,
        ref:'Usuario',
        required:[true,'Favor asignar un ID de usuario'],
    },
    glosa_mon:{
        type:String,
        unique:true,
        required:[true,'Favor ingresar un nombre de moneda']
    },
    simbol_mon:{
        type:String,
        unique:true,
        required:[true,'Favor ingresar un símbolo de moneda']
    },
    es_vigente:{
        type:Boolean,
        default:true
    }
}
,
{
    collection:'MONEDAS'
});


module.exports=modelo('Moneda',EsquemaMoneda);