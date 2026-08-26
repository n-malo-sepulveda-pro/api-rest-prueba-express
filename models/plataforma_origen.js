const {Schema:esquema,model:modelo}=require("mongoose");

const EsquemaPlataformaOrigen=esquema({
    glosa_p_ori:{
        type:String,
        required:[true,'Favor ingresar un nombre de plataforma de origen']
    },
    es_vigente:{
        type:Boolean,
        default:true
    }
},{
    collection:"PLATAFORMAS_ORIGENES"
});


module.exports=modelo('PlataformaOrigen',EsquemaPlataformaOrigen);