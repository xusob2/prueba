const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./database');
const { Autor, Libro } = require('./models');
const path = require('path');
const app = express();
const PORT = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Sirve archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));
// Conectar a la base de datos
connectDB();

// Crear un autor
app.post('/addAutor', async (req, res) => {
  try {
      const { dni, nombre, nacionalidad, fechaNacimiento } = req.body;
      const nuevoAutor = new Autor({ dni, nombre, nacionalidad, fechaNacimiento });
      await nuevoAutor.save();
      res.status(201).json(nuevoAutor);
  } catch (error) {
      res.status(500).json({ message: 'Error al crear el autor', error });
  }
});

// Crear un libro
app.post('/addLibro', async (req, res) => {
    try {
        const { isbn, autor, genero, titulo } = req.body;
        var nuevoLibro;
        //Compruebo si existe el autor
        const autorExiste = await Autor.findOne({dni:autor});
        console.log(autorExiste);
        if (autorExiste!=null){
            nuevoLibro = new Libro({ titulo, autor, isbn, genero });
            await nuevoLibro.save();
            
        }else{
            nuevoLibro = new Libro({ titulo, autor:"Juan Anonimo Gimenez", isbn, genero });
            await nuevoLibro.save();
            
        }
        res.status(201).json(nuevoLibro);
        
        
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el libro', error: error.message });
    }
  });

  app.get('/listaLibros', async (req, res) => {
    try {   
        //Compruebo si existe el autor
        const libros = await Libro.find();
        res.status(201).json(libros);
    } catch (error) {
        res.status(500).json({ message: 'Error al recuperar libros', error: error.message });
    }
  });

  app.get('/listaAutores', async (req, res) => {
    try {   
        const autores = await Autor.find();
        res.status(201).json(autores);
    } catch (error) {
        res.status(500).json({ message: 'Error al recuperar autores', error: error.message });
    }
  });

  app.delete('/borrarAutor', async (req, res) => {
    var dniAutor = req.body.autor;
    try {   
        const autor= await Autor.findOneAndDelete({dni:dniAutor});
        res.status(201).json(autor);
    } catch (error) {
        res.status(500).json({ message: 'Error al borrar el autor', error: error.message });
    }
  });
  app.delete('/borrarLibro', async (req, res) => {
    var isbnLibro = req.body.isbn;
    try {   
        const libro= await Libro.findOneAndDelete({isbn:isbnLibro});
        res.status(201).json(libro);
    } catch (error) {
        res.status(500).json({ message: 'Error al borrar el libro', error: error.message });
    }
  });
  app.put('/actualizarLibro', async (req, res) => {
    const {isbn,titulo,autor,genero} = req.body;
    try {   
        const libro= await Libro.findOneAndReplace({"isbn":isbn},{"isbn":isbn,"autor":autor,"genero":genero, "titulo":titulo});
        res.status(201).json(libro);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el libro', error: error.message });
    }
  });
  app.put('/actualizarAutor', async (req, res) => {
    const {dni,nombre,nacionalidad} = req.body;
    try {   
        const autor= await Autor.findOneAndReplace({"dni":dni},{"dni":dni,"nombre":nombre,"nacionalidad":nacionalidad});
        res.status(201).json(autor);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el autor', error: error.message });
    }
  });

app.get('/', (req, res) => {
    res.send('¡Hola, mundo! Este es un servidor básico con Express.');
});
app.get('/UIlistaAutores', async (req, res) => {
    try {   
        const autores = await Autor.find();
        res.sendFile(path.join(__dirname, 'public/listaAutores.html'));  // Asegúrate de tener el archivo 'listaAutores.html'
    } catch (error) {
        res.status(500).json({ message: 'Error al recuperar autores', error: error.message });
    }
});
app.get('/UIlistaLibros', async (req, res) => {
    try {   
        const libros = await Libro.find();
        res.sendFile(path.join(__dirname, 'public/listaLibros.html'));  // Asegúrate de tener el archivo 'listaLibros.html'
    } catch (error) {
        res.status(500).json({ message: 'Error al recuperar libros', error: error.message });
    }
});
app.get('/addLibro', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/addLibro.html'));  // Asegúrate de tener el archivo 'addLibro.html'
});
app.get('/addAutor', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/addAutor.html'));  // Asegúrate de tener el archivo 'addAutor.html'
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});