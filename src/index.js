const express = require('express');
// Se ejecuta por defecto, no es necesario importarlo
// const ejs = require('ejs');
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

// inicializaciones
const app = express();

// Configuracion
app.set('port', 3001);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
const storageAndRename = multer.diskStorage({
    destination: path.join(__dirname, 'public/images'),
    filename: (req, file, callback) => {
        // renombrar con un id unico(uuid) y le concateno la extension del archivo
        callback(null, uuidv4() + path.extname(file.originalname).toLowerCase());
    }
});

const upload = multer({
    storage: storageAndRename,
    dest: storageAndRename.destination,
    limits: { fileSize: 2000000 },
    fileFilter: (req, file, callback) => {
        const fileTypes = /jpeg|jpg|png|gif/;
        const mimetype = fileTypes.test(file.mimetype);
        const extname = fileTypes.test(path.extname(file.originalname));
        if (mimetype && extname) {
            return callback(null, true);
        }
        callback("Error: El archivo no cumple con el tipo de imagen");
    }
}).single('image');

app.use(upload);

// Rutas
app.use(require('./routes/routes'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));
// Iniciar server
app.listen(app.get('port'), () => {
    console.log(`Server corriendo en puerto ${app.get('port')}`);
})