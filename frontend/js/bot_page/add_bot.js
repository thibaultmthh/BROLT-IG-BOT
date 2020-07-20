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
    proxy_password: $("#proxyauth").val().trim().split(':')[1],
    username: $("#twitter_username").val().trim(),
    password: $("#twitter_password").val().trim()

  })
}





ipc.on("new_user_state", (event, data) => {
  document.getElementById("erreurs").textContent = data.message
  if (data.type== "success" ){
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
