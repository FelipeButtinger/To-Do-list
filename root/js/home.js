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