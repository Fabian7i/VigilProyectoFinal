<?php

namespace App\Http\Controllers;
use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
 public function indexApi()
{
    $comments = Comment::whereNull('parent_id')
                        ->with('replies')
                        ->latest()
                        ->get();

    return response()->json($comments);
}

/**
 * Guarda el comentario anónimo enviado desde el HTML Puro
 */
public function storeAnonymousApi(Request $request)
{
    $request->validate([
        'content' => 'required|string|max:500',
    ]);

    $comment = Comment::create([
        'content' => $request->content,
        'parent_id' => null,
        'is_admin' => false,
    ]);

   return response()->json($comment, 201); // 👈 ¡Cambia el 21 por 201!
}
}
