process.loadEnvFile();
const objCriptologo=require('node:crypto');

// Configuración del algoritmo
const ALGORITMO='aes-256-gcm';

const obtenerClaveCriptografica=(salt)=>{
    return objCriptologo.scryptSync(process.env.LLAVE_SECRETA,salt,32);
};

const encriptarTexto=(texto="")=>{
    if (!textoPlano)
    {
        throw new Error('Favor proporcionar un texto a encriptar.');        
    }
    const salt=objCriptologo.randomBytes(process.env.LONGITUD_SALT);
    const iv=objCriptologo.randomBytes(process.env.LONGITUD_IV);
    const clave=obtenerClaveCriptografica(salt);
    const cifrador=objCriptologo.createCipheriv(process.env.ALGORITMO_ENCRIPTACION, clave, iv);

    let encriptado=cifrador.update(textoPlano, 'utf8', 'hex');
    encriptado+=cifrador.final('hex');
    // La etiqueta garantiza que nadie haya manipulado el mensaje cifrado
    const etiqueta=cipher.getAuthTag();
    // Unir todos los componentes necesarios en un solo texto usando ":" para guardarlo con facilidad
    return `${salt.toString('hex')}:${iv.toString('hex')}:${etiqueta.toString('hex')}:${encriptado}`;
};

const desencriptarTexto=(textoEncriptado="")=>{
    if (!textoEncriptado)
    {
        throw new Error('Favor proporcionar un texto a desencriptar.');
    }
    try 
    {
        const [saltHex, ivHex, tagHex, encriptadoHex] = textoEncriptado.split(':');
        if (!saltHex || !ivHex || !tagHex || !encriptadoHex)
        {
            throw new Error('El formato del texto encriptado es inválido.');
        }
        const salt=Buffer.from(saltHex, 'hex');
        const iv=Buffer.from(ivHex, 'hex');
        const etiqueta=Buffer.from(tagHex, 'hex');
        const clave=obtenerClaveCriptografica(salt);
        const descifrador=objCriptologo.createDecipheriv(process.env.ALGORITMO_ENCRIPTACION, clave, iv);
        descifrador.setAuthTag(etiqueta);
        let desencriptado=descifrador.update(encriptadoHex, 'hex', 'utf8');
        desencriptado+=descifrador.final('utf8');
        return desencriptado;
    } 
    catch(error)
    {
        // Si la etiqueta no coincide o los datos se corrompieron, se lanza un error
        throw new Error('Fallo al desencriptar: Los datos fueron manipulados o la clave es incorrecta.');
    }

};

const encriptarTextoSimple=(texto)=>{

    // 1. Generamos un salt aleatorio (se recomiendan 16 bytes para scrypt)
    const objSalt = objCriptologo.randomBytes(parseInt(process.env.LONGITUD_SALT, 10));
    // 2. Generar el hash irreversible usando scryptSync
    // Parámetros: (textoPlano, salt, longitudDelHashDeSalida, opcionesDeSeguridad)
    const objHash=objCriptologo.scryptSync(texto, objSalt, parseInt(process.env.LONGITUD_HASH_SALIDA,10), {
        N: 16384, // Costo de CPU/Memoria (estándar recomendado)
        r: 8,     // Tamaño de bloque
        p: 1      // Paralelización
    });
    const valorSalida = `${objSalt.toString('hex')}:${objHash.toString('hex')}`;
    return valorSalida;
};

const verificarValorEncriptado=(texto,valorEncriptado)=>{
    try 
    {
        const [saltHex, hashHex] = valorEncriptado.split(':');//Separar el salt y el hash que guardamos previamente
        if (!saltHex || !hashHex) 
        {
            return false;
        }
        // 2. Convertir nuevamente el salt y el hash original a búfers
        const objSalt = Buffer.from(saltHex, 'hex');
        const buferHash = Buffer.from(hashHex, 'hex');

        // 3. Aplicar el mismo algoritmo scrypt al texto plano usando el mismo salt
        const longitudHashSalida = buferHash.length; // Asegura que tengan el mismo tamaño
        const buferNuevoHash = objCriptologo.scryptSync(texto, objSalt, longitudHashSalida, {
            N: 16384,
            r: 8,
            p: 1
        });

        const resultadoComparacion=objCriptologo.timingSafeEqual(buferNuevoHash,buferHash);
        return resultadoComparacion;
    } 
    catch (error) 
    {
        console.log("error en proceso comparativo\n"+error);
        return false;
    }
};

module.exports= {
                    encriptar:encriptarTexto,
                    desencriptar:desencriptarTexto,
                    verificarEncriptado:verificarValorEncriptado,
                    encriptarSimple:encriptarTextoSimple
                };