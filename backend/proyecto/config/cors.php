<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    */

    // CORRECCIÓN 1: Añadimos 'noticias' por si tu backend sigue procesando la ruta en web.php
    'paths' => ['api/*', 'noticias', 'login', 'register', 'logout', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    // CORRECCIÓN 2: Quitamos el '*' para que no choque con supports_credentials => true
    'allowed_origins' => [
        'http://127.0.0.1:5500',
        'http://localhost:5500',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];