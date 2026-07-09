<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bienvenida Institucional - Colegio Enrique Paillardelle</title>
  <link rel="stylesheet" href="css/paginaweb.css">
  <link rel="stylesheet" href="css/bienvenida.css">
  <link rel="icon" type="image/png" href="img/logo_enriquepaillardelle.png">
</head>

<body>

  <header>
    <div class="logo">
      <a href="index.php#inicio"><img src="img/logo_enriquepaillardelle.png" alt="Logo Colegio Enrique Paillardelle"></a>
    </div>
    <nav>
      <ul>
        <li><a href="index.php#inicio">Inicio</a></li>
        
        <li class="dropdown">
          <a href="index.php#nosotros" class="dropdown-toggle">Nosotros</a>
          <ul class="dropdown-menu">
            <li><a href="bienvenida.php">Bienvenida institucional</a></li>
            <li><a href="historia.php">Reseña histórica</a></li>
            <li><a href="#">Misión y Visión</a></li>
            <li><a href="#">Plana directiva</a></li>
            <li><a href="#">Comunidad Paillardelina</a></li>
            <li><a href="himno.php">Himno del colegio</a></li>
            <li><a href="#">Organigrama institucional</a></li>
          </ul>
        </li>
        
        <li><a href="index.php#actividades">Actividades</a></li>
        <li><a href="index.php#noticias">Noticias</a></li>
        <li><a href="index.php#admision">Admisión</a></li>
        <li><a href="contacto.php">Contacto</a></li>
      </ul>
    </nav>
    <a href="login.php" class="btn">Iniciar Sesión</a>
  </header>

  <section class="banner-seccion-bienvenida">
    <div class="capa-degradada"></div>
    <div class="contenido-banner-seccion">
      <h2>BIENVENIDA INSTITUCIONAL</h2>
      <div class="linea-decorativa-amarilla"></div>
      <p>Conoce el mensaje de nuestra comunidad educativa a las familias paillardelinas</p>
    </div>
  </section>

  <main class="bloque-contenido-bienvenida">
    
    <div class="fila-presentacion-bienvenida">
      <div class="columna-texto-bienvenida">
        <h3>¡Bienvenidos a la I.E. Enrique Paillardelle!</h3>
        <p>
          La Institución Educativa Enrique Paillardelle les da la más cordial bienvenida a nuestra comunidad educativa. 
          Somos una institución pública con una sólida trayectoria al servicio de la educación tacneña, comprometida con la 
          formación integral de niños y jóvenes, promoviendo aprendizajes de calidad, el desarrollo de valores y el 
          fortalecimiento de ciudadanos responsables con su entorno.
        </p>
        <p>
          Nuestro compromiso es brindar una educación que favorezca el desarrollo académico, humano, científico, tecnológico 
          y ambiental, fomentando el pensamiento crítico, la creatividad, la innovación y el respeto como pilares fundamentales 
          para afrontar los desafíos del mundo actual.
        </p>
      </div>
      
      <div class="columna-destaque-bienvenida">
        <div class="tarjeta-insignia-bienvenida">
          <div class="icono-tarjeta">🎓</div>
          <h4>Compromiso con Tacna</h4>
          <p>"Educamos con vocación, inspiramos con el ejemplo y formamos ciudadanos preparados para construir un mejor futuro."</p>
        </div>
      </div>
    </div>

    <div class="contenedor-tarjetas-didacticas">
      
      <div class="tarjeta-didactica">
        <div class="numero-decorativo">01</div>
        <h3>Desarrollo Académico</h3>
        <p>Potenciamos las áreas científicas, tecnológicas y ambientales de la mano con el desarrollo humano de cada alumno.</p>
      </div>

      <div class="tarjeta-didactica">
        <div class="numero-decorativo">02</div>
        <h3>Pensamiento Crítico</h3>
        <p>Fomentamos la creatividad y la innovación constante para brindar herramientas efectivas ante el mundo competitivo actual.</p>
      </div>

      <div class="tarjeta-didactica">
        <div class="numero-decorativo">03</div>
        <h3>Tarea Compartida</h3>
        <p>Creemos en el trabajo articulado entre estudiantes, docentes y padres de familia para lograr una convivencia armónica basada en valores.</p>
      </div>

    </div>

  </main>

  <!-- ==========================================================================
       INYECCIÓN DEL FOOTER GLOBAL DE MANERA DINÁMICA
       ========================================================================== -->
  <?php include 'footer.php'; ?>

  <!-- SCRIPTS FINALES -->
  <script src="script.js/codigo.js"></script>

</body>
</html>