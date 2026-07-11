<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\NoticiaController;
use Illuminate\Support\Facades\Route;

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

Route::get('/comentarios', [CommentController::class, 'indexApi']);
Route::post('/comentarios/anonimo', [CommentController::class, 'storeAnonymousApi']);
require __DIR__.'/auth.php';
