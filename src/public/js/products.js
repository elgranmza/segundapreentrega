let carritoId;

const crearCarrito = () => {
    const endpoint = `http://localhost:8080/api/carts`;

    fetch(endpoint, {
        method: "POST"
    })
    .then((resp) => resp.json())
    .then((data) => {
        carritoId = data.message._id; // Almacenar el ID del carrito
        console.log("Estamos dentro de crear carrito: ", carritoId);

        
        const botonesCard = document.getElementsByName("btn");
        for (let boton of botonesCard) {
            boton.addEventListener('click', (e) => {
                agregarCarrito(carritoId, e.target.id);
            });
        }
    });
}

const agregarCarrito = (cid, pid) => {
    const endpoint = `http://localhost:8080/api/carts/${cid}/product/${pid}`;
    const data = {};

    fetch(endpoint, {
        method: "POST"
    })
    .then((resp) => {
        console.log(resp);
    });
}

// Llamar a la función para crear el carrito una vez al cargar la página
crearCarrito();
