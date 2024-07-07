// Obtiene los datos del servidor y los inserta en el contenedor de productos

// Este bloque de código se ejecuta cuando el contenido de la página se ha cargado completamente. 
// Hace dos solicitudes al servidor para obtener los datos de los productos dinámicos y los productos totales.
//  Utiliza el método fetch para realizar las solicitudes y utiliza await para esperar las respuestas. 
//  Los datos se almacenan en las variables productos y productlistTotales.
window.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/catalogo/api/productosDinamicos');
    const productos = await response.json();

    const proContainer = document.getElementById('pro-container3');
    let productosHTML = '';

    const filtrarProductosPorCategoria = (categoria) => {
      if (categoria === 'Todos') {
        return productos;
      } else {
        return productos.filter(producto => producto.categoria === categoria);
      }
    };

    const mostrarProductos = (categoria) => {
      const productosFiltrados = filtrarProductosPorCategoria(categoria);
      productosHTML = '';

      productosFiltrados.forEach(producto => {
        productosHTML += `
          <div class="pro" onclick="redirectToSProductos('${producto.id_producto}', '${producto.imagen}',  '${producto.descripcion}', '${producto.producto}', '${producto.precio}')">
            <img src="${producto.imagen}" alt="">
            <div class="des">
              <span>${producto.descripcion}</span>
              <h5>${producto.producto}</h5>
              <h4>${producto.precio}</h4>
            </div>
          </div>
        `;
      });

      proContainer.innerHTML = productosHTML;
    };


    mostrarProductos('Todos');
  } catch (error) {
    console.error('Error al obtener los productos:', error);
  }
});

function redirectToSProductos(id_producto, imagen, descripcion, producto, precio) {

  // Crea una instancia de URLSearchParams para construir los parámetros de consulta
  const queryParams = new URLSearchParams();

  // Agrega cada parámetro de consulta con su respectivo valor
  queryParams.append('id_producto', id_producto);
  queryParams.append('imagen', imagen);
  queryParams.append('descripcion', descripcion);
  queryParams.append('producto', producto);
  queryParams.append('precio', precio);

  // Convierte los parámetros de consulta en una cadena de consulta
  const queryString = queryParams.toString();

  // Redirige a la página 'sproductos' con la cadena de consulta como parte de la URL
  window.location.href = `sproductos?${queryString}`;
}
