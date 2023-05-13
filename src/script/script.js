authVerify()
//FUNÇÃO DE VERIFICAÇÃO DE ROTAS PARA IMPEDIR ACESSO!
function authVerify(){
    const token = localStorage.getItem("token")
    const adm = localStorage.getItem("adm")
    if(token && adm ==='true'){
        window.location.href = "./src/pages/admin/admin.html"
    }
    if(token && adm === 'false'){
        window.location.href = "./src/pages/dashboard/dashboard.html"
    }
}

//FORMA FÁCIL DE DEIXAR OS ENDPOINTS
export const endpoints = {
    categoriesReadAll: 'http://localhost:3333/categories/readAll',
    authLogin: 'http://localhost:3333/auth/login',
    employeesCreate: 'http://localhost:3333/employees/create',
    companiesReadAll: 'http://localhost:3333/companies/readAll',
    companiesReadByCategory: 'http://localhost:3333/companies/readByCategory/',    
    employeesReadAll: 'http://localhost:3333/employees/readAll',
    employeesOutOfWork: 'http://localhost:3333/employees/outOfWork',
    employeesUpdateEmployee: 'http://localhost:3333/employees/updateEmployee/{employee_id}',
    employeesDeleteEmployee: 'http://localhost:3333/employees/deleteEmployee/{employee_id}',
    employeesHireEmployee: 'http://localhost:3333/employees/hireEmployee/{employee_id}',
    employeesDismissEmployee: 'http://localhost:3333/employees/dismissEmployee/{employee_id}',
    departmentsCreate: 'http://localhost:3333/departments/create',
    departmentsReadAll: 'http://localhost:3333/departments/readAll',
    departmentsReadById: 'http://localhost:3333/departments/readById/{department_id}',
    departmentsReadByCompany: 'http://localhost:3333/departments/readByCompany/{company_id}',
    departmentsUpdate: 'http://localhost:3333/departments/update/{department_id}',
    departmentsDelete: 'http://localhost:3333/departments/delete/{department_id}',
    employeesProfile: 'http://localhost:3333/employees/profile'
}

//REQUISIÇÃO - Rota responsável por listar todos os setores cadastrados no sistema
async function getCategories(){
    const response = await fetch (endpoints.categoriesReadAll) //requisição da API que tem todas as categorias
    const data = await response.json(); 
    return await data
}
getCategories()


//REQUISIÇÃO - Rota responsável por listar todas as empresas do setor informado pela URL
async function getReadByCategory(categoryName){
    const response = await fetch (`http://localhost:3333/companies/readByCategory/${categoryName}`)
    const data = await response.json()
    return await data
}


//FUNÇÃO QUE RENDERIZA OS OPTIONS DO SELECT DOS SETORES
async function renderOptions(){
    const categories = await getCategories();
    const select = document.getElementById("select");

    categories.forEach(categorie => {
        const option = document.createElement('option')
        option.value = categorie.name
        option.textContent = categorie.name
        
        
        select.appendChild(option)
        
    })
    
    select.addEventListener('change', async (e) =>{
        const valueSelect = select.value

        if(select.value === "0"){
            getCompanies()
        } else{
            const request = await getReadByCategory(valueSelect)
            selectedCompanies(request)
        }
    })
}
renderOptions()


//RENDERIZA OS SETORES NA TELA - USANDO A GETCATEGORIES
function selectedCompanies(request){
    const data = request
    const ul = document.querySelector('.list__ul')
    ul.innerHTML = ""

    data.forEach(async companie => {
        const getAllCategories = await getCategories()
        const categoryFind = getAllCategories.find(category => category.id == companie.category_id)

        const li = document.createElement('li')
        const p = document.createElement('p')
        const btn = document.createElement('button')
        
        li.classList.add('list__li')
        p.classList.add('list__text')
        btn.classList.add('list__btn')
        
        p.textContent = companie.name
        btn.textContent = categoryFind.name

        li.appendChild(p)
        li.appendChild(btn)
        ul.appendChild(li)

})
}


//REQUISIÇÃO - Rota para listar todas as empresas cadastradas
//FUNÇÃO RENDERIZA AS EMPRESAS CADASTRADAS
async function getCompanies(){
    const companies = await fetch(endpoints.companiesReadAll)
    const data = await companies.json()
    const ul = document.querySelector('.list__ul')
    ul.innerHTML = ""
    
    data.forEach(async companie => {

        const getAllCategories = await getCategories()
        const categoryFind = getAllCategories.find(category => category.id == companie.category_id)

        const li = document.createElement('li')
        const p = document.createElement('p')
        const btn = document.createElement('button')
        
        li.classList.add('list__li')
        p.classList.add('list__text')
        btn.classList.add('list__btn')
        
        p.textContent = companie.name
        btn.textContent = categoryFind.name

        li.appendChild(p)
        li.appendChild(btn)
        ul.appendChild(li)
        
    })
}
getCompanies()
   

//FUNÇÃO PARA IR PARA A PÁGINA DE CADASTRO
function backregister(){

    const buttonRegister = document.querySelector(".header__cadastro")
    buttonRegister.addEventListener('click', async (e) => {
            e.preventDefault
            window.location.replace("./src/pages/register/register.html")
        })
    }
backregister()


//FUNÇÃO PARA IR PARA A PÁGINA DE CADASTRO
function backLogin(){
    const buttonLogin = document.querySelector(".header__login")
    buttonLogin.addEventListener('click', async (e) => {
        e.preventDefault
        window.location.replace("./src/pages/login/login.html")
    })
}
backLogin()

