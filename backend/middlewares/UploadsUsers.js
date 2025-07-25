// middlewares/uploadUsers.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const folder = 'ImagesUsers';

// Crear carpeta si no existe
if (!fs.existsSync(folder)) {
  fs.mkdirSync(folder, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, folder); // Carpeta donde se guardan las imágenes
  },
  filename: (req, file, cb) => {
    // Genera un nombre único con timestamp y extensión original
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const uploadUsers = multer({ storage });

module.exports = uploadUsers;
