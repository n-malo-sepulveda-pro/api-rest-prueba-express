const{response,request}=require("express");
require("dotenv-expand").expand({ ignoreProcessEnv: false });
const {Categoria,Usuario}=require("../models");

//Rutinas GET:
const obtenerCategorias=async(req=request,res=response)=>{
    const {desde=0,limite=5}=req.query;
    const filtrado={
        es_vigente:true
    };
    const [cantidadCategorias,listaDeCategoriasEnBruto]=await Promise.all([
            Categoria.countDocuments(filtrado),
            Categoria.find(filtrado)
            .populate({
                path:"id_usuario",
                select:"apodo -_id" // Con "-_id", se evita la extracción del identificador
            })
            .skip(parseInt(desde,10))
            .limit(parseInt(limite,10))
            .exec()
    ]);
    // Mapear los resultados para renombrar la propiedad "id_usuario" a "usuario"
    const listaDeCategorias=listaDeCategoriasEnBruto.map(categoriaElem=>{
        // Convertir a objeto plano de JS respetando los toJSON si los hubiera, 
        // o manipulando directamente el objeto
        const objetoCategoria=categoriaElem.toObject?categoriaElem.toObject():categoriaElem;
        // Extraemos id_usuario y renombrar a usuario
        const { id_usuario,__v,es_vigente, ...restoCategoria }=objetoCategoria;
        return {
            ...restoCategoria,
            usuario: id_usuario.apodo//acá se extrae el campo apodo y, con ello, queda renombrado.
        };
    });
    res.json({
        "status"    :   process.env.TODO_BIEN,
        "salida"    :   {
                            "cantidad"  :   cantidadCategorias,
                            "detalle"   :   listaDeCategorias
                        }
    });
};
const obtenerDatosCategoria=async(req=request,res=response)=>{
    const {idCategoria}=req.params;

    let objetoSalida={
        mensaje:"petición a la API de tipo GET desde el controlador",
    };
    const fichaCategoria=await Categoria.findOne({
        _id:idCategoria,
        es_vigente:true
    })
    .populate('id_usuario')
    .exec();
    if(!fichaCategoria)
    {
        objetoSalida.mensaje="No existe categoria asociada al ID mencionado.";
    }
    const {apodo:usuario}=fichaCategoria.id_usuario;
    const datoCategoria={
        glosa_cat:fichaCategoria.glosa_cat,
        usuario
    }
    objetoSalida.status=process.env.TODO_BIEN;
    objetoSalida.salida=datoCategoria;
    const{mensaje,...resultadoProceso}=objetoSalida;
    res.json(resultadoProceso);
};
//Rutinas POST:
const ingresarCategoria=async(req,res=response)=>{
    
    const glosaCategoria=req.body.glosa_cat.toUpperCase();
    const filtroCategoria={
        glosa_cat:glosaCategoria
    };
    const fichaCategoria=await Categoria.findOne(filtroCategoria);
    if(fichaCategoria){
        return res.status(400).json({
            mensaje:"La categoría ingresada ya existe en el sistema"
        })
    }

    const objCategoria=new Categoria({
        id_usuario:req.usuarioProceso._id,
        glosa_cat:glosaCategoria
    });
    await objCategoria.save();
    const objetoSalida={
        mensaje:process.env.TODO_BIEN,
        glosa: glosaCategoria
    };
    res.status(201).json(objetoSalida);
};
//Rutinas PUT:
const modificarCategoria=async(req,res=response)=>{

    const {idCategoria}=req.params;
    const {es_vigente,id_usuario,...ficha}=req.body
    const glosa_cat=ficha.glosa_cat.toUpperCase();
    
    const filtroCategoria={
        glosa_cat
    };
    const fichaCategoria=await Categoria.findOne(filtroCategoria);
    if(fichaCategoria){
        return res.status(400).json({
            mensaje:"La categoría ingresada ya existe en el sistema"
        })
    }
    const objCategoria=new Categoria({
        id_usuario:req.usuarioProceso._id,
        glosa_cat
    });
    await Categoria.findByIdAndUpdate(idCategoria,objCategoria);
    const objetoSalida={
        mensaje:process.env.TODO_BIEN
    };
    res.json(objetoSalida);
};
//Rutinas PATCH:
const ajustarCategoria=(req,res=response)=>{
    const idCategoria=req.params.idCategoria;
    const objetoSalida={
        idCategoria,
        mensaje:"petición a la API de tipo PATCH desde el controlador"
    };
    res.status(400).json(objetoSalida);
};
//Rutinas DELETE:
const quitarCategoria=async(req,res=response)=>{
    const {idCategoria}=req.params;
    await Categoria.findByIdAndUpdate(idCategoria,{es_vigente:false});
    const objetoSalida={
        mensaje:process.env.TODO_BIEN
    };
    res.json(objetoSalida);
};

module.exports  =   {
                        listar:obtenerCategorias,
                        obtener:obtenerDatosCategoria,
                        crear:ingresarCategoria,
                        modificar:modificarCategoria,
                        ajustar:ajustarCategoria,
                        quitar:quitarCategoria
                    };