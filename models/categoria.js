const {Schema:esquema,model:modelo}=require("mongoose");

const EsquemaCategoria=esquema({
    glosa_cat:{
        type:String,
        required:[true,'Favor ingresar un nombre de categoría']
    },
    es_vigente:{
        type:Boolean,
        default:true
    }
},
{
    collection:'CATEGORIAS'
});

module.exports=modelo('Categoria',EsquemaCategoria);