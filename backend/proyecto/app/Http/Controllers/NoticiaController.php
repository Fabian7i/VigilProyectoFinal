<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Noticia;
class NoticiaController extends Controller
{
   
  public function obtenerNoticasAPI()
{
    $noticiaDestacada = \App\Models\Noticia::where('es_destacada', true)->latest()->first();

    // Quitamos el ->take(3) para traer el resto de noticias sin censura
    $noticiasRecientes = \App\Models\Noticia::where('id', '!=', $noticiaDestacada?->id)
                                ->latest()
                                ->get() // <--- Quitando ->take(3), get() traerá todas las que existan
                                ->map(function($noticia) {
                                    $noticia->dia = $noticia->dia;
                                    $noticia->mes_anio = $noticia->mes_anio;
                                    return $noticia;
                                });

    return response()->json([
        'destacada' => $noticiaDestacada,
        'recientes' => $noticiasRecientes
    ]);
}

    
    public function guardarNoticiaAPI(Request $request)
    {
        $request->validate([
            'titulo' => 'required|string|max:255',
            'cuerpo' => 'required|string',
            'imagen' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048', 
        ]);

        try {
            $noticia = new Noticia();
            $noticia->titulo = $request->input('titulo');
            $noticia->cuerpo = $request->input('cuerpo');
            
            $noticia->dia = date('d');
            $noticia->mes_anio = date('M Y'); 
            $noticia->es_destacada = false; 
          
            if ($request->hasFile('imagen')) {
                $archivo = $request->file('imagen');
               
                $nombreImagen = time() . '_' . $archivo->getClientOriginalName();
                
               
                $archivo->move(public_path('storage/imagenes'), $nombreImagen);
                
                $noticia->imagen = $nombreImagen;
            }

            $noticia->save();

            return response()->json([
                'success' => true,
                'message' => '¡Noticia e imagen guardadas correctamente!',
                'noticia' => $noticia
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error interno al guardar la noticia.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
