const {Schema:esquema,model:modelo}=require("mongoose");

const EsquemaProductoCategoria=esquema({
    id_producto:{
        type:esquema.Types.ObjectId,
        ref:'Producto',
        required:[true,'Favor asignar un ID de producto'],
    },
    id_categoria:{
        type:esquema.Types.ObjectId,
        ref:'Categoria',
        required:[true,'Favor asignar un ID de categoría'],
    },
    id_usuario:{
        type:esquema.Types.ObjectId,
        ref:'Usuario',
        required:[true,'Favor asignar un ID de usuario'],
    },
    fecha_ingreso:{
      type: Date,
      required: [true, 'Favor informar la fecha de ingreso'],
      default: Date.now
    },
    es_vigente:{
        type:Boolean,
        default:true
    }
},
{
    collection:'PRODUCTOS_CATEGORIAS'
});

EsquemaProductoCategoria.index({
    id_categoria:1,
    id_producto:1
},{
    unique:true
});


module.exports=modelo('ProductoCategoria',EsquemaProductoCategoria);