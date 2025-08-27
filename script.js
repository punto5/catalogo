let carrito=[], productos=[], productoSeleccionado=null;

const categoriasDiv=document.getElementById("categorias");
const carritoDiv=document.getElementById("carrito");
const enviarBtn=document.getElementById("enviarWhatsApp");
const modal=document.getElementById("modal");
const closeModal=document.querySelector(".close");
const modalNombre=document.getElementById("modal-nombre");
const modalDescripcion=document.getElementById("modal-descripcion");
const modalImages=document.getElementById("modal-images");
const modalCantidad=document.getElementById("modal-cantidad");
const modalObservaciones=document.getElementById("modal-observaciones");
const modalAgregar=document.getElementById("modal-agregar");
const whatsappFloat=document.getElementById("whatsappFloat");
const metodoPagoSelect=document.getElementById("metodoPago"); // NUEVO

// Cargar JSON
fetch("productos.json")
.then(res=>res.json())
.then(data=>{
    productos=data;
    renderProductos();
});

function renderProductos(){
    categoriasDiv.innerHTML="";
    productos.forEach(categoria=>{
        categoria.productos.forEach(prod=>{
            const card=document.createElement("div");
            card.className="producto";
            card.innerHTML=`<img src="${prod.imagenes[0]}"><div><strong>${prod.nombre}</strong><br>$${prod.precio}</div>`;
            card.onclick=()=>abrirModal(prod);
            categoriasDiv.appendChild(card);
        });
    });
}

// Modal
function abrirModal(prod){
    productoSeleccionado=prod;
    modal.style.display="block";
    modalNombre.textContent=prod.nombre;
    modalDescripcion.textContent=prod.descripcion||"";
    modalImages.innerHTML="";
    prod.imagenes.forEach(img=>{
        const i=document.createElement("img");
        i.src=img;
        modalImages.appendChild(i);
    });
    modalCantidad.value=1;
    modalObservaciones.value="";
}
closeModal.onclick=()=>{modal.style.display="none";}
window.onclick=e=>{if(e.target==modal) modal.style.display="none";}

// Agregar al carrito
modalAgregar.onclick=()=>{
    const item={
        nombre:productoSeleccionado.nombre,
        precio:productoSeleccionado.precio,
        cantidad:parseInt(modalCantidad.value),
        observacion:modalObservaciones.value
    };
    carrito.push(item);
    mostrarCarrito();
    modal.style.display="none";
}

function mostrarCarrito(){
    carritoDiv.innerHTML="";
    let total=0;
    carrito.forEach((item,i)=>{
        const div=document.createElement("div");
        div.innerHTML=`${item.nombre} x${item.cantidad} $${item.precio*item.cantidad} ${item.observacion?`(Obs: ${item.observacion})`:''}<button onclick="eliminar(${i})">Eliminar</button>`;
        carritoDiv.appendChild(div);
        total+=item.precio*item.cantidad;
    });
    const totalDiv=document.createElement("div");
    totalDiv.innerHTML=`<strong>Total: $${total}</strong>`;
    carritoDiv.appendChild(totalDiv);

    // Actualizar WhatsApp flotante
    whatsappFloat.href=generarWhatsAppUrl();
}

function eliminar(i){carrito.splice(i,1);mostrarCarrito();}

// WhatsApp
enviarBtn.onclick=()=>{window.open(generarWhatsAppUrl(),"_blank");}

function generarWhatsAppUrl(){
    if(carrito.length===0) return "#";
    let mensaje="Hola, quiero hacer un pedido:\n";
    carrito.forEach(item=>{
        mensaje+=`- ${item.nombre} x${item.cantidad} $${item.precio*item.cantidad}`;
        if(item.observacion) mensaje+=` (Obs: ${item.observacion})`;
        mensaje+="\n";
    });
    let total=carrito.reduce((acc,it)=>acc+it.precio*it.cantidad,0);

    // LEER MÉTODO DE PAGO SELECCIONADO
    const metodoPago = metodoPagoSelect?.value || "Efectivo";

    mensaje+=`Total: $${total}\nMétodo de pago: ${metodoPago}\nDirección:(ENVIAR UBICACION DE SER NECESARIO)`;
    
    return `https://wa.me/543546565940?text=${encodeURIComponent(mensaje)}`; // Reemplaza con tu número
}
