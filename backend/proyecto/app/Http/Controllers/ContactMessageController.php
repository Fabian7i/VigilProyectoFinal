<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ContactMessageController extends Controller
{
public function store(Request $request) {
    // 1. Guardar en la base de datos
    $msg = ContactMessage::create($request->all());
    
    // 2. Retornar éxito
    return response()->json(['success' => true]);
}

// app/Http/Controllers/ContactMessageController.php
public function index()
{
    // Obtiene todos los mensajes de la tabla contact_messages
    $mensajes = \App\Models\ContactMessage::latest()->get();
    return response()->json($mensajes);
}
}
