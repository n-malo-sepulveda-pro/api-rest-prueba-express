
const Servidor=require("./servidor");
//Modelos de datos
const Categoria=require("./categoria");
const PlataformaOrigen=require("./plataforma_origen");
const Rol=require("./rol");
const Pais=require("./pais");
const Moneda=require("./moneda");
const Usuario=require("./usuario");
const UsuarioPerfilFoto=require("./usuario_perfil_foto");
const PaisMoneda=require("./pais_moneda");
const Producto=require("./producto");
const ProductoCategoria=require("./producto_categoria");
const ProductoPrecio=require("./producto_precio");

module.exports  =   {
                        Servidor,
                        Categoria,
                        PlataformaOrigen,
                        Rol,
                        Pais,
                        Moneda,
                        Usuario,
                        UsuarioPerfilFoto,
                        PaisMoneda,
                        Producto,
                        ProductoCategoria,
                        ProductoPrecio
                    };