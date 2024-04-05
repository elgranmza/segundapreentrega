console.log("js funcionando")
const form = document.getElementById("registerForm")


form.addEventListener("submit",e=>{
    e.preventDefault();
    const data = new FormData(form);
    console.log(data)//para ver que tiene
    const obj = {};

    data.forEach((value,key)=>obj[key]=value);

    fetch("/api/sessions/register",{
        method:"POST",
        body:JSON.stringify(obj),
        headers:{
            "Content-Type":"application/json"
        }
    }).then(result=>result.json()).then(json=>console.log(json))

})