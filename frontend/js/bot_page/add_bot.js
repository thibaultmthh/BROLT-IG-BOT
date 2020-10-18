const shell = require('electron').shell;

var last = 0
console.log(last);

function add_account() {
  console.log(last);
  var now = Math.floor(Date.now() / 1000)
  if (now - last < 20) {
    let modal = document.getElementById("myModal-error");
    let error_div = document.getElementById("error")
    error_div.textContent = "Please wait 20 seconds"
    modal.style.display = "block";
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

//Marius
function add_multiple_accounts() {
  //  console.log(last);
  //  var now = Math.floor(Date.now() / 1000)
  //  if (now - last < 20) {
  //    let modal = document.getElementById("myModal-error");
  //    let error_div = document.getElementById("error")
  //    error_div.textContent = "Please wait 20 seconds"
  //    modal.style.display = "block";
  //    console.log("not");
  //    return 0
  //  }
  //  last = now

  ipc.send("add_multiple_accounts", csv_file.files[0].path)
}

//


function wait(text) {
  let wait = document.getElementById("waitNotif")
  let texts = document.getElementById("waitText")
  texts.textContent = text
  wait.style.display = "flex"
}

function done(text) {
  let wait = document.getElementById("doneNotif")
  wait.style.display = "flex"
  setTimeout(function() {
    wait.style.display = "none";
  }, 3000);
}

function stopWait() {
  let wait = document.getElementById("waitNotif")
  wait.style.display = "none"
}

ipc.on("new_user_state", (event, data) => {
  let modal = document.getElementById("myModal-error");
  let error_div = document.getElementById("error")
  if (data.message == "Wait ...") {
    wait(data.message)
  } else if (data.message == "successfully added") {
    done("a")
    stopWait()
  } else {
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

var csv_file = document.getElementById("acc_csv")
var btn2 = document.getElementById("csv_button")
btn2.addEventListener("click", function(event) {
  add_multiple_accounts();
  console.log(csv_file.files[0]);
})

logo = document.getElementById("logo_brolt")
var count = 0
logo.addEventListener("click", (event) => {
  console.log("ok");
  count++;
  console.log(count);
  if(count == 20){
    logo.src="pictures/logosd.png"
    logo.height=40
  }
})
