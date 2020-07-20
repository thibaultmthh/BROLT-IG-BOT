const shell = require('electron').shell;

var last = Math.floor(Date.now() / 1000)

function get_link_new_user() {
  let select_value = document.getElementById('inputGroupSelect01').value
  if (select_value == "") {
    return
  }
  var now = Math.floor(Date.now() / 1000)
  if (now - last < 4) {
    console.log("not");
    return 0
  }
  last = now

  ipc.send("get_link_new_user", {
    appname: select_value,
    proxyhost: $("#proxyhost").val().trim(),
    proxy_username: $("#proxyauth").val().trim().split(':')[0],
    proxy_password: $("#proxyauth").val().trim().split(':')[1],
    username: $("#twitter_username").val().trim(),
    password: $("#twitter_password").val().trim()

  })
}

/*
function add_user(data) {
  console.log(data);
  if(data.errors != undefined){
    return 0
  }
  shell.openExternal(data);
}

ipc.on("link_new_user", (event, data)=>{add_user(data); })
*/




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
  get_link_new_user();
  //shell.openExternal(this.href);
})

function fill_app_option(data) {
  if (data.length < 1) {
    return 0
  }
  let main_div = document.getElementById("inputGroupSelect01")
  for (var i in data) {
    name = data[i]
    let option = document.createElement("option");
    option.textContent = name
    main_div.appendChild(option)
  }
}
ipc.send("get_all_app_name", "")
ipc.on("all_app_name", (event, data) => {
  fill_app_option(data)
})
