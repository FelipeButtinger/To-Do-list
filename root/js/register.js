let contador = 0
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