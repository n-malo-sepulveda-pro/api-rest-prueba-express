const {Schema:esquema,model:modelo}=require("mongoose");

const EsquemaProductoPrecio=esquema({
    id_producto:{
        type:esquema.Types.ObjectId,
        ref:'Producto',
        required:[true,'Favor asignar un ID de producto'],
    },
    id_pais_moneda:{
        type:esquema.Types.ObjectId,
        ref:'PaisMoneda',
        required:[true,'Favor asignar un ID de país_moneda'],
    },
    id_usuario:{
        type:esquema.Types.ObjectId,
        ref:'Usuario',
        required:[true,'Favor asignar un ID de usuario'],
    },
    precio:{
        type:Number,
        default:0
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
}
,
{
    collection:'PRODUCTOS_PRECIOS'
});

module.exports=modelo('ProductoPrecio',EsquemaProductoPrecio);
