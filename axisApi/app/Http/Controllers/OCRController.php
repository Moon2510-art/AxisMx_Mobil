<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OCRController extends Controller
{
    /**
     * Reconocer texto de una imagen (para credenciales o placas)
     */
    public function recognizeText(Request $request)
    {
        // Validar que llegue la imagen
        $request->validate([
            'image' => 'required|image|max:5120',
            'type' => 'required|in:plate,credential' // Tipo de escaneo
        ]);

        try {
            $image = $request->file('image');
            $imageData = base64_encode(file_get_contents($image));

            // Llamada a Google Cloud Vision
            $response = Http::withoutVerifying()
                ->post('https://vision.googleapis.com/v1/images:annotate?key=' . env('GOOGLE_CLOUD_VISION_KEY'), [
                    'requests' => [
                        [
                            'image' => ['content' => $imageData],
                            'features' => [
                                ['type' => 'TEXT_DETECTION', 'maxResults' => 1]
                            ]
                        ]
                    ]
                ]);

            $data = $response->json();
            
            // Extraer el texto detectado
            $fullText = $data['responses'][0]['textAnnotations'][0]['description'] ?? null;

            if (!$fullText) {
                return response()->json([
                    'success' => false, 
                    'message' => 'No se detectó texto en la imagen'
                ], 422);
            }

            // Procesar según el tipo
            if ($request->type === 'plate') {
                $result = $this->extractPlate($fullText);
                $resultType = 'placa';
            } else {
                $result = $this->extractCredential($fullText);
                $resultType = 'codigo_credencial';
            }

            if ($result) {
                return response()->json([
                    'success' => true, 
                    'data' => [
                        $resultType => $result,
                        'texto_original' => $fullText
                    ]
                ]);
            }

            return response()->json([
                'success' => false, 
                'message' => 'No se encontró un formato válido',
                'texto_original' => $fullText
            ], 422);

        } catch (\Exception $e) {
            Log::error("Error OCR Google: " . $e->getMessage());
            return response()->json([
                'success' => false, 
                'message' => 'Error de conexión con Google Vision'
            ], 500);
        }
    }

    /**
     * Extraer placa del texto (para vehículos)
     */
    private function extractPlate($text)
    {
        $cleanText = preg_replace('/[^A-Z0-9]/', '', strtoupper($text));
        
        $patterns = [
            '/[A-Z]{3}\d{4}/',      // ABC1234
            '/[A-Z]{3}\d{2}[A-Z]{2}/', // ABC12DE
            '/[A-Z]{3}\d{3}/',       // ABC123
            '/[A-Z]{2}\d{4}/',       // AB1234
        ];

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $cleanText, $matches)) {
                return $matches[0];
            }
        }

        // Si tiene entre 6 y 8 caracteres, devolver como posible placa
        if (strlen($cleanText) >= 6 && strlen($cleanText) <= 8) {
            return $cleanText;
        }

        return null;
    }

    /**
     * Extraer código de credencial (números de 8+ dígitos)
     */
    private function extractCredential($text)
    {
        // Limpiar: solo números
        $cleanText = preg_replace('/[^0-9]/', '', $text);
        
        // Buscar números de 8 a 12 dígitos (típico de credenciales)
        if (preg_match('/\d{8,12}/', $cleanText, $matches)) {
            return $matches[0];
        }
        
        // Si no encuentra patrón pero hay números de 6+ dígitos
        if (strlen($cleanText) >= 6) {
            return $cleanText;
        }
        
        return null;
    }
}