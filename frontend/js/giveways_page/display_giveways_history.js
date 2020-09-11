var giveway_displayed = []

function get_update_display_giveway() {
  ipc.send("get_all_giveways", "get")
}

function yesno(response) {
  console.log(
    response
  );
  if (response == true) {
    return "Yes"
  } else {
    return "No"
  }
}

function update_display_giveway(event, data) {
  console.log(data);
  data = data.reverse()
  document.getElementById("cont_tasks").innerHTML = ""
  if (data.length % 4 != 0) {
    number_of_column = Math.trunc(data.length / 4) + 1
  } else {
    number_of_column = data.length / 4
  }
  console.log(number_of_column);

  for (let nb_column = 0; nb_column < number_of_column; nb_column++) {
    var cont_tasks = document.getElementById("cont_tasks")
    let div = document.createElement("div")
    div.classList.add("ligne_el_tasks")
    div.id = "cont_tasks" + (nb_column + 1)
    cont_tasks.append(div)
  }
  var compteur_colones = 0
  var truc_pour_compter = 0
  for (var i in data) {

    if (truc_pour_compter % 4 == 0) {
      compteur_colones++
    }
    let giveway = data[i]
    truc_pour_compter++
    if (giveway_displayed.includes(giveway[0]) == false) {
      //giveway_displayed.push(giveway[0]);
      let fist_div = document.createElement("div")
      fist_div.classList.add("task_el")

      // creation haut task
      let div_name = document.createElement("div")
      div_name.classList.add("h-15")
      div_name.classList.add("text-align-center")
      div_name.style = "overflow: hidden;"
      let text2 = document.createElement("p");
      text2.textContent = giveway[1].provider_screen_name
      div_name.appendChild(text2)
      fist_div.appendChild(div_name)

      //ajout millieu
      let contMillieu = document.createElement("div")
      contMillieu.classList.add("h-70")
      let contDisplay = document.createElement("div")
      contDisplay.classList.add("display-flex")
      contDisplay.classList.add("h-100")
      contMillieu.appendChild(contDisplay)
      //del task
      let delTask = document.createElement("div")
      delTask.classList.add("del_task")
      let croix = document.createElement("img")
      croix.src = "pictures/croix.png"
      croix.id = giveway[0]
      croix.addEventListener("click", function(event) {
        event.preventDefault();
        delete_giveways(event);
      })
      delTask.appendChild(croix)
      contDisplay.appendChild(delTask)
      // image

      let divImage = document.createElement("div")
      let image = document.createElement("img")
      image.src = giveway[1].pictures_url
      image.style = "height:80%; margin-top:10px;"
      divImage.appendChild(image)

      divImage.classList = "w-15 h-100"
      contDisplay.appendChild(divImage)

      //reste
      let divStatus = document.createElement("div")
      divStatus.classList = "h-100 w-50 center text-align-center centrer"
      let pStatus = document.createElement("p")
      divStatus.appendChild(pStatus)
      contDisplay.appendChild(divStatus)


      fist_div.appendChild(contMillieu)


      //ajout bas
      let contbas = document.createElement("div")
      contbas.classList.add("h-15")
      contbas.classList.add("centrer")
      contbas.classList.add("text-align-center")
      let secondsRemaining = document.createElement("p")
      secondsRemaining.textContent = "Like: " + yesno(giveway[1].need_like) + " , Tag friends: " + yesno(giveway[1].tag_friend)
      contbas.appendChild(secondsRemaining)
      fist_div.appendChild(contbas)



      console.log("cont_tasks" + compteur_colones);
      if (giveway[2] == 1) {
        pStatus.textContent = "Done"
      } else if ((giveway[2] == 2)) {
        pStatus.textContent = "Running"
        fist_div.classList.add("running")
      } else {
        fist_div.classList.add("waiting")
        pStatus.textContent = "Waiting"
      }


      document.getElementById("cont_tasks" + compteur_colones).appendChild(fist_div)

      /*
      let fist_div = document.createElement("div")
      fist_div.classList.add("el-list")
      let div_2 = document.createElement("div")
      div_2.classList.add("el-liste")
      fist_div.appendChild(div_2)
      let text1 = document.createElement("p");
      text1.appendChild(document.createTextNode(giveway[1].provider_screen_name));
      text1.classList.add("nom")
      div_2.appendChild(text1)
      if (giveway[2] == 1) {
        var text2 = document.createElement("p");
        text2.appendChild(document.createTextNode("Done"));
        text2.classList.add("vert")
      } else if ((giveway[2] == 2)) {
        var text2 = document.createElement("p");
        text2.appendChild(document.createTextNode("Running"));
        text2.classList.add("red")
      } else {
        var text2 = document.createElement("p");
        text2.appendChild(document.createTextNode("Waiting"));
        text2.classList.add("red")
      }
      div_2.appendChild(text2)
      let btn = document.createElement("button")
      btn.classList.add("btn")
      btn.classList.add("btn-danger")
      btn.classList.add("testcao")
      btn.textContent = "delete"
      btn.id = giveway[0]
      btn.addEventListener("click", function(event) {
        event.preventDefault();
        delete_giveways(event);
      })
      div_2.appendChild(btn)

      document.getElementById("list_all_giveways").appendChild(fist_div)
      */
    }


  }

}

ipc.on("all_giveways_value", function(event, data) {
  update_display_giveway(event, data)
})

get_update_display_giveway()
setInterval(get_update_display_giveway, 100000)



function refresh_all() {
  giveway_displayed = []
  document.getElementById("cont_tasks").innerHTML = ""
  get_update_display_giveway()

}
setInterval(refresh_all, 30000)


function delete_giveways(event) {
  acc = event.path[0].id
  //console.log(acc);
  ipc.send("delete_app_giveway", acc)
  user_displayed = []

  refresh_all()
}









//