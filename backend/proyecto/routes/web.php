<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\NoticiaController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Comunicado;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\ContactMessageController;
// Si estás usando la opción de API (sin enredos de CSRF token)
Route::get('/comunicados', [Comunicado::class, 'index']);
Route::post('/comunicados', [Comunicado::class, 'store']);
Route::get('/comunicados/{id}', [Comunicado::class, 'show']);
Route::put('/comunicados/{id}', [Comunicado::class, 'update']); // <-- Para editar
Route::delete('/comunicados/{id}', [Comunicado::class, 'destroy']);
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/
// Añade esta línea para permitir borrar comentarios
Route::delete('/comentarios/{id}', [CommentController::class, 'destroy']);
Route::get('/usuarios', [RegisteredUserController::class, 'index']);
Route::get('/usuarios/{id}', [RegisteredUserController::class, 'show']);
Route::put('/usuarios/{id}', [RegisteredUserController::class, 'update']);
Route::delete('/usuarios/{id}', [RegisteredUserController::class, 'destroy']);
Route::patch('/usuarios/{id}/estado', [RegisteredUserController::class, 'toggleStatus']);


Route::get('/noticias', [NoticiaController::class, 'obtenerNoticasAPI']);
Route::post('/noticias', [NoticiaController::class, 'guardarNoticiaAPI']);
Route::post('/noticias/{id}', [NoticiaController::class, 'actualizarNoticiaAPI']);
Route::delete('/noticias/{id}', [NoticiaController::class, 'eliminarNoticiaAPI']);

Route::post('/noticias', [NoticiaController::class, 'guardarNoticiaAPI']);
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Rutas para el módulo de contacto
Route::post('/contacto', [ContactMessageController::class, 'store']); // Guardar en BD

// Cambia esto:
Route::get('/mensajes', [ContactMessageController::class, 'index']);
// Ruta explícita utilizando POST
Route::post('/comentarios/{id}/responder', [CommentController::class, 'responderAdmin']);
Route::get('/comentarios', [CommentController::class, 'indexApi']);
Route::post('/comentarios/anonimo', [CommentController::class, 'storeAnonymousApi']);
require __DIR__.'/auth.php';
