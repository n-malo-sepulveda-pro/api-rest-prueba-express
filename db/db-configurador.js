const objMongoose=require("mongoose");
const objDNS=require("node:dns");
process.loadEnvFile();
require("dotenv-expand").expand({ parsed: process.env });

objDNS.setServers(["8.8.8.8", "8.8.4.4"]);

const enlazarBaseMongo=async()=>{
    try 
    {
        await objMongoose.connect(process.env.BD_ENLACE);
        console.log("Conectado a BD Mongo");
    }
    catch(error) 
    {
        console.log(`Error al conectarse con BD Mongo:\n${error}`);
        console.log(`Enlace:\n${process.env.BD_ENLACE}`);
        throw new Error("Error al intentar enlazarse con BD Mongo");
    }
};

module.exports={
    conectarMongo:enlazarBaseMongo,
};