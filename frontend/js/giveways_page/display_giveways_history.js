var giveway_displayed = []

function get_update_display_giveway() {
  ipc.send("get_all_giveways", "get")
}

function update_display_giveway(event, data) {
  console.log(data);
  data = data.reverse()
  for (var i in data) {
    let giveway = data[i]

    if (giveway_displayed.includes(giveway[0]) == false) {
      giveway_displayed.push(giveway[0]);

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
      btn.addEventListener("click",function(event) {event.preventDefault();delete_giveways(event);})
      div_2.appendChild(btn)

      document.getElementById("list_all_giveways").appendChild(fist_div)
    }


  }
}

ipc.on("all_giveways_value", function(event, data) {
  update_display_giveway(event, data)
})

get_update_display_giveway()
setInterval(get_update_display_giveway, 10000)



function refresh_all() {
  giveway_displayed = []
  document.getElementById("list_all_giveways").innerHTML = ""
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
