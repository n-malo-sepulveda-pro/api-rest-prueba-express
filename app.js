const Servidor=require("./models/servidor");

const main=async()=>{
    const objServidor=new Servidor();
    objServidor.oirPuerto();
};

main();