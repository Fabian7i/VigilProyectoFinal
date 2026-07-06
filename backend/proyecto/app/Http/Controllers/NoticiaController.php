<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NoticiaController extends Controller
{
   public function obtenerNoticasAPI()
    {
        $noticiaDestacada = Noticia::where('es_destacada', true)->latest()->first();

        // Estructuramos los datos de la fecha antes de enviarlos
        if ($noticiaDestacada) {
            $noticiaDestacada->dia = $noticiaDestacada->dia;
            $noticiaDestacada->mes_anio = $noticiaDestacada->mes_anio;
        }

        $noticiasRecientes = Noticia::where('id', '!=', $noticiaDestacada?->id)
                                    ->latest()
                                    ->take(3)
                                    ->get()
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
}
