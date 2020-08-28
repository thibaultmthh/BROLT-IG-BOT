const shell = require('electron').shell;

var last = Math.floor(Date.now() / 1000)

function add_account() {

  var now = Math.floor(Date.now() / 1000)
  if (now - last < 4) {
    console.log("not");
    return 0
  }
  last = now

  ipc.send("add_account", {
    proxyhost: $("#proxyhost").val().trim(),
    proxy_username: $("#proxyauth").val().trim().split(':')[0],
    proxy_password: $("#proxyauth").val().trim().split(':')[1] || "",
    username: $("#twitter_username").val().trim(),
    password: $("#twitter_password").val().trim()

  })
}



function wait(text) {
  let wait = document.getElementById("waitNotif")
  let texts = document.getElementById("waitText")
  texts.textContent = text
  wait.style.display = "flex"
}

function stopWait() {
  let wait = document.getElementById("waitNotif")
  wait.style.display = "none"
}

ipc.on("new_user_state", (event, data) => {
  let modal = document.getElementById("myModal-error");
  let error_div = document.getElementById("error")
  if (data.message ="Wait ..."){
    wait(data.message)
  }
  else{
    stopWait()
    error_div.textContent = data.message
    console.log(data.message);
    modal.style.display = "block";
  }

  if (data.type == "success") {
    $("#proxyhost").empty(),
      $("#proxyauth").empty(),
      $("#proxyauth").empty(),
      $("#twitter_username").empty(),
      $("#twitter_password").empty()

  }
})




var btn = document.getElementById("btn_new_user")
btn.addEventListener("click", function(event) {
  event.preventDefault();
  add_account();
  //shell.openExternal(this.href);
})
