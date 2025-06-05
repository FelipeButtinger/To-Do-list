function passwordStandards() {
    let password = document.getElementById("password").value;
    let username = document.getElementById("username").value;
    let hasNumber = /[0-9]/.test(password);//teste diretament com regex para conferir se a senha atende aos requisitos.
    let hasLower = /[a-z]/.test(password);
    let hasUpper = /[A-Z]/.test(password);

    if (!hasNumber) {
        document.getElementById("numberRequirement").style.color = "red"
    }else if(hasNumber){
        document.getElementById("numberRequirement").style.color = "green"
    }
    if (!hasLower || !hasUpper) {
                document.getElementById("letterRequirement").style.color = "red"

    }else if(hasLower || hasUpper){
        document.getElementById("letterRequirement").style.color = "green"

    }

    if(hasLower && hasNumber && hasUpper && username !=""){
        document.getElementById("registerButton").disabled = false
    }else{
        document.getElementById("registerButton").disabled = true
    }
   
}
async function register(){
    const token = localStorage.getItem("token");
    const name = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    console.log(name,password)

    
      try {
        const response = await fetch("https://to-do-list-6gim.onrender.com/register", {
          method: "POST",
          headers: { 
            'Content-Type': 'application/json', 
            Authorization: `Bearer ${token}` },
          body: JSON.stringify({
                name: name,
                password: password
            })
        });
  
        if (response.ok) {
          alert("Usuário Registrado com sucesso")

            const response = await fetch('https://to-do-list-6gim.onrender.com/login', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json' 
                },
                
                body: JSON.stringify({ name, password })
            });
            if (response.ok) {
                
                const data = await response.json();
                
                localStorage.setItem('token', data.token); 
                
                window.location.href = '/html/home.html'; 
            } else {
              
            }
        } else {
          alert(await response.text())
        }
      } catch (error) {
        alert("Erro ao processar a requisição.")
        console.error(error);
      }
}