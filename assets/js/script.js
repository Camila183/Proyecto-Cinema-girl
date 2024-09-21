function generateUrl() {
  let id = Math.floor(Math.random() * 9000000) + 1000000;
  return `https://www.omdbapi.com/?i=tt${id}&apikey=efb82061&type=movie`;
}


function getPic() {
  $.ajax({
  url: generateUrl(),
  method: 'GET',
  dataType: 'json',
  success: function(info) {
  if (info.Poster !== 'N/A' && info.Type === 'movie') {
  renderPic(info);
  } else {
  getPic(); // Reintentar si no hay película o cartel válido
  }
  },
  error: function(error) {
  console.error('Error al obtener la película:', error);
  }
  });
  }

$(document).ready(function() {
  for (let index = 1; index < 4; index++) {
      getPic();
  }
});
function renderPic(data) {
  console.log(data);
 
  mostrarDatos(data);
}

function mostrarDatos(info) {
  console.log(info);

  const nuevaInfo = info;

 
  let posterDiv = $("<div></div>").addClass("recomendaciones");

 
  $("<img>").attr("src", nuevaInfo.Poster).appendTo(posterDiv);

 
  $("<h3></h3>")
  .html(`<a href="movie-details.html?title=${encodeURIComponent(nuevaInfo.Title)}" target="_blank">${nuevaInfo.Title}</a>`)
  .appendTo(posterDiv);
  $("<p></p>").text(nuevaInfo.Actors).appendTo(posterDiv);


  $("#recomendaciones").append(posterDiv);
}








const apikey = 'bcf9754d'; 

$(document).ready(function(){
  $("#search-form").submit(function (e) {
      e.preventDefault(); // Evitar que la página se recargue
      let nombrePelicula = $("#search-input").val().toLowerCase();
      
      if (nombrePelicula) {
          // Borrar todo el contenido del body antes de mostrar los resultados
          $('body').empty();
          buscarPelicula(nombrePelicula);
      } else {
          alert("Necesita colocar un valor en el input");
      }
      $("#search-input").val("");
  });

  function buscarPelicula(movie) {
      $.ajax({
          type: "GET",
          url:  `https://www.omdbapi.com/?apikey=${apikey}&s=${movie}`,
          dataType: "json",
          success: function (data) {
              renderMovie(data);
          },
          error: function() {
              alert('Error al buscar la película.');
          }
      });
  }

  function renderMovie(data) {
      // Crear una nueva estructura HTML
      const newHtml = `
              <header>
      <nav>
        <img src="assets/img/CINEMA.png" alt="cinema" class="cinema" />
        <ul class="menu">
          <li><a href="index.html">Inicio</a></li>
          <li>
            <a href="#">Categorías</a>
            <ul>
              <li>
                <a href="categorias.html?categoria=harry+potter"
                  >Harry Potter</a
                >
              </li>
              <li><a href="categorias.html?categoria=barbie">Barbie</a></li>
              <li>
                <a href="categorias.html?categoria=spider+man">Spiderman</a>
              </li>
              <li>
                <a href="categorias.html?categoria=monster+high"
                  >Monster High</a
                >
              </li>
              <li>
                <a href="categorias.html?categoria=star+wars">Star Wars</a>
              </li>
              <li>
                <a href="categorias.html?categoria=lord+of+the+rings"
                  >The Lord of the Rings</a
                >
              </li>
              <li><a href="categorias.html?categoria=x+men">X-Men</a></li>
            </ul>
          </li>
          <li><a href="nosotras.html">Nosotras</a></li>
          <li><a href="contacto.html">Contáctanos</a></li>
        </ul>
      </nav>
    </header>
      <main>
     

        <!-- Contenedor donde se mostrarán los resultados de búsqueda -->
        <!-- Filtros -->
        <h1 id="result-header">Resultados de la búsqueda</h1>
        <div id="filtros">
          <label for="ordenar">Ordenar por:</label>
          <select id="ordenar">
            <option value="titulo">Título (A-Z)</option>
            <option value="titulo-desc">Título (Z-A)</option>
            <option value="anio-asc">Año (Ascendente)</option>
            <option value="anio-desc">Año (Descendente)</option>
          </select>

          <label for="filtroAnio">Mostrar películas después del año:</label>
          <input type="number" id="filtroAnio" placeholder="Ingrese un año" />

          <button id="aplicarFiltros">Aplicar Filtros</button>
        </div>

        <div id="movies-container" class="movies-grid"></div>
        
    
    </main>
      `;
      
      // Añadir la nueva estructura HTML al body
      $('body').html(newHtml);

      const movieContainer = $("#movies-container");

      if (data.Response === "True") {
          data.Search.forEach(function(movie) {
              let moviePoster = $("<div></div>").addClass("movies-container");

              $("<img>").attr("src", movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/300x450').appendTo(moviePoster);
              $("<h3></h3>").text(movie.Year).appendTo(moviePoster);
              $("<h4></h4>")
              .html(`<a href="movie-details.html?title=${encodeURIComponent(movie.Title)}" target="_blank">${movie.Title.toUpperCase()}</a>`)
              .appendTo(moviePoster);
          

              movieContainer.append(moviePoster);
          });
      } else {
          movieContainer.html('<p>No se encontraron resultados.</p>');
      }

      // Añadir funcionalidad al botón de "Volver a buscar"
      $("#volver").click(function() {
          location.reload(); // Recargar la página para volver al formulario original
      });
  }
});

