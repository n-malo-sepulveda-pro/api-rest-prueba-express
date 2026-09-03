const {Schema:esquema,model:modelo}=require("mongoose");

const EsquemaUsuario=esquema({
    /*id_rol:{
        type:esquema.Types.ObjectId,
        ref:'Rol',
        required:[true,'Favor asignar un rol al usuario'],
    },*/
    rol:{
        type:String,
        required:[true,'Favor asignar un rol al usuario'],
    },
    id_p_ori:{
        type:esquema.Types.ObjectId,
        ref:'PlataformaOrigen',
        required:[true,'Favor asignar una plataforma de origen al usuario'],
    },
    apellido01:{
        type:String,
        required:[true,'Favor ingresar el apellido principal'],
        trim:true
    },
    apellido02:{
        type:String,
        trim:true
    },
    nombres:{
        type:String,
        required:[true,'Favor ingresar el o los nombres'],
        trim:true
    },
    apodo:{
        type:String,
        required:[true,'Favor ingresar el apodo'],
        unique: true,
        trim:true
    }, 
    correo: {
      type: String,
      required: [true, 'Favor ingresar una dirección de correo electrónico'],
      unique: true,
      lowercase: true,
      trim: true
    },
    contrasenna:{
        type:String,
        required:[true,'Favor ingresar la contraseña'],
        trim:true
    },
    fecha_nacimiento: {
      type: Date,
      required: [true, 'Favor ingresar la fecha de ingreso']
    },
    fecha_ingreso: {
      type: Date,
      required: [true, 'Favor ingresar la fecha de ingreso'],
      default: Date.now
    },
    es_vigente:{
        type:Boolean,
        default:true
    }
},{
    collection:"USUARIOS"
});

EsquemaUsuario.methods.toJSON=function(){
    const { __v,_id,contrasenna,...objUsuario}=this.toObject();
    
    return {
        uid: _id,
        ...objUsuario};
};

module.exports=modelo('Usuario',EsquemaUsuario);