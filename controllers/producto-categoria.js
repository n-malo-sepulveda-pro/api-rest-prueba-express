const{response,request}=require("express");
require("dotenv-expand").expand({ parsed: process.env });
const {ProductoCategoria}=require("../models");



const desactivarProductoCategoria=async(idProducto)=>{
    await ProductoCategoria.updateMany(
        {id_producto: idProducto},
        {es_vigente: false}
    );
};

const procesarProductoCategoria=async(id_producto,req=request,res=response)=>{
    const {categorias=[]} = req.body;
    if(categorias.length>0)
    {
        const listaDeCategorias=categorias.map(categoria=>({
            id_producto,
            id_categoria:categoria,
            id_usuario: req.usuarioProceso._id
        }));
        await desactivarProductoCategoria(id_producto);
        await ProductoCategoria.insertMany(listaDeCategorias);
    }
};

const obtenerCategoriasPorProducto=async(listaDeProductos)=>{
    const mapa={};
    const esUnico=!Array.isArray(listaDeProductos);
    const listaDeIDProductos=esUnico?[listaDeProductos]:listaDeProductos;
    const listaDeRelaciones=await ProductoCategoria.find({
        id_producto: { $in: listaDeIDProductos },
        es_vigente: true
    })
    .populate({
        path: 'id_categoria',
        select: 'glosa_cat'
    })
    .lean();
    if(esUnico)
    {
        return listaDeRelaciones
            .filter(pc => pc.id_categoria)
            .map(pc => pc.id_categoria.glosa_cat);
    }
    listaDeRelaciones.forEach(elemento=>{
        if (!elemento.id_categoria) return;
        const idProductoListado=elemento.id_producto.toString();
        if (!mapa[idProductoListado]) mapa[idProductoListado] = [];
        mapa[idProductoListado].push(elemento.id_categoria.glosa_cat);
    });
    return mapa;
};

module.exports  =   {
                        ingresarCategoriaProducto:procesarProductoCategoria,
                        quitarCategoriaProducto:desactivarProductoCategoria,
                        obtenerCategoriasPorProducto
                    };