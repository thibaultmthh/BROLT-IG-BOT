var btn_Dm = document.getElementById("Btn_Dm")
var btn_Mentions = document.getElementById("Btn_Mentions")
var btn_errors = document.getElementById("Btn_Errors")

var soulig_en_cours = btn_Dm


function changer_jaune(btn) {
  soulig_en_cours.classList.remove("jaune");
  btn.classList.add("jaune");
  soulig_en_cours = btn
}

function get_notif() {
  ipc.send("get_list_notif", "")
}

changer_jaune(btn_Dm);
var displayed = "dm"

get_notif()
setInterval(get_notif, 15000)

btn_Mentions.addEventListener("click", function(event) {
  soulig_en_cours.classList.remove("jaune");
  changer_jaune(btn_Mentions);
  displayed = "mention"
  get_notif()
})
btn_Dm.addEventListener("click", function(event) {
  changer_jaune(btn_Dm);
  displayed = "dm"
  get_notif()
})

btn_errors.addEventListener("click", function(event) {
  changer_jaune(btn_errors);
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
  var keywords = ["win", "winner", "winners", "congrats", "congratulation", "congratulations", "dm", "claim", "won"];
  var yes = false;
  for (var i in keywords) {

    if (chaine.toLowerCase().includes(keywords[i])) {
      yes = true;
    }
  }
  if (yes) {
    var text = document.createElement("b");
    text.appendChild(document.createTextNode(chaine));
    var node = document.createElement("p");
    console.log(node)
    node.appendChild(text);

  } else {
    var node = document.createElement("p");
    node.appendChild(document.createTextNode(chaine));
  }
  console.log(node, yes)
  return node
}


function display_notif(data) {
  let main_div = document.getElementById('notifs_place')
  main_div.innerHTML = ""
  let displayed_message = []
  for (var i in data) {
    notif = data[i]
    //console.log(notif);
    console.log(displayed,notif[2] );

    if (notif[2] == displayed && notif[3] != undefined) {
      if (displayed == "error") {
        console.log(notif);
        message = " @" + notif[1] + " Error -> " + notif[3].errors[0].message
        if (displayed_message.includes(message) == false) {
          displayed_message.push(message);
          console.log(message);
          let p_text = bold_chaine(message)
          main_div.appendChild(p_text)
        } else {
        }
      }
      if (displayed == "mention") {
        console.log(notif);
        message = notif[3].date.substring(4, 17) + " @" + notif[3].send_by + " send -> " + notif[3].message
        let p_text = bold_chaine(message)

        main_div.appendChild(p_text)
        console.log(message);
      }
      if (displayed == "dm") {
        date = timeConverter(notif[3].date)
        message = date + " @" + notif[1] + " --> " + notif[3].message
        let p_text = bold_chaine(message)
        console.log(message);
        main_div.appendChild(p_text)
      }
    }


  }
}



ipc.on("list_notif", (event, data) => {
  display_notif(data)
})

get_notif()


//
