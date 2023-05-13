//BOTÃO PARA VOLTAR PARA A PÁGINA DE LOGIN
function backLogin() {
    const buttonLogin = document.getElementById("logout__adm")
    buttonLogin.addEventListener('click', async (e) => {
        e.preventDefault()
        localStorage.clear()
        window.location.replace("../login/login.html")
    })
}
backLogin()
authVerify()

////FUNÇÃO DE VERIFICAÇÃO DE ROTAS PARA IMPEDIR ACESSO!
function authVerify() {
    const token = localStorage.getItem("token")
    const adm = localStorage.getItem("adm")
    if (!token) {
        window.location.href = "../login/login.html"
    }
    if (adm === 'false') {
        window.location.href = "../dashboard/dashboard.html"
    }
}


//REQUISIÇÕES - 


//Rota para listar todas as empresas cadastradas - SEM AUTORIZAÇÃO
async function getCompanie() {
    const response = await fetch(`http://localhost:3333/companies/readAll`, {
        method: 'GET',
    })
    const data = await response.json()
    return await data
}
getCompanie()

//Rota responsável por listar todos os departamentos cadastrados - COM AUTORIZAÇÃO
async function getReadDepartaments() {
    const token = localStorage.getItem("token")
    const response = await fetch(`http://localhost:3333/departments/readAll`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const data = await response.json()
    return await data
}
options()

//Rota responsável por listar todos os funcionários que ainda não foram contratados para nenhum departamento 
// COM AUTORIZAÇÃO
async function outOfWork() {
    const token = localStorage.getItem("token")
    const response = await fetch(`http://localhost:3333/employees/outOfWork`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const data = await response.json()
    return await data
}
outOfWork()

//Rota responsável por listar todos os funcionários cadastrados
//COM AUTORIZAÇÃO
async function employeesRegister() {
    const token = localStorage.getItem("token")
    const response = await fetch(`http://localhost:3333/employees/readAll`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const data = await response.json()
    return await data
}
employeesRegister()

//Rota responsável por listar um departamento a partir do id informado
//COM AUTORIZAÇÃO
async function departmentsById(userId) {
    const token = localStorage.getItem("token")
    const response = await fetch(`http://localhost:3333/departments/readById/${userId}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    const data = await response.json()
    return await data
}

//Rota responsável por listar todos os departamentos de uma empresa, 
//o ID da empresa deve ser informado na URL da requisição
//COM AUTORIZAÇÃO
async function readByCompany(id) {
    const token = localStorage.getItem("token")
    const response = await fetch(`http://localhost:3333/departments/readByCompany/${id}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    const data = await response.json()
    return await data
}


//FUNÇÃO PASSANDO O ID DO DEPARTAMENTO
//PEGANDO O BOTÃO DE SALVAR DO MODAL EDITAR DEPARTAMENTO, FAZ A REQUISIÇÃO PATCH 
//ATUALIZA A DESCRIÇÃO NA API, E FECHA MODAL

//Rota responsável por atualizar a descrição de um departamento
async function departamentUpdate(idDoDepartamento) {
    const button = document.querySelector(".btn__edit")

    button.addEventListener('click', async () => {
        const textArea = document.getElementById('edit').value
        const body = {
            description: textArea
        }
        const token = localStorage.getItem("token")
        const response = await fetch(`http://localhost:3333/departments/update/${idDoDepartamento}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        const data = await response.json()
        const dialog = document.getElementById("edit__departament")
        dialog.close()
        location.reload()
        return await data
    })

}


//Rota responsável por atualizar as informações de um funcionário - PASSANDO ID COMO PARÂMETRO
//FUNÇÃO FAZ UM PATCH NA API COM A INFORMAÇÃO PASSADA NO INPUT
async function usuarioUpdate(idDoUser) {
    const button = document.querySelector(".btn__edit--usuario")

    button.addEventListener('click', async () => {
        const inputName = document.querySelector('.edit__usuario--name').value
        const inputEmail = document.querySelector('.edit__usuario--email').value
        const body = {
            name: inputName,
            email: inputEmail
        }
        const token = localStorage.getItem("token")
        const response = await fetch(`http://localhost:3333/employees/updateEmployee/${idDoUser}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-type': 'application/json'
            },
            body: JSON.stringify(body)
        })

        const data = await response.json()
        const dialog = document.querySelector(".edit__usuario")
        dialog.close()
        location.reload()
        return await data
    })

}


//FUNÇÃO NO BOTÃO CRIAR DEPARTAMENTO QUE RECEBE OS VALORES DO INPUT E SALVA NO LOCALSTORAGE
//USANDO O POST - COM AUTORIZAÇÃO
//Rota responsável por cadastrar um novo departamento
function creatDepartment(companyId) {
    const button = document.querySelector(".btn__departament")
    const company_id = companyId
    button.addEventListener('click', async (e) => {
        e.preventDefault()
        const name = document.querySelector(".departamento__name").value
        const description = document.querySelector(".departamento__description").value

        const body = {
            name,
            description,
            company_id
        }

        const token = localStorage.getItem("token")
        await fetch('http://localhost:3333/departments/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(body)
        })

            .then(res => {
                return res.json()
            })
            .then(async data => {
                const dialog = document.getElementById("department")
                dialog.close()
                toast('success')
                setTimeout(() => {

                    window.location.reload()
                }, 1500)
            })
    })
}


//FUNÇÃO QUE USA A GETCOMPANIE PARA TRAZER A REQUISIÇÃO
//ESTA RENDERIZANDO OS DEPARTAMENTOS NO BOTÃO SELECT NO MODAL CRIAR
//DENTRO TEM A FUNÇÃO CREATEDEPARTMENT QUE RECEBE O ID DO VALOR DO OPTION CLICADO
async function selectCompanies() {
    const companies = await getCompanie();
    const select = document.querySelector(".select__departament");

    companies.forEach(company => {
        const option = document.createElement('option')
        option.value = company.id
        option.textContent = company.name
        select.appendChild(option)
    })
    select.addEventListener('change', async (e) => {
        const valueSelect = await select.value
        creatDepartment(valueSelect)
    })
}
selectCompanies()


//FUNÇÃO RENDERIZA OS DEPARTAMENTOS CRIADOS 
//FAZ PELO JS TODO O HTML DO DEPARTAMENTO, INCLUIDO OS BOTÕES DE CLIQUE
//RECEBE O ID DOS DEPARTAMENTOS PELA FUNÇÃO DELETEDEPARTAMENTO
async function renderElement(department) {

    const ul = document.querySelector('.container__departamento')
    ul.innerHTML = "";


    const liElement = document.createElement('li');
    liElement.className = 'departamento__left';

    const divElement = document.createElement('div');
    divElement.className = 'container__text';

    const spanTitleElement = document.createElement('span');
    spanTitleElement.className = 'title__departament';
    spanTitleElement.textContent = department.name;

    const spanDescElement = document.createElement('span');
    spanDescElement.className = 'text__departamento';
    spanDescElement.textContent = department.description;

    const spanCompanyElement = document.createElement('span');
    spanCompanyElement.className = 'text__departamento';
    spanCompanyElement.textContent = ""

    divElement.appendChild(spanTitleElement);
    divElement.appendChild(spanDescElement);
    divElement.appendChild(spanCompanyElement);

    const iconsDivElement = document.createElement('div');
    iconsDivElement.className = 'icons';

    const imgEyeElement = document.createElement('img');
    imgEyeElement.className = 'img__icon--eye';
    imgEyeElement.id = 'eye';
    imgEyeElement.src = '../../assets/images/olho.png';


    imgEyeElement.addEventListener("click", openModalEye)  //EVENTO DE CLICK NOS ICONS CRIADOS PARA ABRIR MODAL

    const imgPencilElement = document.createElement('img');
    imgPencilElement.className = 'img__icon--pencil';
    imgPencilElement.id = 'pencil';
    imgPencilElement.src = '../../assets/images/lapis.png';
    imgPencilElement.addEventListener("click", openModalDepartment)  //EVENTO DE CLICK NOS ICONS CRIADOS PARA ABRIR MODAL

    const imgTrashElement = document.createElement('img');
    imgTrashElement.className = 'img__icon--trash';
    imgTrashElement.id = 'trash';
    imgTrashElement.src = '../../assets/images/lixeira.jpg';
    imgTrashElement.addEventListener("click", async () => { // //EVENTO DE CLICK NOS ICONS CRIADOS PARA ABRIR MODAL

        openDelete();
        await deleteDepartament(department.id);

    })

    iconsDivElement.appendChild(imgEyeElement);
    iconsDivElement.appendChild(imgPencilElement);
    iconsDivElement.appendChild(imgTrashElement);


    liElement.appendChild(divElement);
    liElement.appendChild(iconsDivElement);

    ul.appendChild(liElement)

}


//FUNÇÃO CRIADA PARA FAZER UM DELETE NA API - COM AUTORIZAÇÃO
//Rota responsável por deletar um departamento
async function deleteDepartament(id) {
    const buttonDelete = document.querySelector('.btn__delete')
    buttonDelete.addEventListener('click', async () => {
        const token = localStorage.getItem("token")
        const response = await fetch(`http://localhost:3333/departments/delete/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const data = await response.json()
        const dialog = document.querySelector(".delete")
        dialog.close()
        toast('success')
        setTimeout(() => {
            window.location.reload()
        }, 1500)

    }
    )
}


//FUNÇÃO PARA FUNCIONÁRIOSQUE AINDA NÃO FORAM CONTRATADOS
//CHAMA A FUNÇÃO QUE FAZ A REQUISIÇÃO
async function optionsOutOfWork() {
    const getOutOfwork = await outOfWork();
    const select = document.querySelector(".select__dialog");
    select.innerHTML = ""

    getOutOfwork.forEach(employee => {
        const option = document.createElement('option')
        option.value = employee.id
        option.textContent = employee.name
        select.appendChild(option)
    })
}
optionsOutOfWork()


//FUNÇÃO SELECIONA SELECT E RENDERIZA OPTIONS - 
//Rota responsável por listar todos os departamentos de uma empresa, o ID da empresa deve ser informado na URL da requisição
async function options() {
    const companies = await getCompanie();
    const select = document.getElementById("empresas");

    companies.forEach(company => {
        const option = document.createElement('option')
        option.value = company.id
        option.textContent = company.name
        select.appendChild(option)
    })

    select.addEventListener('change', async (e) => {
        const valueSelect = select.value
        if (select.value === "0") {
            renderDepartaments()
        } else {
            const token = localStorage.getItem("token")
            const request = await fetch(`http://localhost:3333/departments/readByCompany/${valueSelect}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const data = await request.json()

            renderDepartaments(data)
        }
    })
}


//FUNÇÃO PARA CONTRATAR FUNCIONÁRIO PARA UM DEPARTAMENTO
//Rota responsável por contratar um funcionário para um departamento
async function hireEmployee(departmentId, companyName) {
    const buttonContratar = document.querySelector('.btn__select')
    await renderEmployeesRegistered(departmentId, companyName)
    buttonContratar.addEventListener('click', async () => {
        const valueSelect = document.querySelector('.select__dialog').value
        const body = {
            department_id: departmentId
        }
        if (valueSelect === "Não há mais funcionários disponíves") {
            return
        }
        const token = localStorage.getItem("token")
        const response = await fetch(`http://localhost:3333/employees/hireEmployee/${valueSelect}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-type': 'application/json'
            },
            body: JSON.stringify(body)
        })

        if (response.ok) {
            const select = document.querySelector('.select__dialog')
            const option = select.querySelector(`[value = "${valueSelect}"]`)
            option.remove()
            await renderEmployeesRegistered(departmentId, companyName)
            if (select.options.length === 0) {
                const optionEmpty = document.createElement("option")
                optionEmpty.textContent = "Não há mais funcionários disponíves"
                optionEmpty.selected = true
                optionEmpty.disabled = true
                select.appendChild(optionEmpty)
            }
            const data = await response.json()
            const dialog = document.getElementById("edit__departament")
        }
    })
}


//FUNÇÃO RENDERIZA - USANDO ID DO DEPARTAMENTO
async function renderEmployeesRegistered(departmentId, companyName) {

    const department = await departmentsById(departmentId)
    const divContainer = document.querySelector('.dialog__render--usuarios')
    divContainer.innerHTML = ""

    const employees = department.employees
    employees.forEach(employee => {
    const div = document.createElement('div')
    div.classList.add('container__usuarios')
    const h3 = document.createElement('h3')
    h3.classList.add('title__usuario')
    h3.textContent = employee.name
    const span = document.createElement('span')
    span.classList.add('span__usuario')
    span.textContent = companyName
    const button = document.createElement('button')
    button.classList.add('button__desligar')
    button.textContent = "Desligar"
    button.addEventListener("click", async () => {
        dismissEmployee(employee.id, departmentId, companyName)
    })

    div.appendChild(h3)
    div.appendChild(span)
    div.appendChild(button)
    divContainer.appendChild(div)
    })
}


//Rota responsável por demitir um funcionário de um departamento
//FUNÇÃO PARA DEMITIR UM FUNCIONÁRIO 
async function dismissEmployee(employeeId, departmentId, companyName) {


    const token = localStorage.getItem("token")

    fetch(`http://localhost:3333/employees/dismissEmployee/${employeeId}`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(async data => {
            await renderEmployeesRegistered(departmentId, companyName)
            await optionsOutOfWork()
        })


}


//FUNÇÃO QUE VAI RENDERIZAR TODOS OS DEPARTAMENTOS
//COM O CLICK NAS IMAGENS VAI ABRIR OU FECHAR OS MODAIS
async function renderDepartaments(selectedDepartaments) {

    let departaments = null
    if (selectedDepartaments === undefined) {
        departaments = await getReadDepartaments();
    } else {
        departaments = selectedDepartaments
    }

    const token = localStorage.getItem("token")
    const ul = document.querySelector('.container__departamento')
    ul.innerHTML = ""

    departaments.forEach(async department => {

        const request = await fetch(`http://localhost:3333/companies/readById/${department.company_id}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const data = await request.json()

        const liElement = document.createElement('li');
        liElement.className = 'departamento__left';

        const divElement = document.createElement('div');
        divElement.className = 'container__text';

        const spanTitleElement = document.createElement('span');
        spanTitleElement.className = 'title__departament';
        spanTitleElement.textContent = department.name;

        const spanDescElement = document.createElement('span');
        spanDescElement.className = 'text__departamento';
        spanDescElement.textContent = department.description;

        const spanCompanyElement = document.createElement('span');
        spanCompanyElement.className = 'text__departamento';
        spanCompanyElement.textContent = data.name;

        divElement.appendChild(spanTitleElement);
        divElement.appendChild(spanDescElement);
        divElement.appendChild(spanCompanyElement);

        const iconsDivElement = document.createElement('div');
        iconsDivElement.className = 'icons';

        const imgEyeElement = document.createElement('img');
        imgEyeElement.className = 'img__icon--eye';
        imgEyeElement.id = 'eye';
        imgEyeElement.src = '../../assets/images/olho.png';

        imgEyeElement.addEventListener("click", async () => {
            openModalEye()
            hireEmployee(department.id, data.name)
        })


        const imgPencilElement = document.createElement('img');
        imgPencilElement.className = 'img__icon--pencil';
        imgPencilElement.id = 'pencil';
        imgPencilElement.src = '../../assets/images/lapis.png';

        imgPencilElement.addEventListener("click", async () => {

            openModalDepartment()
            departamentUpdate(department.id)
            await editDepartament(department.description)
        })

        const imgTrashElement = document.createElement('img');
        imgTrashElement.className = 'img__icon--trash';
        imgTrashElement.id = 'trash';
        imgTrashElement.src = '../../assets/images/lixeira.jpg';

        imgTrashElement.addEventListener("click", async () => {

            openDelete();
            await deleteDepartament(department.id);

        })

        iconsDivElement.appendChild(imgEyeElement);
        iconsDivElement.appendChild(imgPencilElement);
        iconsDivElement.appendChild(imgTrashElement);


        liElement.appendChild(divElement);
        liElement.appendChild(iconsDivElement);

        ul.appendChild(liElement)


    })


}
renderDepartaments()


//FUNÇÃO QUE EDITA O VALOR DO TEXTAREA
async function editDepartament(departamentDescription) {
    const textArea = document.querySelector('.textarea__edit--departamet')
    textArea.value = departamentDescription
}


//FUNÇÃO QUE RENDERIZA OS USUÁRIOS
//ABRE OU FECHA MODAL

async function renderUsuarios() {
    const employees = await employeesRegister()
    const div = document.querySelector('.usuarios__cadastrados')

    employees.forEach(async employee => {

        const divContainerStyle = document.createElement('div')
        divContainerStyle.classList.add('container__left--usuarios')
        const divContainer = document.createElement('div')
        divContainer.classList.add('container__cadastrados')
        const span = document.createElement('span')
        span.classList.add('title__departament')
        span.textContent = employee.name
        const companySpan = document.createElement('span')
        companySpan.classList.add('text__departamento')

        if (!employee.company_id) {
            companySpan.textContent = ""
        } else {
            companySpan.textContent = employee.company_id
        }

        divContainer.appendChild(span)
        divContainer.appendChild(companySpan)
        divContainerStyle.appendChild(divContainer)


        const divIcons = document.createElement('div')
        divIcons.classList.add('icons')
        const imgPencil = document.createElement('img')
        imgPencil.classList.add('img__icon--lapis')
        imgPencil.src = '../../assets/images/lapis.png';

        imgPencil.addEventListener("click", async () => {

            await usuarioUpdate(employee.id)
            openDialogUser()

        })

        const imgLixeira = document.createElement('img')
        imgLixeira.classList.add('img__icon--lixeira')
        imgLixeira.src = '../../assets/images/lixeira.jpg';

        imgLixeira.addEventListener("click", async () => {

            openDelete()
            await deleteUsuario(employee.id)
        })

        divIcons.appendChild(imgPencil)
        divIcons.appendChild(imgLixeira)

        divContainerStyle.appendChild(divIcons)
        div.appendChild(divContainerStyle)

    })
}
renderUsuarios()


//FUNÇÃO QUE FAZ O SELECT DO MODAL
async function selectModal() {
    const companies = await getCompanie();
    const select = document.querySelector(".select__departament");

    companies.forEach(company => {
        const option = document.createElement('option')
        option.value = company.id
        option.textContent = company.name

        select.appendChild(option)

    })

}
selectModal()


//FUNÇÃO QUE VAI DELETAR O USUÁRIO PELO ID
async function deleteUsuario(id) {
    const buttonDelete = document.querySelector('.btn__delete')
    buttonDelete.addEventListener('click', async () => {
        const token = localStorage.getItem("token")
        const response = await fetch(`http://localhost:3333/employees/deleteEmployee/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const data = await response.json()
        const dialog = document.querySelector(".delete")
        dialog.close()
        window.location.reload()
    }
    )
}




//ABRIR E FECHAR DIALOG
function openDialogUser() {
    const dialog = document.querySelector(".edit__usuario")
    dialog.showModal()
}

function closeDialogUser() {
    const dialog = document.querySelector(".edit__usuario")
    const closeButton = document.getElementById("close--delete")
    closeButton.addEventListener("click", () => {
        dialog.close()
    })
}
closeDialogUser()

function openDialogLixeira() {
    const dialog = document.querySelector(".delete__usuario")

    dialog.showModal()
}

function closeDialogLixeira() {
    const dialog = document.querySelector(".delete__usuario")
    const closeButton = document.querySelector(".close__delete--usuario")
    closeButton.addEventListener("click", () => {
        dialog.close()
    })
}
closeDialogLixeira()

function openModalEye() {
    const dialog = document.querySelector(".dialog")
    dialog.showModal()
}

function closeModalEye() {
    const dialog = document.querySelector(".dialog")
    const closeButton = document.querySelector(".close")
    closeButton.addEventListener("click", () => {
        dialog.close()
    })
}
closeModalEye()


function openModalDepartment() {
    const dialog = document.getElementById("edit__departament")
    dialog.showModal()
}

function closeDepartment() {
    const dialog = document.getElementById("edit__departament")
    const closeButton = document.querySelector(".department__close")

    closeButton.addEventListener("click", () => {
        dialog.close()
    })
}
closeDepartment()


function openCreate() {
    const dialog = document.getElementById("department")
    const buttonCreate = document.getElementById("button--criar")

    buttonCreate.addEventListener("click", () => {
        dialog.showModal()
    })
}
openCreate()

function closeCreat() {
    const dialog = document.getElementById("department")
    const closeButton = document.getElementById("close__departmet--dialog")
    closeButton.addEventListener("click", () => {
        dialog.close()
    })
}
closeCreat()

function openDelete() {
    const dialog = document.querySelector(".delete")

    dialog.showModal()
}

function closeDelete() {
    const dialog = document.querySelector(".delete")
    const closeButton = document.querySelector(".modal__close--delete")
    closeButton.addEventListener("click", () => {
        dialog.close()
    })
}
closeDelete()



//função que mostra a mensagem de sucesso ou erro
function toast(type) {
    const toast = document.getElementById("toast--" + type)
    toast.classList.remove('hide')
    setTimeout(() => {
        toast.classList.add('hide')
    }, 1500)
}





