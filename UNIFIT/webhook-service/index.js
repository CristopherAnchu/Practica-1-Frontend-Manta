const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3005;

app.use(cors());
app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
  console.log('----- EVENTO RECIBIDO -----');
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('---------------------------');
  
  res.status(200).json({ message: 'Evento recibido correctamente' });
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.listen(PORT, () => {
  console.log(`Webhook Service listening on port ${PORT}`);
});
