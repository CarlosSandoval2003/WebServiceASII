document.getElementById('productForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;
    const precio = parseFloat(document.getElementById('precio').value);

    fetch('http://localhost:3000/productos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, descripcion, precio }),
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('responseMessage').textContent = `Producto "${data.nombre}" agregado exitosamente.`;
        document.getElementById('productForm').reset();
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('responseMessage').textContent = 'Error al agregar el producto.';
    });
});
