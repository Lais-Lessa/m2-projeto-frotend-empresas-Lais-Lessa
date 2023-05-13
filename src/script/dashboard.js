authVerify()

//FUNÇÃO DE VERIFICAÇÃO DE ROTAS PARA IMPEDIR ACESSO!
function authVerify(){
    const token = localStorage.getItem("token")
    const adm = localStorage.getItem("adm")
    if(!token){
        window.location.href = "../login/login.html"
    }
    if(adm === 'true'){
        window.location.href = "../admin/admin.html"
    }
}


//FUNÇÃO PARA VOLTAR PARA O LOGIN
function backLogin(){
    const buttonLogin = document.getElementById("logout")
    buttonLogin.addEventListener('click', async (e) => {
        e.preventDefault()
        localStorage.clear()
        window.location.replace("../login/login.html")
    })
}
backLogin()

renderData()


//Rota responsável para listar as informações do usuário logado

async function getProfile(){
    const token = localStorage.getItem("token")

    const response = await fetch (`http://localhost:3333/employees/profile`,{
        method:'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    const data = await response.json()
    console.log(data)
    return await data
}


//FUNÇÃO DE RENDERIZAR 
//Rota responsável por listar todos os departamentos de uma empresa, o ID da empresa deve ser informado na URL da requisição
async function renderData(){
    const userProfile = await getProfile()

    const name = userProfile.name
    const email = userProfile.email

    const divContainer = document.querySelector(".container__username")
    const h2 = document.querySelector('.username__title')
    const span = document.querySelector('.username__text')

    h2.textContent = name
    span.textContent = email

    divContainer.append(h2, span)

    if(!userProfile.department_id){
        const container = document.querySelector('.container__render--funcionarios')
        const p = document.createElement('p')
        p.textContent = 'Você ainda não foi contratado!'
        p.classList.add("text__outOfWork")
        container.appendChild(p)
        return
    }else{
        const token = localStorage.getItem("token")
        const responseDepartment = await fetch(`http://localhost:3333/departments/readById/${userProfile.department_id}`,{
                method:'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
        })
    
        const departmentInfo = await responseDepartment.json()
        console.log(departmentInfo)
        
        const divContainer = document.querySelector(".header__container")
        console.log(divContainer)
        divContainer.style.display = "block"
        const headerSpan = document.querySelector(".header__span")
        headerSpan.textContent =`${departmentInfo.company.name} - ${departmentInfo.name}`
        const contRendFuncionarios = document.querySelector(".container__render--funcionarios")
        const employees = departmentInfo.employees
        employees.forEach(employee =>{
            const renderFuncionarios = document.createElement("div")
            renderFuncionarios.classList.add("render__funcionarios")
            const nameFuncionario = document.createElement("div")
            nameFuncionario.classList.add("name__funcionario")
            const spanName = document.createElement("span")
            spanName.classList.add("text__funcionario")
            spanName.textContent = employee.name
            nameFuncionario.appendChild(spanName)
            renderFuncionarios.appendChild(nameFuncionario)        
            contRendFuncionarios.appendChild(renderFuncionarios)
        })
        
        
    }
}
