const{response,request}=require("express");
const {ObjectId:tipoID}=require("mongoose").Types

const {Usuario,Categoria,Producto}=require("../models");
const {listarColecciones}=require("./administrador");
const   { 
            obtenerCategoriasPorProducto
        }=require("./producto-categoria");
const   { 
            obtenerPreciosPorProducto
        }=require("./producto-precio");

const buscarUsuario=async(termino="",res=response)=>{
    const esMongoID=tipoID.isValid(termino);
    const expresionReg=new RegExp(termino,'i');
    if (esMongoID)
    {
        const[cantidadResultado,fichaUsuario]=await Promise.all([
            Usuario.countDocuments({_id:termino}),
            Usuario.findById(termino)
            .populate({
                path:"id_usuario",
                select:"apodo -_id" // Con "-_id", se evita la extracción del identificador
            })
        ]);
        const fichaDeUsuario={
            uid:fichaUsuario._id,
            rol:fichaUsuario.rol,
            plataforma_origen:fichaUsuario.id_p_ori.glosa_p_ori,
            apellido01:fichaUsuario.apellido01,
            nombres:fichaUsuario.nombres,
            apodo:fichaUsuario.apodo,
            correo: fichaUsuario.correo,
            fecha_nacimiento: fichaUsuario.fecha_nacimiento
        };
        return res.json({
            "status":process.env.TODO_BIEN,
            "salida":{
                "cantidad":cantidadResultado,
                "detalle":(fichaDeUsuario)?[fichaDeUsuario]:[]
            }
        });
    }
    //campos de búsqueda: apellido01,apellido02,nombres,apodo,correo
    const [cantidadFichasUsuario,listaDeFichasUsuario]=await Promise.all([
        Usuario.countDocuments({
            $or:[{nombres:expresionReg},{apellido01:expresionReg},{apellido02:expresionReg},{apodo:expresionReg},{correo:expresionReg}],
            $and:[{es_vigente:true}]
        }),
        Usuario.find({
            $or:[{nombres:expresionReg},{apellido01:expresionReg},{apellido02:expresionReg},{apodo:expresionReg},{correo:expresionReg}],
            $and:[{es_vigente:true}]
        })
        .populate({
            path:"id_p_ori",
            select:"glosa_p_ori -_id" // Con "-_id", se evita la extracción del identificador
        })
    ]);
    const listaUsuariosCorregida=listaDeFichasUsuario.map(elemento=>{
        return {
            uid:elemento._id,
            rol:elemento.rol,
            plataforma_origen: elemento.id_p_ori ? elemento.id_p_ori.glosa_p_ori : null,
            apellido01:elemento.apellido01,
            apellido02:elemento.apellido02,
            nombres: elemento.nombres,
            apodo:elemento.apodo,
            correo: elemento.correo,
            fecha_nacimiento: elemento.fecha_nacimiento
        }

    });

    res.json({
        "status":process.env.TODO_BIEN,
        "salida":{
            "cantidad":cantidadFichasUsuario,
            "detalle":(listaUsuariosCorregida)?listaUsuariosCorregida:[]
        }
    });
};

const buscarCategoria=async(termino="",res=response)=>{
    const esMongoID=tipoID.isValid(termino);
    const expresionReg=new RegExp(termino,'i');
    if (esMongoID)
    {
        const[cantidadResultado,fichaCategoria]=await Promise.all([
            Categoria.countDocuments({_id:termino}),
            Categoria.findById(termino)
        ]);
        return res.json({
            "status":process.env.TODO_BIEN,
            "salida":{
                "cantidad":cantidadResultado,
                "detalle":(fichaCategoria)?[fichaCategoria]:[]
            }
        });
    }
    const [cantidadFichasCategoria,listaDeFichasCategoria]=await Promise.all([
        Categoria.countDocuments({es_vigente:true,glosa_cat:expresionReg}),
        Categoria.find({es_vigente:true,glosa_cat:expresionReg})
    ]);
    res.json({
        "status":process.env.TODO_BIEN,
        "salida":{
            "cantidad":cantidadFichasCategoria,
            "detalle":(listaDeFichasCategoria)?[listaDeFichasCategoria]:[]
        }
    });
};

const buscarProducto=async(termino="",res=response)=>{
    const esMongoID=tipoID.isValid(termino);
    const expresionReg=new RegExp(termino,'i');
    if (esMongoID)
    {
        const[cantidadResultado,fichaProducto,categorias,precios]=await Promise.all([
            Producto.countDocuments({_id:termino}),
            Producto.findById(termino)
            .populate({
                path:"id_usuario",
                select:"apodo -_id" // Con "-_id", se evita la extracción del identificador
            }),
            obtenerCategoriasPorProducto(termino),
            obtenerPreciosPorProducto(termino)
        ]);

        return res.json({
            "status":process.env.TODO_BIEN,
            "salida":{
                "cantidad":cantidadResultado,
                "detalle":{
                    id: termino,
                    usuario: fichaProducto.id_usuario ? fichaProducto.id_usuario.apodo : null,
                    nombre_prod: fichaProducto.nombre_prod,
                    descr_prod: fichaProducto.descr_prod,
                    categorias,
                    precios,
                    fecha_ingreso: fichaProducto.fecha_ingreso
                }
            }
        });
    }
    const [cantidadFichasProducto,listaDeFichasProducto]=await Promise.all([
        Producto.countDocuments({
            $or:[{nombre_prod:expresionReg},{descr_prod:expresionReg}],
            $and:[{es_vigente:true}]
        }),
        Producto.find({
            $or:[{nombre_prod:expresionReg},{descr_prod:expresionReg}],
            $and:[{es_vigente:true}]
        })
        .populate({
            path:"id_usuario",
            select:"apodo -_id" // Con "-_id", se evita la extracción del identificador
        })
    ]);

    const listaIDProductos=listaDeFichasProducto.map(productoListado => productoListado._id);
    const [mapaCategorias, mapaPrecios] = await Promise.all([
        obtenerCategoriasPorProducto(listaIDProductos),
        obtenerPreciosPorProducto(listaIDProductos)
    ]);
    const listaDeProductos=listaDeFichasProducto.map(producto =>{
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
        "status":process.env.TODO_BIEN,
        "salida":{
            "cantidad":cantidadFichasProducto,
            "detalle":(listaDeProductos)?listaDeProductos:[]
        }
    });
};

const buscar=async(req=request,res=response)=>{
    const {coleccion,termino}=req.params;
    const listaColeccionesAdmitidas=await listarColecciones();
    if(!listaColeccionesAdmitidas.includes(coleccion.toLowerCase()))
    {
        res.status(400).json({mensaje:`La colección proporcionada no existe en el sistema. Estas son las colecciones admitidas: ${listaColeccionesAdmitidas}`});
    }
    switch(coleccion)
    {
        case "categorias"       :   {
                                        await buscarCategoria(termino,res);
                                        break;
                                    }
        case "productos"        :   {  
                                        await buscarProducto(termino,res);
                                        break;
                                    }
        case "usuarios"         :   {   
                                        await buscarUsuario(termino,res);
                                        break;
                                    }
        default                 :   {  
                                        res.status(500).json({mensaje:`Se le olvidó hacer esta búsqueda`});
                                        break;
                                    }
    }
    
};

module.exports  =   {
                        buscar
                    };