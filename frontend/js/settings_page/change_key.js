const request = require('request');

var clef_affichage = document.getElementById("clef_affichage")

var key_x = ""

ipc.on("all_settings", (event, data) => {
  clef_affichage.textContent = data.key
  key_x = data.key

})

ipc.send("get_settings")
var btn_delete_key = document.getElementById("btn_delete_key")
btn_delete_key.addEventListener("click", (event) => {
      event.preventDefault();
      //ipc.send("set_settings", {'key': "key","data": ""});
      ipc.send("get_settings");
      console.log("ok");
      request.get("http://51.83.99.197:5000/del_activation?key=" + key_x, (error, res, body) => {
        if (error) {
          console.error(error)
          return
        }
        console.log(`statusCode: ${res.statusCode}`)
        console
      })
//F3EAAF-305D05-46DF85-F6B15B-364D91-8F9C97
