
//função de resgistro - DE FUNCIONÁRIO
//FAZ UM POST NA API GUARDANDO NOME/EMAIL/PASSWORD
//Rota responsável pela criação de um funcionário

async function register(){
    const requestHeaders = {
        'Content-Type': 'application/json'
    }
    const button = document.getElementById('cadastrar')

    button.addEventListener('click', async (e) => {

        e.preventDefault();

        const inputName = document.getElementById("name").value
        const inputEmail = document.getElementById("input__email").value
        const inputPassword = document.getElementById("input__password").value

        if(inputName === "" || inputEmail === "" || inputPassword === ""){
            toast('error')
            return
        }

        const body = {
            name: inputName,
            email: inputEmail,
            password:inputPassword
        }

        await fetch(`http://localhost:3333/employees/create`, {
            method:'POST',
            headers: requestHeaders,
            body: JSON.stringify(body)
        })

        .then( async (res) => {
            if(res.ok){
                const response = await res.json()
                toast('success')
                setTimeout(() =>{
                    window.location.replace("../login/login.html")
                }, 1500)
            } else{
                const responseError = await res.json()
             
            } 
        })
    })
}
register()

//FUNÇÃO DE VOLTAR PARA HOMEPAGE
function backHome(){

    const buttonsHome = document.querySelectorAll(".home__back")
    buttonsHome.forEach(buttons => {
        buttons.addEventListener('click', async (e) => {
            e.preventDefault
            window.location.replace("../../../index.html")
        })
    })
}
backHome()

//FUNÇÃO DE VOLTAR PARA LOGIN
function backLogin(){
    const buttonLogin = document.getElementById("back__login")
    buttonLogin.addEventListener('click', async (e) => {
        e.preventDefault
        window.location.replace("../login/login.html")
    })
}
backLogin()

//FUNÇÃO PARA APARECER MENSAGEM DE ERRO OU SUCESSO
function toast(type){
    const toast = document.getElementById("toast--"+ type)
    toast.classList.remove('hide')
    setTimeout(() => {
        toast.classList.add('hide')
    }, 1500)
}

