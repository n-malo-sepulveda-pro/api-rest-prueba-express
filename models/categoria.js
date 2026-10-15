const {Schema:esquema,model:modelo}=require("mongoose");

const EsquemaCategoria=esquema({
    id_usuario:{
        type:esquema.Types.ObjectId,
        ref:'Usuario',
        required:[true,'Favor asignar un ID de usuario'],
    },
    glosa_cat:{
        type:String,
        unique:true,
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
EsquemaCategoria.methods.toJSON=function(){
     const { __v,_id,es_vigente,...objCategoria}=this.toObject();
     return {
        uid: _id,
        ...objCategoria
    };
};

module.exports=modelo('Categoria',EsquemaCategoria);