const objMongoose=require("mongoose");

const {listaNegra:listaExclusiones}=require("../helpers/configuracion-validador.js");

const obtenerColeccionesExistentes=async()=>{
    const objBD=objMongoose.connection.db;
    const listaColecciones=await objBD.listCollections().toArray();
    const listaNombres=listaColecciones.map(elemento=>elemento.name.toLowerCase());
    const listaColeccionesExcluidas=listaExclusiones.tablas_omitidas;
    const setExcluidos=new Set(listaColeccionesExcluidas);
    const listaFiltrada=listaNombres.filter(nombre=>!setExcluidos.has(nombre));    
    return listaFiltrada;
};

module.exports  =   {
                        listarColecciones:obtenerColeccionesExistentes,
                    };