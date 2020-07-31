const request = require('request');


var task_cooldown = document.getElementById("exampleInputPassword1")
var acc_cooldown = document.getElementById("exampleInputPassword2")

var btn_save_settings = document.getElementById("btn_save_settings")

var btn_reset_settings = document.getElementById("btn_reset_settings")

var input_webhooks = document.getElementById("input_webhooks")

var clef_affichage = document.getElementById("clef_affichage")

var btn_test_webhooks = document.getElementById("test_webhook")

var key_x = ""








ipc.on("all_settings", (event, data) => {
  clef_affichage.textContent = data.key;
  task_cooldown.value = data.cooldown_giveaways / 1000;
  acc_cooldown.value = data.cooldown_account / 1000, key_x = data.key
  input_webhooks.value = data.webhook_url
})
ipc.send("get_settings")
var btn_delete_key = document.getElementById("btn_delete_key")
btn_delete_key.addEventListener("click", (event) => {
  event.preventDefault();
  ipc.send("set_settings", {
    'key': "key",
    "data": ""
  });
  ipc.send("get_settings")
  request.get("http://api.seigrobotics.com:5000/del_activation?key=" + key_x, (error, res, body) => {
    if (error) {
      console.error(error)
      return
    }
    console.log(`statusCode: ${res.statusCode}`)
    console
  })
})
btn_test_webhooks.addEventListener("click", (event) => {
  event.preventDefault();
  ipc.send("set_webhook", input_webhooks.value)

})

function send_settings() {
  console.log(task_cooldown.value * 1000);
  ipc.send("set_settings", {
    "key": "cooldown_giveaways",
    "data": (task_cooldown.value * 1000)
  })
  ipc.send("set_settings", {
    "key": "cooldown_account",
    "data": (acc_cooldown.value * 1000)
  })
  ipc.send("set_settings", {
    "key": "webhook_url",
    "data": input_webhooks.value
  })
  ipc.send("set_webhook", input_webhooks.value)




}

ipc.on("all_settings", function(event, data) {
  console.log(data);
})



btn_save_settings.addEventListener('click', function(event) {
  event.preventDefault();
  console.log("oooo");
  send_settings()
})

btn_reset_settings.addEventListener('click', function(event) {
  event.preventDefault();
  task_cooldown.value = 190;
  acc_cooldown.value = 50;
  input_webhooks.value = "";
  send_settings()
})




var modal = document.getElementById("modal-error")
window.onclick = function(event) {

  if (event.target == modal) {
    console.log(event.target);
    modal.style.display = "none";
  }
}





//
