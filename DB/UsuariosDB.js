const { usuariosDB } = require("./Conexion"); // Asegúrate de que `usuariosDB` está bien definido en `Conexion.js`
const Usuario = require("../class/Usuario");
const { validarPassword, encriptarPassword } = require("../middlewares/funcionesPassword");

// Función para validar la estructura de un usuario
function validarUser(usuario) {
    return usuario.nombre !== undefined && usuario.usuario !== undefined && usuario.password !== undefined;
}

// Función para mostrar todos los usuarios
async function mostrarUsuarios() {
    try {
        // Verifica que usuariosDB tenga el método correcto, como `find` en lugar de `get`
        const snapshot = await usuariosDB.get(); 
        const usuariosValidos = [];

        snapshot.forEach((doc) => {
            const usuario = new Usuario({ id: doc.id, ...doc.data() });
            if (validarUser(usuario.datos)) {
                usuariosValidos.push(usuario.datos);
            }
        });

        return usuariosValidos;
    } catch (error) {
        console.error("Error al mostrar usuarios:", error);
        throw new Error("No se pudieron recuperar los usuarios.");
    }
}

// Función para buscar un usuario por ID
async function buscarPorId(id) {
    try {
        const doc = await usuariosDB.doc(id).get();
        if (!doc.exists) {
            return null;
        }

        const usuario = new Usuario({ id: doc.id, ...doc.data() });
        if (validarUser(usuario.datos)) {
            return usuario.datos;
        }
        return null;
    } catch (error) {
        console.error("Error al buscar usuario por ID:", error);
        throw new Error("No se pudo buscar el usuario.");
    }
}

// Función para crear un nuevo usuario
async function nuevoUsuario(data) {
    try {
        const { hash, salt } = encriptarPassword(data.password);
        data.password = hash;
        data.salt = salt;
        data.tipousuario = "usuario";

        const usuario = new Usuario(data);
        if (!validarUser(usuario.datos)) {
            throw new Error("Datos de usuario no válidos.");
        }

        await usuariosDB.doc().set(usuario.datos); // Crear nuevo documento en la base de datos
        return true;
    } catch (error) {
        console.error("Error al crear un nuevo usuario:", error);
        return false;
    }
}

// Función para borrar un usuario por ID
async function borrarUsuario(id) {
    try {
        const usuario = await buscarPorId(id);
        if (usuario) {
            await usuariosDB.doc(id).delete();
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error al borrar usuario:", error);
        throw new Error("No se pudo borrar el usuario.");
    }
}

module.exports = {
    mostrarUsuarios,
    nuevoUsuario,
    borrarUsuario,
    buscarPorId,
};

