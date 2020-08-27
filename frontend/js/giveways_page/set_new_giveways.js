const request = require('request');

const {
  v4: uuidv4
} = require('uuid');



function createError(errorText) {
  let modalError = document.getElementById("myModal-error")
  let errorTextP = document.getElementById('error')
  errorTextP.textContent = errorText
  modalError.style.display = "block";

}

function send_giveway_link() {
  let value = document.getElementById('linkInput').value.trim()
  console.log(value);
  let error_place = document.getElementById('emailHelp')
  createError("Checking...")
  if (value != "") {
    let regex = new RegExp('instagram.com');
    console.log(regex);
    if (regex.test(value) != true) {
      createError("Please enter a valid instagram link")
      console.log(value);
      return
    }
    console.log("aa");
    request.get(value,(error, res, body) => {
      console.log("res.statusCode");
      if (error) {
        createError(error.message)
        return
      }
      if (res.statusCode != 200) {
        createError(res.statusCode.toString() + " Error")
        return
      }
      if (res.statusCode == 200) {
        display_giveway_info("")
        let modal = document.getElementById("myModal");
        modal.style.display = "block";

      }
    })
    console.log("asa");
  } else {
    createError("Please specify a giveaway")
  }

}

var btn_valide_giveway = document.getElementById('btn_valide_giveway')
btn_valide_giveway.addEventListener("click", (event) => {
  event.preventDefault();
  send_giveway_link()
})



function validate_giveway_info(data) {
  let user_to_follow = []
  let link = document.getElementById('linkInput').value.trim()
  if (link == "") {
    return
  }
  let giveaway_name = document.getElementById("giveaway_name_form").value.trim()
  if (giveaway_name == "") {
    giveaway_name = "Instagram giveaway"
  }

  let follow_provider = document.getElementById("follow_provider_switch").checked
  let follow_mentioned = document.getElementById("follow_mentioned_switch").checked
  let need_like = document.getElementById("switch1").checked

  let text_to_add = document.getElementById("hashtagsInput").value

  let nb_friend_to_tag = document.getElementById("exampleFormControlSelect1").value * 1

  if (nb_friend_to_tag == 0 && text_to_add == "") {
    var tag_friend = false
  } else {
    var tag_friend = true
  }

  let data_to_send = [uuidv4(), {
    user_to_follow: user_to_follow,
    follow_provider: follow_provider,
    follow_mentioned: follow_mentioned,
    text_to_add: text_to_add,
    need_like: need_like,
    tag_friend: tag_friend,
    nb_friend_to_tag: nb_friend_to_tag,
    provider_screen_name: giveaway_name,
    link: link
  }]

  ipc.send("add_new_giveway", data_to_send)

  //remet tout les truc en place :
  var menu = document.getElementById("Settings_menu")
  let modal = document.getElementById("myModal");
  modal.style.display = "none";
  document.getElementById('linkInput').value = ""
  setTimeout(refresh_all, 100)



}



function display_giveway_info(data) {
  if (data.errors != undefined) {
    let error_place = document.getElementById('emailHelp')
    createError(data.errors[0].message)
  } else {
    //remmet les truc en place

    /*
    let main_div = document.getElementById('list_to_follow')
    main_div.innerHTML = ""
    for (var i in data.user_mentioned) {
      let screen_name = data.user_mentioned[i].screen_name
      console.log(screen_name);
      let el_div = document.createElement("div");
      el_div.classList.add("custom-control");
      el_div.classList.add("custom-checkbox")
      let checkbx = document.createElement("input");
      checkbx.type = "checkbox";
      checkbx.classList.add("custom-control-input");
      checkbx.id = screen_name;
      checkbx.checked = true
      el_div.appendChild(checkbx)
      let label_screen_name = document.createElement("label");
      label_screen_name.classList.add("custom-control-label");
      label_screen_name.htmlFor = screen_name;
      label_screen_name.textContent = screen_name;
      label_screen_name.id = screen_name + "_checkbox"

      el_div.appendChild(label_screen_name)
      let main_div = document.getElementById('list_to_follow')
      main_div.appendChild(el_div)
      */



  }

  // suite ( en mode function dans fonction)
  var add_giveway_btn = document.getElementById("add_giveway_btn")
  add_giveway_btn.addEventListener("click", (event) => {
    event.preventDefault();
    validate_giveway_info(data)
  })

  get_update_display_giveway()
}


ipc.on("giveway_info", (event, data) => {
  display_giveway_info(data);
})









//
