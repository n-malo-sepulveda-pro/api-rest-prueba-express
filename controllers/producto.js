const{response,request}=require("express");
require("dotenv-expand").expand({ parsed: process.env });
const {Producto}=require("../models");
const   { 
            ingresarCategoriaProducto,
            quitarCategoriaProducto,
            obtenerCategoriasPorProducto
        }=require("./producto-categoria");
const   { 
            desactivarProductoPrecio,
            procesarProductoPrecios,
            obtenerPreciosPorProducto
        }=require("./producto-precio");

//Rutinas GET:
const obtenerProductos=async(req=request,res=response)=>{
    const {desde=0,limite=5}=req.query;
    const filtrado={
        es_vigente:true
    };
    const [cantidadProductos,listaDeProductosEnBruto]=await Promise.all([
            Producto.countDocuments(filtrado),
            Producto.find(filtrado)
            .populate({
                path:"id_usuario",
                select:"apodo -_id" // Con "-_id", se evita la extracción del identificador
            })
            .skip(parseInt(desde,10))
            .limit(parseInt(limite,10))
            .lean()
            .exec()
    ]);

    const listaIDProductos=listaDeProductosEnBruto.map(productoListado => productoListado._id);
    const [mapaCategorias, mapaPrecios] = await Promise.all([
        obtenerCategoriasPorProducto(listaIDProductos),
        obtenerPreciosPorProducto(listaIDProductos)
    ]);
    const listaDeProductos=listaDeProductosEnBruto.map(producto =>{
        const idProductoListado=producto._id.toString();
        return {
            id: producto._id,
            categorias: mapaCategorias[idProductoListado] || [],
            usuario: producto.id_usuario ? producto.id_usuario.apodo : null,
            nombre: producto.nombre_prod,
            descripcion: producto.descr_prod,
            precios: mapaPrecios[idProductoListado] || []
        };
    });
    res.json({
        "status"    :   process.env.TODO_BIEN,
        "salida"    :   {
                            "cantidad"  :   cantidadProductos,
                            "detalle"   :   listaDeProductos
                        }
    });
};
const obtenerDatosProducto=async(req=request,res=response)=>{
    const {idProducto}=req.params;
    const [fichaProducto, categorias, precios] = await Promise.all([
        Producto.findOne({ _id: idProducto, es_vigente: true })
        .populate('id_usuario', 'apodo')
        .lean(),
        obtenerCategoriasPorProducto(idProducto),
        obtenerPreciosPorProducto(idProducto)
    ]);
    if(!fichaProducto)
    {
        objetoSalida.mensaje="No existe producto asociado al ID mencionado.";
    }
    res.json({
        status: process.env.TODO_BIEN,
        salida: {
            id: idProducto,
            usuario: fichaProducto.id_usuario ? fichaProducto.id_usuario.apodo : null,
            nombre_prod: fichaProducto.nombre_prod,
            descr_prod: fichaProducto.descr_prod,
            categorias,
            precios,
            fecha_ingreso: fichaProducto.fecha_ingreso
        }
    });
};
//Rutinas POST:
const ingresarProducto=async(req,res=response)=>{
    const nombreProducto=req.body.nombre_prod.toUpperCase();
    const {categorias=[],precios=[]}=req.body;
    
    const fichaProducto=await Producto.findOne({nombre_prod:nombreProducto});
    if(fichaProducto)
    {
        return res.status(400).json({mensaje:"El producto ingresado ya existe en el sistema"});
    }
    const objProducto=new Producto({
        id_usuario:req.usuarioProceso._id,
        nombre_prod:nombreProducto,
        descr_prod:req.body.descr_prod
    });    
    const productoIngresado=await objProducto.save();
    const id_producto=productoIngresado._id;
    if(categorias.length>0) await ingresarCategoriaProducto(id_producto, req,res);
    if(precios.length>0) await procesarProductoPrecios(id_producto,req,res);
    res.status(201).json({mensaje:process.env.TODO_BIEN,nombre_prod:nombreProducto});
};
//Rutinas PUT:
const modificarProducto=async(req,res=response)=>{
    const {idProducto}=req.params;
    const {categorias=[], precios=[]}=req.body;
    const nombre_prod=req.body.nombre_prod.toUpperCase();
    const fichaProducto=await Producto.findById(idProducto);
    if(!fichaProducto){
        return res.status(400).json({
            mensaje:"El producto ingresado no existe en el sistema"
        });
    }
    const fichaProductoActualizado=await Producto.findByIdAndUpdate(idProducto,{
        id_usuario:req.usuarioProceso._id,
        nombre_prod,
        descr_prod:req.body.descr_prod
    });
    if(categorias.length>0) await ingresarCategoriaProducto(idProducto, req,res);
    if(precios.length>0) await procesarProductoPrecios(idProducto,req,res);
    res.json({ mensaje:process.env.TODO_BIEN});
};
//Rutinas PATCH:
const ajustarProducto=(req,res=response)=>{
    res.status(400).json({ idProducto:req.params.idProducto, mensaje:"petición a la API de tipo PATCH desde el controlador"});
};
//Rutinas DELETE:
const quitarProducto=async(req,res=response)=>{
    const {idProducto}=req.params;
    await quitarCategoriaProducto(idProducto);
    await desactivarProductoPrecio(idProducto);
    await Producto.findByIdAndUpdate(idProducto,{es_vigente:false});
    res.json({ mensaje:process.env.TODO_BIEN});
};
module.exports  =   {
                        listar:obtenerProductos,
                        obtener:obtenerDatosProducto,
                        crear:ingresarProducto,
                        modificar:modificarProducto,
                        ajustar:ajustarProducto,
                        quitar:quitarProducto
                    };