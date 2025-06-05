let tasks = [highTasks = [],mediumTasks = [],lowTasks = [],finishedTasks = []]


function inputChanges(){
    const text = document.getElementById("taskName").value;
    const charCount = document.getElementById("charCount")

    if(text.length == 60){
        charCount.textContent = "60/60"
        charCount.style.color = "red"
    }
    else{
        charCount.textContent = `${text.length}/60`
        charCount.style.color = "gray"
    }
}
async function getUserData(){
    const token = localStorage.getItem("token");
    const userResponse = await fetch('https://to-do-list-6gim.onrender.com/user', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (userResponse.ok) {
    userData = await userResponse.json();
    return await userData
    
  } else {
    window.location.href ="./login.html"
    
  }
}
async function addTask(){
    const token = localStorage.getItem("token");
    const taskName = document.getElementById("taskName").value
    const priority = document.getElementById("prioritySelect").value
    const userData = await getUserData();
    console.log(priority)
    if(priority == "" && taskName.trim() == ""){
        alert("Selecione uma prioridade e nome para a task")
    }else if(priority != "" && taskName.trim() == ""){
        alert("Selecione um nome para a task")
    }else if(priority == "" && taskName.trim() != ""){ 
        alert("Selecione uma prioridade para a task")
    }else{

        
        try {
    const response = await fetch("https://to-do-list-6gim.onrender.com/taskCreation", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userId: userData.id,
            taskName: taskName,
            importance: priority
        })
        });

        if (response.ok) {
           
        } else {
            const errorMsg = await response.text();
            alert(errorMsg);
        }
            } catch (error) {
        console.error(error);
        alert("Erro ao criar a task");
}
        
    }

    
window.location.reload();


}

async function loadTasks(){
    const userData = await getUserData();
    const userId = userData.id
    const response = await fetch(`https://to-do-list-6gim.onrender.com/task?userId=${userId}`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json'
    }
    });

    if(!response.ok){
        console.error("Erro ao buscar tasks");
    return;
    }
    const userTasks = await response.json();
    console.log(userTasks);
  
    for(task of userTasks){
        if(task.state == 0){
            switch (task.importance){
                case "High":
                tasks[0].push(task)
                break
                case "Medium":
                tasks[1].push(task)
                break
                case "Low":
                tasks[2].push(task)
                break
            }
        }else{
            tasks[3].push(task)
        }
    }
    fillTasksList()
}
function fillTasksList(){
    const tasksList = document.getElementById("list")
    tasksList.innerHTML = ``
for(array of tasks){
    for(task of array){
        let novaDiv = document.createElement('div');
    
        let button
        novaDiv.className= "item"
        
        let taskColor = ""
        if(task.state == 0){
            button = `<button id="finishButton" value ="${task.id}" onclick="finishTask(value)">Concluir</button>`
            switch(task.importance){
            case "High":
            taskColor="red"
            break
            case "Medium":
            taskColor="orange"
            break
            case "Low":
            taskColor="yellow"
            break
        }
        }else{
            taskColor="green"
            button = `<button id="resumeButton" value ="${task.id}" onclick="resumeTask(value)">Continuar</button>`
        }
        
        novaDiv.style.backgroundColor= `${taskColor}`
        novaDiv.innerHTML = `
        <div class="textDiv">
                    <p>${task.taskName}</p>
                </div>
                <div class="buttonDiv">
                    ${button}
                    <button id="removeButton" value = "${task.id}" onclick ="deleteTask(value)">Remover</button>
                </div>
        `
        tasksList.appendChild(novaDiv)
        novaDiv.class= "item"
    }
}
}
async function finishTask(idTask){
    const response = await fetch(`https://to-do-list-6gim.onrender.com/task/${idTask}`,{
        method:'PATCH',
        headers: {
      'Content-Type': 'application/json'
    },
        body:JSON.stringify({
        "state": 1
      })

    })
    window.location.reload();
}
async function resumeTask(idTask){
    const response = await fetch(`https://to-do-list-6gim.onrender.com/task/${idTask}`,{
        method:'PATCH',
        headers: {
      'Content-Type': 'application/json'
    },
        body:JSON.stringify({
        "state": 0
      })

    })
    window.location.reload();
}
async function deleteTask(idTask){
    const response = await fetch(`https://to-do-list-6gim.onrender.com/task/${idTask}`,{
        method:'DELETE'
        
    })
    if(response.ok){
        
    }else{
        alert("Erro ao deletar task")
    }

    window.location.reload();
}