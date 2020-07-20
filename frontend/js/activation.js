const ipc = require('electron').ipcRenderer;


function send_data() {
  let data = document.getElementById('activation_input').value
  console.log(data);
  console.log((ipc.send("check_key", data)))


}

ipc.on("back_check_key", function(event, data) {console.log(data);let erreur_text = document.getElementById('erreurs');erreur_text.innerHTML = data})

var btn_valider_key = document.getElementById("btn_valider_key")
btn_valider_key.addEventListener("click", send_data)



//
