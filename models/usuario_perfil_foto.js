const {Schema:esquema,model:modelo}=require("mongoose");

const EsquemaUsuarioPerfilFoto=esquema({
    id_usuario:{
        type:esquema.Types.ObjectId,
        ref:'Usuario',
        required:[true,'Favor asignar un ID de usuario'],
    },
    ruta_imagen:{
        type:String,
        required:[true,'Favor ingresar la ruta de imagen'],
        trim:true
    },
    fecha_ingreso: {
      type: Date,
      required: [true, 'Favor ingresar la fecha de ingreso'],
      default: Date.now
    },
    fecha_desactivacion: {
      type: Date
    },
    es_vigente:{
        type:Boolean,
        default:true
    }
},{
    collection:"USUARIOS_PERFILES_FOTOS"
});

module.exports=modelo('UsuarioPerfilFoto',EsquemaUsuarioPerfilFoto);