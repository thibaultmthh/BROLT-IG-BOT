function get_bot_list() {
  ipc.send("get_bot_list", "")
}
get_bot_list()
setInterval(get_bot_list, 10000)

var user_displayed = []



function delete_acc(event) {
  acc = event.path[0].id
  //console.log(acc);
  ipc.send("delete_account", acc)
  user_displayed = []
  document.getElementById('all_bots').innerHTML = ""
  get_bot_list()
}






function display_bot_list(data) {
  console.log(data);
  main_div = $('#liste_account')
  main_div.empty()
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
        "                    <div class=''>" +
        "                      <p>DELETE</p>" +
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
}



ipc.on("bot_list", (event, data) => {
  display_bot_list(data)
})








//