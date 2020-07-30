var btn_Dm = document.getElementById("Btn_Dm")
var btn_Mentions = document.getElementById("Btn_Mentions")
var btn_errors = document.getElementById("Btn_Errors")
var soulig_en_cours = btn_Dm

var menu = document.getElementById("Menu_notif")
var easter = document.getElementById("easter")


menu.addEventListener("mouseenter", function() {
  // on met l'accent sur la cible de mouseenter
  easter.style.display = "block"

  // on réinitialise la couleur après quelques instants
  setTimeout(function() {
    easter.style.display = "none";
  }, 600);
}, false);









function get_notif() {
  ipc.send("get_list_notif", "")
}

var displayed = "dm"

get_notif()
setInterval(get_notif, 15000)

btn_Mentions.addEventListener("click", function(event) {
  soulig_en_cours.classList.remove("jaune");
  //changer_jaune(btn_Mentions);
  displayed = "mention"
  get_notif()
})
btn_Dm.addEventListener("click", function(event) {
  //changer_jaune(btn_Dm);
  displayed = "dm"
  get_notif()
})

btn_errors.addEventListener("click", function(event) {
  //changer_jaune(btn_errors);
  displayed = "error"
  get_notif()
})


function timeConverter(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp * 1);
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + hour + ':' + min;
  return time;
}

function bold_chaine(chaine) {
  var keywords = ["win", "winner", "winners", "congrats", "congratulation", "congratulations", "dm", "claim", "won", "tinumi389"];
  var yes = false;
  for (var i in keywords) {

    if (chaine.toLowerCase().includes(keywords[i])) {
      yes = true;
    }
  }

  return yes
}


function display_notif(data) {
  let main_div = $("#notifs_place")
  main_div.empty()
  let displayed_message = []
  for (var i in data) {
    notif = data[i]

    if (notif[2] == displayed && notif[3] != undefined) {
      if (displayed == "error") {
        console.log(notif);
        message = " @" + notif[1] + " Error -> " + notif[3]
        if (displayed_message.includes(message) == false) {
          displayed_message.push(message);
          main_div.append("<p>" + messages + "</p>")
        } else {}
      }
      if (displayed == "mention") {
        let yes = bold_chaine(notif[3].message)
        if (yes) {
          text = "<b>" + notif[3].message + "</b>"
          class_username = "couleur_win"

        } else {
          text = notif[3].message
          class_username = ""
        }
        let div = "<div class='message_notif'>" +
          "                    <div class='nom_compte '>" +
          "                      <p class= " + class_username + ">" + notif[1] + "</p>" +
          "                    </div>" +
          "                    <div class='texte'>" +
          "                      <p>" + text + "</p>" +
          "                    </div>" +
          "                    <div class='date_notif'>" +
          "                      <p></p>" +
          "                    </div>" +
          "                  </div>"
        main_div.append(div)





        console.log(message);
      }
      if (displayed == "dm") {
        let yes = bold_chaine(notif[3].message)
        if (yes) {
          text = "<b>" + notif[3].message + "</b>"
          class_username = "couleur_win"

        } else {
          text = notif[3].message
          class_username = ""
        }
        let div = "<div class='message_notif'>" +
          "                    <div class='nom_compte '>" +
          "                      <p class= " + class_username + ">" + notif[1] + "</p>" +
          "                    </div>" +
          "                    <div class='texte'>" +
          "                      <p>" + text + "</p>" +
          "                    </div>" +
          "                    <div class='date_notif'>" +
          "                      <p></p>" +
          "                    </div>" +
          "                  </div>"
        main_div.append(div)
      }
    }


  }
}



ipc.on("list_notif", (event, data) => {
  display_notif(data)
})

get_notif()


//