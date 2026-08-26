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
    const salt=objCriptologo.randomBytes(16).toString('hex');
    const hash=objCriptologo.scryptSync(texto, salt, 64).toString('hex');
    return `${salt}:${hash}`;
};

const verificarValorEncriptado=(texto,hashAlmacenado)=>{
    const [salt, hashOriginal] = hashAlmacenado.split(':');
    const hashNuevo=objCriptologo.scryptSync(passwordIngresada, salt, 64).toString('hex');
    return objCriptologo.timingSafeEqual(Buffer.from(hashOriginal, 'hex'), Buffer.from(hashNuevo, 'hex'));
};

module.exports= {
                    encriptar:encriptarTexto,
                    desencriptar:desencriptarTexto,
                    verificarEncriptado:verificarValorEncriptado,
                    encriptarSimple:encriptarTextoSimple
                };