const{response,request}=require("express");
require("dotenv-expand").expand({ ignoreProcessEnv: false });
const {Moneda,PaisMoneda}=require("../models");

//Rutinas GET:
const obtenerMonedas=async(req=request,res=response)=>{
    const {desde=0,limite=5}=req.query;
    const filtrado={
        es_vigente:true
    };
    const [cantidadMonedas,listaDeMonedasEnBruto]=await Promise.all([
            Moneda.countDocuments(filtrado),
            Moneda.find(filtrado)
            .populate({
                path:"id_usuario",
                select:"apodo -_id" // Con "-_id", se evita la extracción del identificador
            })
            .skip(parseInt(desde,10))
            .limit(parseInt(limite,10))
            .exec()
    ]);
    // Mapear los resultados para renombrar la propiedad "id_usuario" a "usuario"
    const listaDeMonedas=listaDeMonedasEnBruto.map(monedaElem=>{
        // Convertir a objeto plano de JS respetando los toJSON si los hubiera, 
        // o manipulando directamente el objeto
        const objetoMoneda=monedaElem.toObject?monedaElem.toObject():monedaElem;
        // Extraemos id_usuario y renombrar a usuario
        const { id_usuario,__v,es_vigente, ...restoMoneda }=objetoMoneda;
        return {
            ...restoMoneda,
            usuario: id_usuario.apodo,//acá se extrae el campo apodo y, con ello, queda renombrado.
        };
    });
    res.json({
        "status"    :   process.env.TODO_BIEN,
        "salida"    :   {
                            "cantidad"  :   cantidadMonedas,
                            "detalle"   :   listaDeMonedas
                        }
    });
};
const obtenerDatosMoneda=async(req=request,res=response)=>{
    const {idMoneda}=req.params;

    let objetoSalida={
        mensaje:"petición a la API de tipo GET desde el controlador",
    };
    const fichaMoneda=await Moneda.findOne({
        _id:idMoneda,
        es_vigente:true
    })
    .populate('id_usuario')
    .exec();
    if(!fichaMoneda)
    {
        objetoSalida.mensaje="No existe moneda asociada al ID mencionado.";
    }
    const {apodo:usuario}=fichaMoneda.id_usuario;
    const datoMoneda={
        simbol_mon:fichaMoneda.simbol_mon,
        glosa_mon:fichaMoneda.glosa_mon,
        usuario
    }
    objetoSalida.status=process.env.TODO_BIEN;
    objetoSalida.salida=datoMoneda;
    const{mensaje,...resultadoProceso}=objetoSalida;
    res.json(resultadoProceso);
};
//Rutinas POST:
const ingresarMoneda=async(req,res=response)=>{
    
    const nombreMoneda=req.body.glosa_mon.toUpperCase();
    const simboloMoneda=req.body.simbol_mon;
    const id_pais=req.body.id_pais;
    const filtroMoneda={
        glosa_mon:nombreMoneda
    };
    const fichaMoneda=await Moneda.findOne(filtroMoneda);
    if(fichaMoneda){
        return res.status(400).json({
            mensaje:"La moneda ingresada ya existe en el sistema"
        })
    }
    const objMoneda=new Moneda({
        id_usuario:req.usuarioProceso._id,
        simbol_mon:simboloMoneda,
        glosa_mon:nombreMoneda
    });
    const monedaIngresada=await objMoneda.save();

    const asociacion=new PaisMoneda({
        id_pais,
        id_moneda:monedaIngresada._id,
        id_usuario:req.usuarioProceso._id,        
    });
    await asociacion.save();

    const objetoSalida={
        mensaje:process.env.TODO_BIEN,
        glosa_mon: nombreMoneda
    };
    res.status(201).json(objetoSalida);
};
//Rutinas PUT:
const modificarMoneda=async(req,res=response)=>{

    const {idMoneda}=req.params;
    const {es_vigente,id_usuario,...ficha}=req.body;
    const glosa_mon=ficha.glosa_mon.toUpperCase();
    const simbol_mon=ficha.simbol_mon;
    
    const filtroMoneda={
        glosa_mon
    };
    const fichaMoneda=await Moneda.findOne(filtroMoneda);
    if(fichaMoneda){
        return res.status(400).json({
            mensaje:"La moneda ingresada ya existe en el sistema"
        })
    }
    const objMoneda=new Moneda({
        id_usuario:req.usuarioProceso._id,
        simbol_mon,
        glosa_mon
    });
    await Moneda.findByIdAndUpdate(idMoneda,objMoneda);
    const objetoSalida={
        mensaje:process.env.TODO_BIEN
    };
    res.json(objetoSalida);
};
//Rutinas PATCH:
const ajustarMoneda=(req,res=response)=>{
    const idMoneda=req.params.idMoneda;
    const objetoSalida={
        idMoneda,
        mensaje:"petición a la API de tipo PATCH desde el controlador"
    };
    res.status(400).json(objetoSalida);
};
//Rutinas DELETE:
const quitarMoneda=async(req,res=response)=>{
    const {idMoneda}=req.params;
    await Moneda.findByIdAndUpdate(idMoneda,{es_vigente:false});
    const objetoSalida={
        mensaje:process.env.TODO_BIEN
    };
    res.json(objetoSalida);
};

module.exports  =   {
                        listar:obtenerMonedas,
                        obtener:obtenerDatosMoneda,
                        crear:ingresarMoneda,
                        modificar:modificarMoneda,
                        ajustar:ajustarMoneda,
                        quitar:quitarMoneda
                    };
