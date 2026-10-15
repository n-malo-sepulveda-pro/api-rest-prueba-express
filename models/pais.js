const {Schema:esquema,model:modelo}=require("mongoose");

const EsquemaPais=esquema({
    id_usuario:{
        type:esquema.Types.ObjectId,
        ref:'Usuario',
        required:[true,'Favor asignar un ID de usuario'],
    },
    nom_pais:{
        type:String,
        unique:true,
        required:[true,'Favor ingresar un nombre de país']
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
    collection:'PAISES'
});


module.exports=modelo('Pais',EsquemaPais);