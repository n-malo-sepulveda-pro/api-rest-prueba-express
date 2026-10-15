const {Schema:esquema,model:modelo}=require("mongoose");

const EsquemaPaisMoneda=esquema({
    id_moneda:{
        type:esquema.Types.ObjectId,
        ref:'Moneda',
        required:[true,'Favor asignar un ID de moneda'],
    },
    id_pais:{
        type:esquema.Types.ObjectId,
        ref:'Pais',
        required:[true,'Favor asignar un ID de pais'],
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
}
,
{
    collection:'PAISES_MONEDAS'
});

EsquemaPaisMoneda.index({
    id_moneda:1,
    id_pais:1
},{
    unique:true
});


module.exports=modelo('PaisMoneda',EsquemaPaisMoneda);