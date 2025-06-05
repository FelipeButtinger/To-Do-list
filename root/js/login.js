async function login(){
    const token = localStorage.getItem("token");
    let name = document.getElementById("username").value;
    let password = document.getElementById("password").value;

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
                
                window.location.href = 'home.html'; 
            } else {
              alert(await response.text())
            }
}