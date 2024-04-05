//iniciarmos el socket

const socket = io();

const element = document.getElementById("myBtn");
element.addEventListener("click", ()=>{
    socket.emit("message",{
        title:document.getElementById("newProduct").value,
        price:document.getElementById("price").value
    })
    
});


socket.on("listarProductos",data=>{
    let log = document.getElementById("allproducts");
    let messages="";
    data.forEach(e => {
        messages = messages + `<li>${e.title}: ${e.price}</li>`
    });
    log.innerHTML = messages;
})