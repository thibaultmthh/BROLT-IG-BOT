//const ipc = require('electron').ipcRenderer;



//var btn = document.getElementById("btn_valide_giveway")
//var menu = document.getElementById("Settings_menu")
//btn.addEventListener("click", function (event) {console.log("ouverture du S.A.S ...");menu.classList.add("je");
//})

/* slide not needed for now
var slider = document.getElementById("myRange");
var output = document.getElementById("output_slide");
// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {

  var a=this.value+"% of the bots on the giveway";
    output.innerHTML = a;
}
*/

var menu = document.getElementById("Settings_menu")


var otherCheckbox = document.getElementById('switch2');
var otherText = document.getElementById('hashtagsInput');
var modal_error = document.getElementById("modal-error")


//



var modal = document.getElementById("myModal");
var btn = document.getElementById("btn_valide_giveway");

btn.addEventListener("click", function() {
  console.log("okkk");
  modal.style.display = "block";
})

window.onclick = function(event) {

  if (event.target == modal) {
    console.log(event.target);
    modal.style.display = "none";
  }
  if (event.target == modal-error) {
    console.log(event.target);
    modal.style.display = "none";
  }
}
