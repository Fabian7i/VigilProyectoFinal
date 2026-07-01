<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    */

    'paths' => ['api/*', 'login', 'register', 'logout', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    // Aquí le damos permiso explícito a tu Live Server y al localhost
    'allowed_origins' => [
        'http://127.0.0.1:5500',
        'http://localhost:5500',
        '*'
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];