const request = require('request');
const {
  Webhook,
  MessageBuilder
} = require('discord-webhook-node');


var task_cooldown = document.getElementById("exampleInputPassword1")
var acc_cooldown = document.getElementById("exampleInputPassword2")
var input_webhook = document.getElementById("input_webhook")
var input_headless = document.getElementById("input_headless")

var btn_save_settings = document.getElementById("btn_save_settings")

var btn_reset_settings = document.getElementById("btn_reset_settings")


var clef_affichage = document.getElementById("clef_affichage")

var btn_test_webhooks = document.getElementById("test_webhook")

var key_x = ""








ipc.on("all_settings", (event, data) => {
  clef_affichage.textContent = data.key;
  task_cooldown.value = data.cooldown_giveaways / 1000;
  acc_cooldown.value = data.cooldown_account / 1000, key_x = data.key
  input_webhook.value = data.webhook_url
  input_headless.checked = data.input_headless
})
ipc.send("get_settings")
var btn_delete_key = document.getElementById("btn_delete_key")
/*
btn_delete_key.addEventListener("click", (event) => {
  event.preventDefault();
  ipc.send("set_settings", {
    'key': "key",
    "data": ""
  });
  ipc.send("get_settings")
  request.get("http://api.seigrobotics.com:5000/del_activation?key=" + key_x, (error, res, body) => {
    if (error) {
      console.error(error)
      return
    }
    console.log(`statusCode: ${res.statusCode}`)
    console
  })
})

btn_test_webhooks.addEventListener("click", (event) => {
  event.preventDefault();
  ipc.send("set_webhook", input_webhooks.value)

})
*/
function send_settings() {
  console.log(task_cooldown.value * 1000);
  ipc.send("set_settings", {
    "key": "cooldown_giveaways",
    "data": (task_cooldown.value * 1000)
  })
  ipc.send("set_settings", {
    "key": "cooldown_account",
    "data": (acc_cooldown.value * 1000)
  })

  ipc.send("set_settings", {
    "key": "webhook_url",
    "data": input_webhook.value
  })
  ipc.send("set_settings", {
    "key": "input_headless",
    "data": input_headless.checked
  })
  console.log("value : ", input_headless.checked);

  //ipc.send("set_webhook", input_webhooks.value)
  const hook = new Webhook(input_webhook.value);
  const embed = new MessageBuilder()
    .setTitle("Brolt Tools Instagram event")
    //.setAuthor('Brolt Tools. Instagram ')
    //.addField('Date', 'this is inline', true)
    //.addField('Receive on ', 'this is not inline')
    .setColor('#00b0f4')
    //.setThumbnail('https://cdn.discordapp.com/attachments/742710800644309092/742711391546245130/Brolt_Blue.png')
    .setDescription('Settings saved')
    .setFooter('Brolt Tools. Instagram ', 'https://cdn.discordapp.com/attachments/742710800644309092/742711391546245130/Brolt_Blue.png')
    .setTimestamp();

  hook.send(embed);

  /*
    const hook = new Webhook("https://discordapp.com/api/webhooks/765250687667142657/AubLlF5lBKS_LSovRJwMASOZgvY_prow--UR2OkwZrpj9BLgCo51LhvkPqPlSXfeUFJ6");
    const embed = new MessageBuilder()
      .setTitle('New brolt notif')
      //.setAuthor('Brolt Tools. Instagram ')
      .addField('Date', 'this is inline', true)
      .addField('Receive on ', 'this is not inline')
      .setColor('#00b0f4')
      .setThumbnail('https://cdn.discordapp.com/attachments/742710800644309092/742711391546245130/Brolt_Blue.png')
      .setDescription('Oh look a description :)')
      .setFooter('Brolt Tools. Instagram ', 'https://cdn.discordapp.com/attachments/742710800644309092/742711391546245130/Brolt_Blue.png')
      .setTimestamp();

    hook.send(embed);
    console.log("sent");
  */


  /*
    urlperso = "https://discordapp.com/api/webhooks/721805054906073130/rtJv-S-uzgr36SRBA6yZ4bs3X5piWSyPkd39wFgGGPm7RMnSyzruSn997ibI-wZG1100"

    produit = "New seig {}".format(notif_data["type"])
    image = "https://cdn.discordapp.com/attachments/689459597186039894/707246484646658049/image0.png"
    credits = "Seig robotics / Thibault V1.0"

    url = "https://discordapp.com/api/webhooks/723267779213525074/MaYgd0R8m8_7rcGu-b4JH59-DZht_E3zzFXGb70l7bc2wVJ_RxH2Mx10xEDoCoTwHoRl"
    webhook = DiscordWebhook(url = url)
    message = DiscordEmbed(title = produit,
      color = 529293)
    message.add_embed_field(name = "Date",
      value = notif_data["date"],
      inline = True)
    message.add_embed_field(name = "Receive on :",
      value = "@" + notif_data["on"],
      inline = True)
    message.add_embed_field(name = "Sent by :",
      value = "@" + notif_data["by"],
      inline = True)

    message.add_embed_field(name = "Message :",
      value = notif_data["text"],
      inline = False)

    message.set_thumbnail(url = image)
    message.set_footer(text = credits)
  */








}

ipc.on("all_settings", function(event, data) {
  console.log(data);
})



btn_save_settings.addEventListener('click', function(event) {
  event.preventDefault();
  console.log("oooo");
  send_settings()
})

btn_reset_settings.addEventListener('click', function(event) {
  event.preventDefault();
  task_cooldown.value = 90;
  acc_cooldown.value = 10;
  input_webhooks.value = "";
  send_settings()
})




var modal = document.getElementById("modal-error")
window.onclick = function(event) {

  if (event.target == modal) {
    console.log(event.target);
    modal.style.display = "none";
  }
}





//