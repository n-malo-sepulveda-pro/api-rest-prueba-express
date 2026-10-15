const{response,request}=require("express");
require("dotenv-expand").expand({ ignoreProcessEnv: false });
const {Pais,Usuario}=require("../models");

//Rutinas GET:
const obtenerPaises=async(req=request,res=response)=>{
    const {desde=0,limite=5}=req.query;
    const filtrado={
        es_vigente:true
    };
    const [cantidadPaises,listaDePaisesEnBruto]=await Promise.all([
            Pais.countDocuments(filtrado),
            Pais.find(filtrado)
            .populate({
                path:"id_usuario",
                select:"apodo -_id" // Con "-_id", se evita la extracción del identificador
            })
            .skip(parseInt(desde,10))
            .limit(parseInt(limite,10))
            .exec()
    ]);
    // Mapear los resultados para renombrar la propiedad "id_usuario" a "usuario"
    const listaDePaises=listaDePaisesEnBruto.map(paisElem=>{
        // Convertir a objeto plano de JS respetando los toJSON si los hubiera, 
        // o manipulando directamente el objeto
        const objetoPais=paisElem.toObject?paisElem.toObject():paisElem;
        // Extraemos id_usuario y renombrar a usuario
        const { id_usuario,__v,es_vigente, ...restoPais }=objetoPais;
        return {
            ...restoPais,
            usuario: id_usuario.apodo//acá se extrae el campo apodo y, con ello, queda renombrado.
        };
    });
    res.json({
        "status"    :   process.env.TODO_BIEN,
        "salida"    :   {
                            "cantidad"  :   cantidadPaises,
                            "detalle"   :   listaDePaises
                        }
    });
};
const obtenerDatosPais=async(req=request,res=response)=>{
    const {idPais}=req.params;

    let objetoSalida={
        mensaje:"petición a la API de tipo GET desde el controlador",
    };
    const fichaPais=await Pais.findOne({
        _id:idPais,
        es_vigente:true
    })
    .populate('id_usuario')
    .exec();
    if(!fichaPais)
    {
        objetoSalida.mensaje="No existe país asociado al ID mencionado.";
    }
    const {apodo:usuario}=fichaPais.id_usuario;
    const datoCategoria={
        glosa_cat:fichaPais.glosa_cat,
        usuario
    }
    objetoSalida.status=process.env.TODO_BIEN;
    objetoSalida.salida=datoCategoria;
    const{mensaje,...resultadoProceso}=objetoSalida;
    res.json(resultadoProceso);
};
//Rutinas POST:
const ingresarPais=async(req,res=response)=>{
    
    const nombrePais=req.body.nom_pais.toUpperCase();
    const filtroCategoria={
        nom_pais:nombrePais
    };
    const fichaPais=await Pais.findOne(filtroCategoria);
    if(fichaPais){
        return res.status(400).json({
            mensaje:"El país ingresado ya existe en el sistema"
        })
    }

    const objPais=new Pais({
        id_usuario:req.usuarioProceso._id,
        nom_pais:nombrePais
    });
    await objPais.save();
    const objetoSalida={
        mensaje:process.env.TODO_BIEN,
        glosa: nombrePais
    };
    res.status(201).json(objetoSalida);
};
//Rutinas PUT:
const modificarPais=async(req,res=response)=>{

    const {idPais}=req.params;
    const {es_vigente,id_usuario,...ficha}=req.body
    const nom_pais=ficha.nom_pais.toUpperCase();
    
    const filtroPais={
        nom_pais
    };
    const fichaPais=await Pais.findOne(filtroPais);
    if(fichaPais){
        return res.status(400).json({
            mensaje:"El país ingresado ya existe en el sistema"
        })
    }
    const objPais=new Pais({
        id_usuario:req.usuarioProceso._id,
        nom_pais
    });
    await Pais.findByIdAndUpdate(idPais,objPais);
    const objetoSalida={
        mensaje:process.env.TODO_BIEN
    };
    res.json(objetoSalida);
};
//Rutinas PATCH:
const ajustarPais=(req,res=response)=>{
    const idCategoria=req.params.idCategoria;
    const objetoSalida={
        idCategoria,
        mensaje:"petición a la API de tipo PATCH desde el controlador"
    };
    res.status(400).json(objetoSalida);
};
//Rutinas DELETE:
const quitarPais=async(req,res=response)=>{
    const {idPais}=req.params;
    await Pais.findByIdAndUpdate(idPais,{es_vigente:false});
    const objetoSalida={
        mensaje:process.env.TODO_BIEN
    };
    res.json(objetoSalida);
};

module.exports  =   {
                        listar:obtenerPaises,
                        obtener:obtenerDatosPais,
                        crear:ingresarPais,
                        modificar:modificarPais,
                        ajustar:ajustarPais,
                        quitar:quitarPais
                    };