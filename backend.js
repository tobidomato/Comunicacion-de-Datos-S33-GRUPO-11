const express = require('express');
const cors = require('cors');
const sql = require('mssql');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Configuración de la conexión SQL Server con usuario y contraseña
const config = {
  user: 'nodeuserr',               // Tu usuario creadon
  password: 'TuContraseñaSegura124', // Su contraseña
  server: 'localhost',            // Puede ser localhost o IP del servidor
  database: 'Comunicacion',      // Tu base de datos
  options: {
    trustServerCertificate: true  // Si usas SSL/autofirmado, ponelo en true para evitar errores
  }
};

app.post('/api/stats', async (req, res) => {
  try {
    const { resolution, bitDepth, imageSizeBytes } = req.body;
    const timestamp = new Date();

    // Conectamos a la base
    await sql.connect(config);

    // Insertamos en tabla Estadisticas (asegurate que exista la tabla con columnas correctas)
    await sql.query`
      INSERT INTO Estadisticas (resolution, bitDepth, imageSizeBytes, timestamp)
      VALUES (${resolution}, ${bitDepth}, ${imageSizeBytes}, ${timestamp})
    `;

    res.status(201).json({ message: 'Estadísticas guardadas en DB' });
  } catch (error) {
    console.error('Error al guardar en BD:', error);
    res.status(500).json({ error: 'Error al guardar estadísticas' });
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
