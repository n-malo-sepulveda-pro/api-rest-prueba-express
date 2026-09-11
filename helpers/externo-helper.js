const {OAuth2Client:clienteOAuth}=require("google-auth-library");
const cliente=new clienteOAuth(process.env.ID_CLIENTE_GOOGLE);

const verificarTokenAlphabet=async(token="")=>{
    const ticket = await cliente.verifyIdToken({
        idToken: token,
        audience: process.env.ID_CLIENTE_GOOGLE,  // Specify the WEB_CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[WEB_CLIENT_ID_1, WEB_CLIENT_ID_2, WEB_CLIENT_ID_3]
    });
    const cargaUtil = ticket.getPayload();
    return cargaUtil;
};

module.exports  =   {
                        verificarTokenGoogle:verificarTokenAlphabet
                    };