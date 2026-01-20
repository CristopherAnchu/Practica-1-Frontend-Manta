import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

PORT = int(os.getenv('PORT', 5000))
HOST = os.getenv('HOST', '0.0.0.0')
