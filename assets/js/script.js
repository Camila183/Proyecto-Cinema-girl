function generateUrl() {
  let id = Math.floor(Math.random() * 9000000) + 1000000;
  return `https://www.omdbapi.com/?i=tt${id}&apikey=906b5c9d&type=movie`;
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


$(document).ready(function () {
  const apikey = "906b5c9d";
  let peliculasOriginales = []; // Para almacenar las películas obtenidas

  $("#search-form").submit(function (e) {
    e.preventDefault(); // Evitar que la página se recargue
    let nombrePelicula = $("#search-input").val().toLowerCase();
    buscarPeliculasPorCategoria(nombrePelicula);
  });

  function buscarPeliculasPorCategoria(categoria) {
    $("#titulo-categoria").text(`Películas de ${categoria.replace("+", " ")}`);
    const query = encodeURIComponent(categoria);
    const apiUrl = `https://www.omdbapi.com/?apikey=${apikey}&s=${query}`;

    $.ajax({
      type: "GET",
      url: apiUrl,
      dataType: "json",
      success: function (data) {
        if (data.Search) {
          peliculasOriginales = data.Search; // Almacena las películas
          mostrarPeliculas(peliculasOriginales); // Muestra las películas
        } else {
          $("#movies-container").html("<p>No se encontraron resultados.</p>");
        }
      },
      error: function () {
        alert("Error al buscar la película.");
      },
    });
  }

  function mostrarPeliculas(peliculas) {
    const moviesContainer = $("#movies-container");
    moviesContainer.empty();

    peliculas.forEach(function (pelicula) {
      const poster =
        pelicula.Poster !== "N/A"
          ? pelicula.Poster
          : "https://via.placeholder.com/300x450";
      const movieTitle = pelicula.Title;
      const movieYear = pelicula.Year;

      const movieDiv = `
                <div class="movie">
                    <img src="${poster}" alt="${movieTitle}">
                    <div class="movie-title">
                        <a href="movie-details.html?title=${encodeURIComponent(
                          movieTitle
                        )}" target="_blank">${movieTitle} (${movieYear})</a>
                    </div>
                </div>
            `;
      moviesContainer.append(movieDiv);
    });
  }

  // Aplicar los filtros al hacer clic en "Aplicar Filtros"
  $("#aplicarFiltros").click(function () {
    let peliculasFiltradas = [...peliculasOriginales]; // Crea una copia de las películas originales

    const filtroAnio = $("#filtroAnio").val(); // Año ingresado para filtrar
    const ordenSeleccionado = $("#ordenar").val(); // Orden seleccionado

    // Filtrar por año si se ingresó un valor
    if (filtroAnio) {
      peliculasFiltradas = peliculasFiltradas.filter(
        (pelicula) => parseInt(pelicula.Year) > parseInt(filtroAnio)
      );
    }

    // Ordenar según la opción seleccionada
    switch (ordenSeleccionado) {
      case "titulo":
        peliculasFiltradas.sort((a, b) => a.Title.localeCompare(b.Title)); // Ordenar A-Z
        break;
      case "titulo-desc":
        peliculasFiltradas.sort((a, b) => b.Title.localeCompare(a.Title)); // Ordenar Z-A
        break;
      case "anio-asc":
        peliculasFiltradas.sort((a, b) => parseInt(a.Year) - parseInt(b.Year)); // Año Ascendente
        break;
      case "anio-desc":
        peliculasFiltradas.sort((a, b) => parseInt(b.Year) - parseInt(a.Year)); // Año Descendente
        break;
    }

    // Mostrar las películas filtradas y ordenadas
    mostrarPeliculas(peliculasFiltradas);
  });
});

