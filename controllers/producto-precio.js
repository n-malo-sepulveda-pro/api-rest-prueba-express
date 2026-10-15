const{response,request}=require("express");
require("dotenv-expand").expand({ parsed: process.env });
const {ProductoPrecio,PaisMoneda}=require("../models");

const obtenerPreciosPorProducto=async (listaIDProductos)=>{
    const mapa = {};
    const esUnico=!Array.isArray(listaIDProductos);
    const listaProductos=esUnico?[listaIDProductos]:listaIDProductos;
    const listaRelaciones=await ProductoPrecio.find({
        id_producto: { $in: listaProductos},
        es_vigente: true
    })
    .populate({
        path: 'id_pais_moneda',
        populate: {
            path: 'id_moneda',
            select: 'simbol_mon glosa_mon'
        }
    })
    .lean();
    const listaValoresFormateados = (pp) => ({
        sigla_moneda: pp.id_pais_moneda && pp.id_pais_moneda.id_moneda ? pp.id_pais_moneda.id_moneda.simbol_mon : null,
        precio: pp.precio
    });
    if (esUnico) 
    {
        return listaRelaciones.filter(pp => pp.id_pais_moneda && pp.id_pais_moneda.id_moneda).map(listaValoresFormateados);
    }
    listaRelaciones.forEach(elementoListado => {
        if (!elementoListado.id_pais_moneda || !elementoListado.id_pais_moneda.id_moneda) return;
        const idProductoListado=elementoListado.id_producto.toString();
        if (!mapa[idProductoListado]) mapa[idProductoListado] = [];
        mapa[idProductoListado].push(listaValoresFormateados(elementoListado));
    });
    return mapa;
};

const desactivarProductoPrecio=async(idProducto)=>{
    await ProductoPrecio.updateMany(
        {id_producto: idProducto},
        {es_vigente: false}
    );
};

const procesarProductoPrecios=async(id_producto,req=request,res=response)=>{
    const {precios=[]} = req.body;
    const listaDePreciosProcesables=[];
    await desactivarProductoPrecio(id_producto);
    for (const elementoPrecio of precios)
    {
        const {id_pais,id_moneda,precio}=elementoPrecio;
        const fichaPaisMoneda=await PaisMoneda.findOne({
            es_vigente: true,
            id_pais,
            id_moneda
        });
        if (!fichaPaisMoneda) {
            return res.status(400).json({
                mensaje: `El país con ID ${id_pais} y la moneda con ID ${id_moneda} no están asociados.`
            });
        }
        listaDePreciosProcesables.push({
            id_producto,
            id_pais_moneda: fichaPaisMoneda._id,
            id_usuario: req.usuarioProceso._id,
            precio: parseFloat(precio)
        });
    }
    await ProductoPrecio.insertMany(listaDePreciosProcesables);
};

module.exports  =   {
                        desactivarProductoPrecio,
                        procesarProductoPrecios,
                        obtenerPreciosPorProducto
                    };