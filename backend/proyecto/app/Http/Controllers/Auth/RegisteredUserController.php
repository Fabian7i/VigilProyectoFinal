<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\View\View;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): View
    {
        return view('auth.register');
    }
    public function index()
{
    $usuarios = User::select('id', 'name', 'email', 'activo')->get();

    return response()->json($usuarios);
}
public function toggleStatus($id)
{
    $user = User::findOrFail($id);
    // Cambia el estado: si es 1 pasa a 0, y viceversa
    $user->activo = !$user->activo;
    $user->save();

    return response()->json(['message' => 'Estado actualizado', 'activo' => $user->activo]);
}
    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
public function store(Request $request)
{
    // 1. Validamos los campos que vienen del formulario
 $request->validate([
    'name' => ['required', 'string', 'max:255'], // ◄ Asegúrate que tenga un solo ":"
    'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
    'password' => ['required', 'confirmed'],
]);
    // 2. Creamos el usuario en MySQL
    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
    ]);

    event(new Registered($user));

    Auth::login($user);

    // 3. Retornamos la respuesta JSON limpia para tu Vanilla JS
    return response()->json([
        'status' => 'success',
        'message' => 'Usuario registrado con éxito.'
    ], 201);
}

public function update(Request $request, $id)
{
    $user = User::findOrFail($id);

    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email,' . $id,
    ]);

    $user->name = $request->name;
    $user->email = $request->email;

    if ($request->filled('password')) {
        $user->password = Hash::make($request->password);
    }

    $user->save();

    return response()->json([
        'message' => 'Usuario actualizado correctamente.'
    ]);
}

public function destroy($id)
{
    $user = User::findOrFail($id);
    $user->delete();

    return response()->json([
        'message' => 'Usuario eliminado correctamente.'
    ]);
}
}
