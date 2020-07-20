function send_giveway_link() {
  let value = document.getElementById('linkInput').value
  if (value != "") {
    ipc.send("get_giveway_info", value)
  } else {
    let error_place = document.getElementById('emailHelp')
    error_place.textContent = "Please specify a giveaway"
  }

}
var btn_valide_giveway = document.getElementById('btn_valide_giveway')
btn_valide_giveway.addEventListener("click", send_giveway_link)



function validate_giveway_info(data) {
  let user_to_follow = []

  let need_rt = document.getElementById("customSwitches").checked

  let need_like = document.getElementById("switch1").checked

  let text_to_add = document.getElementById("hashtagsInput").value



  let nb_friend_to_tag = document.getElementById("exampleFormControlSelect1").value * 1

  if (nb_friend_to_tag == 0 && text_to_add == "") {
    var tag_friend = false
  } else {
    var tag_friend = true
  }

  for (var i in data.user_mentioned) {
    let screen_name = data.user_mentioned[i].screen_name
    let element = document.getElementById(screen_name)
    if (element.checked) {
      user_to_follow.push(data.user_mentioned[i])
    }
  }

  let data_to_send = [data.giveway_id, {
    user_to_follow: user_to_follow,
    follow_provider: true,
    text_to_add: text_to_add,
    need_like: need_like,
    need_rt: need_rt,
    tag_friend: tag_friend,
    nb_friend_to_tag: nb_friend_to_tag,
    giveway_id: data.giveway_id,
    provider_id: data.provider,
    link: data.link,
    provider_screen_name: data.organiser_screen_name,
    without_proxy: false
  }]
  ipc.send("add_new_giveway", data_to_send)

  //remet tout les truc en place :
  var menu = document.getElementById("Settings_menu")
  menu.classList.remove("je")
  document.getElementById('linkInput').value = ""
  setTimeout(refresh_all, 1000)



}



function display_giveway_info(data) {
  if (data.errors != undefined) {
    let error_place = document.getElementById('emailHelp')
    error_place.textContent = data.errors[0].message
  } else {
    //remmet les truc en place
    let error_place = document.getElementById('emailHelp');
    error_place.textContent = ""
    document.getElementById("hashtagsInput").value = ""
    tag_friend = document.getElementById("switch2").checked = false

    var menu = document.getElementById("Settings_menu")
    menu.classList.add("je")
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



    }

    // suite ( en mode function dans fonction)
    var add_giveway_btn = document.getElementById("add_giveway_btn")
    add_giveway_btn.addEventListener("click", (event) => {
      validate_giveway_info(data)
    })

    get_update_display_giveway()







  }

}
ipc.on("giveway_info", (event, data) => {
  display_giveway_info(data);
})









//
