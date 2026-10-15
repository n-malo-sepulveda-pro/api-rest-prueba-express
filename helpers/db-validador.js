const {Usuario,Categoria,PlataformaOrigen,Rol,Pais,Moneda,Producto, PaisMoneda}=require("../models");
const {verificarEncriptado}=require("./encriptador");
const objMongoose=require('mongoose');

const consultarRolIngresado=async(rol='')=>{
    const existeRol=await Rol.findOne({glosa_rol:rol});
    if(!existeRol){
        throw new Error(`El rol ingresado no es válido ${rol}`);
    }
};

const consultarApodoIngresado=async(usuario='')=>{
    const existeCasilla=await Usuario.findOne({apodo:usuario});
    if(existeCasilla){
        throw new Error(`El apodo ${apodo} está siendo utilizado. Favor ingresar otro`);
    }
};

const comprobarApodoIngresado=async(usuario='')=>{
    const existeApodo=await Usuario.findOne({apodo:usuario,es_vigente:true});
    if(existeApodo==="null"){
        throw new Error(`El apodo ${apodo} no existe en el sistema. Favor ingresar otro`);
    }
};

const comprobarUsuarioYContrasenna=async(apodo='',contrasenna="")=>{
    const objUsuario=await Usuario.findOne({apodo,es_vigente:true});
    if(!objUsuario)
    {
        return (`Credenciales de acceso no válidas. Favor intentar nuevamente`);
    }
   if(!verificarEncriptado(contrasenna,objUsuario.contrasenna))
    {
        return (`Contraseña no válida. Favor intentar nuevamente`);
    }
    return true;
};

const consultarUsuarioIngresado=async(idUsuario="")=>{
    const existeUsuario=await Usuario.findById(idUsuario);
    if(!existeUsuario){
        throw new Error(`No existe usuario con el ID ingresado`);
    }
};

const obtenerUsuarioPorApodo=async(apodo="")=>{
    const fichaUsuario=await Usuario.find({apodo}).limit(1);
    return fichaUsuario[0];
}

const consultarPlataformaIngresada=async(id_p_ori="")=>{
    const existePlataforma=await PlataformaOrigen.findById(id_p_ori);
    if(!existePlataforma)
    {
        throw new Error(`No existe plataforma asociada al ID ingresado`);
    }
};

const consultarCategoriaIngresada=async(idCategoria="")=>{
    const existeCategoria=await Categoria.findById(idCategoria);
    if(!existeCategoria){
        throw new Error(`No existe categoría con el ID ingresado`);
    }
};

const consultarPaisIngresado=async(idPais="")=>{
    const existePais=await Pais.findById(idPais);
    if(!existePais){
        throw new Error(`No existe país con el ID ingresado`);
    }
};

const consultarMonedaIngresada=async(idMoneda="")=>{
    const existeMoneda=await Moneda.findById(idMoneda);
    if(!existeMoneda){
        throw new Error(`No existe moneda con el ID ingresado`);
    }
};

const consultarProductoIngresado=async(idProducto="")=>{
    const existeProducto=await Producto.findById(idProducto);
    if(!existeProducto){
        throw new Error(`No existe producto con el ID ingresado`);
    }
};

const validarCategorias=async(categorias=[])=>{
    try 
    {
        if(!Array.isArray(categorias))
        {
            throw new Error('Las categorías deben enviarse en formato de matriz/arreglo.');
        }
        for(let idElemento of categorias)
        {
            if (!objMongoose.Types.ObjectId.isValid(idElemento)) {
                throw new Error(`El ID de categoría '${idElemento}' no es un ID de MongoDB válido.`);
            }
            const fichaCategoria=await Categoria.findById(idElemento);
            if (!fichaCategoria || !fichaCategoria.es_vigente) {
                throw new Error(`La categoría con ID '${idElemento}' no existe o no está vigente.`);
            }
        }
    } 
    catch (error) 
    {
        console.log(error);
        throw new Error(`Problemas al validar la o las categorías.`);
    }
    
    return true;
};

const validarPrecios=async(precios=[])=>{
    if(!Array.isArray(precios))
    {
        throw new Error('Los precios deben enviarse en formato de matriz/arreglo.');
    }
    for(let filaPrecio of precios)
    {
        let {id_pais,id_moneda,precio}=filaPrecio;
        precio=parseFloat(precio);
        //Validar ID
        if (!objMongoose.Types.ObjectId.isValid(id_pais)) {
            throw new Error(`El ID de país '${id_pais}' no es un ID de MongoDB válido.`);
        }
        if (!objMongoose.Types.ObjectId.isValid(id_moneda)) {
            throw new Error(`El ID de moneda '${id_moneda}' no es un ID de MongoDB válido.`);
        }
        //Validar datos existentes
        //País:
        const fichaPais=await Pais.findById(id_pais);
        if (!fichaPais || !fichaPais.es_vigente) {
            throw new Error(`El país con ID '${id_pais}' no existe o no está vigente.`);
        }
        //Moneda:
        const fichaMoneda=await Moneda.findById(id_moneda);
        if (!fichaMoneda || !fichaMoneda.es_vigente){
            throw new Error(`La moneda con ID '${id_moneda}' no existe o no está vigente.`);
        }
        //Asociación entre país y moneda:
        const fichaPaisMoneda=await PaisMoneda.findOne({
            id_pais,
            id_moneda
        });
        if (!fichaPaisMoneda || !fichaPaisMoneda.es_vigente){
            throw new Error(`La asociación entr país con ID '${id_pais}' y moneda con ID '${id_moneda}' no existe o no está vigente.`);
        }
        if(precio<0){
            throw new Error(`El precio ingresado debe ser mayor o igual a cero.`);
        }
    }
    return true;
};

module.exports  =   {
                        comprobarCredenciales:comprobarUsuarioYContrasenna,
                        consultarUsuario:comprobarApodoIngresado,
                        validarIdUsuario:consultarUsuarioIngresado,
                        validarRol:consultarRolIngresado,
                        validarApodo:consultarApodoIngresado,
                        validarPlataforma:consultarPlataformaIngresada,
                        consultarUsuarioApodo:obtenerUsuarioPorApodo,
                        validarCategoria:consultarCategoriaIngresada,
                        validarPais:consultarPaisIngresado,
                        validarMoneda:consultarMonedaIngresada,
                        validarProducto:consultarProductoIngresado,
                        validarCategorias,
                        validarPrecios
                    };
