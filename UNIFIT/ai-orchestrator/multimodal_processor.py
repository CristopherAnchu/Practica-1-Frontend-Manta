"""
Multimodal Processor
Procesa diferentes tipos de entrada: imágenes, PDFs, audio
"""

from PIL import Image
import pytesseract
import io
from PyPDF2 import PdfReader
from typing import Optional
import base64


class MultimodalProcessor:
    """Procesador de contenido multimodal"""
    
    def __init__(self):
        print("✅ Multimodal Processor inicializado")
    
    async def process_image(self, image_bytes: bytes) -> str:
        """
        Procesa una imagen y extrae texto (OCR)
        Útil para: documentos, identificaciones, notas escritas
        """
        try:
            # Abrir imagen
            image = Image.open(io.BytesIO(image_bytes))
            
            # OCR con pytesseract
            text = pytesseract.image_to_string(image, lang='spa+eng')
            
            if not text.strip():
                return "[No se detectó texto en la imagen]"
            
            return text.strip()
            
        except Exception as e:
            return f"[Error procesando imagen: {str(e)}]"
    
    async def process_pdf(self, pdf_bytes: bytes) -> str:
        """
        Extrae texto de un archivo PDF
        Útil para: facturas, contratos, catálogos
        """
        try:
            pdf_file = io.BytesIO(pdf_bytes)
            pdf_reader = PdfReader(pdf_file)
            
            text = ""
            for page in pdf_reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n\n"
            
            if not text.strip():
                return "[No se pudo extraer texto del PDF]"
            
            # Limitar tamaño para no sobrecargar el LLM
            max_chars = 4000
            if len(text) > max_chars:
                text = text[:max_chars] + "\n\n[... texto truncado ...]"
            
            return text.strip()
            
        except Exception as e:
            return f"[Error procesando PDF: {str(e)}]"
    
    async def process_audio(self, audio_bytes: bytes, format: str = "mp3") -> str:
        """
        Transcribe audio a texto (opcional - requiere Whisper)
        Útil para: notas de voz, consultas habladas
        """
        try:
            # Implementación con Whisper (comentada por dependencias)
            # import whisper
            # model = whisper.load_model("base")
            # result = model.transcribe(audio_file_path)
            # return result["text"]
            
            return "[Transcripción de audio no disponible - requiere configuración adicional]"
            
        except Exception as e:
            return f"[Error procesando audio: {str(e)}]"
    
    def encode_image_base64(self, image_bytes: bytes) -> str:
        """Codifica imagen a base64 para enviar a APIs"""
        return base64.b64encode(image_bytes).decode('utf-8')
    
    def decode_image_base64(self, base64_string: str) -> bytes:
        """Decodifica imagen desde base64"""
        return base64.b64decode(base64_string)
