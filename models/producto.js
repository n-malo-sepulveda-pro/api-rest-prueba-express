const {Schema:esquema,model:modelo}=require("mongoose");

const EsquemaProducto=esquema({
    id_usuario:{
        type:esquema.Types.ObjectId,
        ref:'Usuario',
        required:[true,'Favor asignar un ID de usuario'],
    },
    nombre_prod:{
        type:String,
        unique:true,
        required:[true,'Favor ingresar un nombre de producto']
    },
    descr_prod:{
        type:String,
        unique:true,
        required:[true,'Favor ingresar una descripción de producto']
    },
    fecha_ingreso: {
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
    collection:'PRODUCTOS'
});

EsquemaProducto.methods.toJSON=function(){
    const {__v,es_vigente,...ficha}=this.toObject();
    return ficha;
};


module.exports=modelo('Producto',EsquemaProducto);