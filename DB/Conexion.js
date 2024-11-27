const admin=require("firebase-admin");
const keys=require("../keys.json");
admin.initializeApp({
    credential:admin.credential.cert(keys)
});
const db=admin.firestore();
const miejemplobd=db.collection("miejemplobd");
const producto=db.collection("producto");
const ventas=db.collection("ventas");

module.exports = {
    miejemplobd,
    producto,
    ventas
}

