<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Galeria;
class GaleriaController extends Controller
{
    public function obtenerGaleriaAPI() {
        return response()->json(Galeria::latest()->get());
    }

    public function guardarFotoAPI(Request $request) {
        $request->validate(['titulo' => 'required', 'imagen' => 'required|image']);

        // Crear carpeta si no existe
        $path = public_path('storage/galeria/');
        if (!File::exists($path)) File::makeDirectory($path, 0755, true);

        // Generar nombre WebP y convertir
        $filename = time() . '.webp';
        $img = imagecreatefromstring(file_get_contents($request->file('imagen')->getRealPath()));
        imagewebp($img, $path . $filename, 75);
        imagedestroy($img);

        $foto = Galeria::create(['titulo' => $request->titulo, 'imagen' => $filename]);
        return response()->json(['success' => true]);
    }
}
