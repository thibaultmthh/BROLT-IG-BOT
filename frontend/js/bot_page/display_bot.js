function get_bot_list() {
  ipc.send("get_bot_list", "")
}
get_bot_list()
setInterval(get_bot_list, 40000)

var user_displayed = []



function delete_acc(event) {
  console.log(event);
  acc = event.target.id
  //console.log(acc);
  ipc.send("delete_account", acc)
  get_bot_list()
}






function display_bot_list(data) {
  console.log(data);
  main_div = $('#liste_account')
  main_div.empty()
  user_displayed = []
  for (var i in data) {
    botname = data[i][0]
    proxyhost = data[i][2].proxyhost
    proxyhost = proxyhost.substring(0, proxyhost.length - 5)
    if (user_displayed.includes(botname) == false) {
      user_displayed.push(botname);
      let div = " <div class='el_accounts centrer'> " +
        "                  <div class='el_account '>" +
        "                    <div class=''>" +
        "                      <p>" + botname + "</p>" +
        "                    </div>" +
        "                    <div class=''>" +
        "                      <p>" + proxyhost + "</p>" +
        "                    </div>" +
        "                    <div class='btn_delete'>" +
        "                      <p id='" + botname + "' class=''>DELETE</p>" +
        "                    </div>" +
        "                  </div>" +
        "                </div>"


      /*
      btn.addEventListener("click", function(event) {
        event.preventDefault();
        delete_acc(event);
      })
      */
      main_div.append(div)
    }
  }
  $(".btn_delete").on("click", (event) => {
    event.preventDefault();
    delete_acc(event);
  })
}



ipc.on("bot_list", (event, data) => {
  display_bot_list(data)
})








//