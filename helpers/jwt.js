const objJWT=require("jsonwebtoken");


const generarToken=(idUsuario="")=>{
    return new Promise((resolve,reject)=>{

        const cargaUtil={idUsuario};
        objJWT.sign(cargaUtil,
            process.env.LLAVE_SECRETA,{
                expiresIn:'6h'
            },
            (err,tokenSalida)=>{
                if(err)
                {
                    console.log(err);
                    reject('No se pudo generar el token.');
                }
                else
                {
                    resolve(tokenSalida);
                }
            }
        );

    });
};

module.exports  =   {
                        generarToken
                    };