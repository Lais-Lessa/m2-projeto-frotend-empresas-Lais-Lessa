
//Rota responsável por logar um usuário ao sistema
//função vai pegar os dados do input, armazenar no locarStorage, vai fazer as devidas verificações.
async function login(){
    const button = document.getElementById("login-button")
    button.addEventListener('click', async (e)=>{
        e.preventDefault()
        const email = document.getElementById("input__email").value
        const password = document.getElementById("input__password").value

        if(email === "" || password === ""){
            toast('error')
            return
        }

        const body = {
            email,
            password
        }
        const request = await fetch('http://localhost:3333/auth/login', {
        method:'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(body)
        })

        .then(res => {
            return res.json()
        })
        .then(data => {
            const token = data.authToken
            const adm = data.isAdm
            localStorage.setItem("token", token)
            localStorage.setItem("adm", adm)
            toast('success')
            if(adm){
                location.replace("../admin/admin.html") 
            } 
            if(!adm){
                location.replace("../dashboard/dashboard.html")
            } 
        })
    })
}
login()


//função para voltar para a página Home
function backHome(){
    const buttonHome = document.getElementById("button__home")
    buttonHome.addEventListener('click', async (e) => {
        e.preventDefault
        window.location.replace("../../../index.html")
    })
}
backHome()


//Função para voltar para a página de cadastro
function backregister(){

    const buttonsRegister = document.querySelectorAll(".register")
    buttonsRegister.forEach(buttons => {
        buttons.addEventListener('click', async (e) => {
            e.preventDefault
            window.location.replace("../register/register.html")
        })
    })
}
backregister()

//função que mostra a mensagem de sucesso ou erro
function toast(type){
    const toast = document.getElementById("toast--"+ type)
    toast.classList.remove('hide')
    setTimeout(() => {
        toast.classList.add('hide')
    }, 1500)
}
