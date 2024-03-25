//iniciarmos el socket

const socket = io();
let user;
let chatbox = document.getElementById("chatbox")

Swal.fire({
    title: "Identificate con tu mail",
    input: "email",
    inputLabel: "Your email address",
    inputPlaceholder: "Enter your email address",
    allowOutsideClick: false
}).then(result => {
    user = result.value;
    //console.log("2- El usuario es: ",user)
});

chatbox.addEventListener("keyup", (evt) => {
    if (evt.key === "Enter") {
        console.log("Se precionó enter")
        if (chatbox.value.trim().length > 0) {
            socket.emit("message", { user, message: chatbox.value });
            chatbox.value = "";
        }
    }

});



socket.on("messageLogs", data => {
    let log = document.getElementById("mensajes");
    let messages = "";
    data.forEach(e => {
        messages = messages + `<li>${e.user}: ${e.message}</li>`
    });
    log.innerHTML = messages;
})