const mongoose = require('mongoose');

const autorSchema = new mongoose.Schema({
    dni:{type:String, required:true, unique:true},
    nombre: { type: String, required: true },
    nacionalidad: { type: String },
   
});

const libroSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    autor: {  type: String, required: true },
    isbn :{  type: String, required: true, unique:true },
    genero: { type: String },
});

const Autor = mongoose.model('Autor', autorSchema);
const Libro = mongoose.model('Libro', libroSchema);

module.exports = { Autor, Libro };