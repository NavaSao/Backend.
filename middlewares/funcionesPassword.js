const { log } = require("console");
const crypto=require("crypto");

function encriptarPassword(password) {
    const salt = crypto.randomBytes(32).toString("hex");

    const hash = crypto.scryptSync(password, salt, 10000, 64, "sha512").toString("hex");
  
    return {
        salt,
        hash
    }
}

function validarPassword(password, salt, hash) {
   
    
    const hashEvaluar = crypto.scryptSync(password, salt, 10000, 64, "sha512");

    return hashEvaluar == hash;
}

function usuarioAutorizado(){
  
}

function adminAutorizado(){
    
}

module.exports = {
    encriptarPassword,
    validarPassword,
    usuarioAutorizado,
    adminAutorizado
}

