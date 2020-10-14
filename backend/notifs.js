const request = require("request")
const {
  v4: uuidv4
} = require('uuid')
const {
  login,
  like,
  follow
} = require("./instagram.js")

const {
  Webhook,
  MessageBuilder
} = require('discord-webhook-node');



function win_message(chaine) {
  var keywords = ["win", "winner", "winners", "congrats", "congratulation", "congratulations", "dm", "claim", "won", "tinumi389"];
  var yes = false;
  for (var i in keywords) {

    if (chaine.toLowerCase().includes(keywords[i])) {
      yes = true;
    }
  }

  return yes
}


const puppeteer = require('puppeteer-extra')

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())


function getChromiumExecPath() {
  return puppeteer.executablePath().replace('app.asar', 'app.asar.unpacked');
}



async function check(user, users_DS, notif_ds, settings_ds) {
  let perso_id = settings_ds.get_D("perso_id");
  user = users_DS.get_D(user)
  let account_info = user[2]


  const browser = await puppeteer.launch({

    args: ['--enable-features=NetworkService', "--proxy-server=" + account_info.proxyhost, '--window-size=1920,1080', '--user-agent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"'],
    ignoreHTTPSErrors: true,
    slowMo: 20,
    headless: true,
    executablePath: getChromiumExecPath()

  });

  await login(browser, account_info, notif_ds, account_info.username)


  try {
    var page2 = await browser.newPage()
    await page2.goto("https://www.instagram.com/direct/inbox/")
    await page2.waitFor(1000)

    //await page2.click("body > div.RnEpo.Yx5HN > div > div > div > div.mt3GC > button.aOOlW.HoLwm")
    await page2.click("#react-root > section > div > div._lz6s.Hz2lF > div > div.ctQZg > div > div:nth-child(4) > a")


    await page2.waitFor(5000)
  } catch (e) {
    console.log("Can't start page 2", e.message);
    await page2.screenshot({
      path: 'example.png'
    });
    await browser.close()
    return


  }
  try {

    const elements = await page2.$$(".YFq-A")
    var keywords = ["mentioned"];
    console.log("partie 1");
    for (i in elements) {
      let element = elements[i]
      let text = await page2.evaluate(element => element.textContent, element);
      text = text.substring(0, text.length - 3)
      var yes = false;
      for (var i in keywords) {

        if (text.toLowerCase().includes(keywords[i])) {
          yes = true;
        }
      }
      if (yes == true) {
        notif_ds.add_D([text, user[0], "mention", {
          //date: mention.created_at,
          message: text,
          //send_by: mention.user.screen_name
        }])
        let text_check = text + user[0]
        if (notif_ds.is_w_sent(text_check) && win_message(text)) {
          console.log("webhook sent");
          let webhook_url = settings_ds.get_All().webhook_url
          const hook = new Webhook(webhook_url);
          const embed = new MessageBuilder()
            .setTitle('New Instagram win')
            //.setAuthor('Brolt Tools. Instagram ')
            .addField('Text', text)
            .addField('Receive on ', user[0])
            .setColor('#00b0f4')
            .setThumbnail('https://cdn.discordapp.com/attachments/742710800644309092/742711391546245130/Brolt_Blue.png')
            //.setDescription('Oh look a description :)')
            .setFooter('Brolt Tools. Instagram ', 'https://cdn.discordapp.com/attachments/742710800644309092/742711391546245130/Brolt_Blue.png')
            .setTimestamp();

          hook.send(embed);
          notif_ds.w_sent(text_check)
        }

      }

    }
  } catch (e) {
    console.log("Can't get mention", e.message);
  }

  try {
    console.log("Partie 2");
    const elements_x = await page2.$$(".se6yk.qyrsm")
    for (i in elements_x) {
      console.log(i);
      let element = elements_x[i]
      let text = await page2.evaluate(element => element.textContent, element);
      let datas = {
        //date: event.created_timestamp,
        message: text
      }

      notif_ds.add_D([text, user[0], "dm", datas])
      let text_check = text + user[0]

      if (!notif_ds.is_w_sent(text_check)) {
        console.log("webhook sent");
        let webhook_url = settings_ds.get_All().webhook_url
        const hook = new Webhook(webhook_url);
        const embed = new MessageBuilder()
          .setTitle('New Instagram Direct Message Not aprouved')
          //.setAuthor('Brolt Tools. Instagram ')
          .addField('Text', text)
          .addField('Receive on ', user[0])
          .setColor('#00b0f4')
          .setThumbnail('https://cdn.discordapp.com/attachments/742710800644309092/742711391546245130/Brolt_Blue.png')
          //.setDescription('Oh look a description :)')
          .setFooter('Brolt Tools. Instagram ', 'https://cdn.discordapp.com/attachments/742710800644309092/742711391546245130/Brolt_Blue.png')
          .setTimestamp();

        hook.send(embed);
        notif_ds.w_sent(text_check)
      }
      console.log("DM", text);

    }
  } catch (e) {
    console.log("Can't get DM", e.message);
  }






  try {
    console.log("partie 3");
    await page2.click("#react-root > section > div > div.Igw0E.IwRSH.eGOV_._4EzTm > div > div > div.oNO81 > div.Igw0E.IwRSH.eGOV_._4EzTm.i0EQd > div > div > div > div > div.Igw0E.IwRSH.eGOV_.ybXk5._4EzTm.pjcA_.iHqQ7.L-sTb > button")
    await page2.click("#react-root > section > div > div.Igw0E.IwRSH.eGOV_._4EzTm > div > div > div.oNO81 > div.Igw0E.IwRSH.eGOV_._4EzTm.i0EQd > div > div > div > div > div.Igw0E.IwRSH.eGOV_.ybXk5._4EzTm.pjcA_.iHqQ7.L-sTb > button")


    const elements_y = await page2.$$(".se6yk")



    for (i in elements_y) {
      let element = elements_y[i]
      let text = await page2.evaluate(element => element.textContent, element);
      let datas = {
        //date: event.created_timestamp,
        message: text
      }
      let text_check = text + user[0]

      notif_ds.add_D([text, user[0], "dm", datas])
      if (!notif_ds.is_w_sent(text_check)) {
        console.log("webhook sent");
        let webhook_url = settings_ds.get_All().webhook_url
        const hook = new Webhook(webhook_url);
        const embed = new MessageBuilder()
          .setTitle('New Instagram Direct Message ')
          //.setAuthor('Brolt Tools. Instagram ')
          .addField('Text', text)
          .addField('Receive on ', user[0])
          .setColor('#00b0f4')
          .setThumbnail('https://cdn.discordapp.com/attachments/742710800644309092/742711391546245130/Brolt_Blue.png')
          //.setDescription('Oh look a description :)')
          .setFooter('Brolt Tools. Instagram ', 'https://cdn.discordapp.com/attachments/742710800644309092/742711391546245130/Brolt_Blue.png')
          .setTimestamp();

        hook.send(embed);
        notif_ds.w_sent(text_check)
      }
      console.log("DM", text);

    }
  } catch (e) {
    console.log("Can't get asked DM", e.message);
  }

  await browser.close()
  console.log("browser closed")









}




function check_all_notifs(users_DS, notif_ds, settings_ds) {
  var all_user = users_DS.get_All_screen_name()
  var delay_between_user_check = 30000

  for (var i in all_user) {
    user = all_user[i]
    if (i == all_user.length - 1) {
      last = true
    } else {
      last = false
    }
    setTimeout(check, delay_between_user_check * i, user, users_DS, notif_ds, settings_ds)



  }
}


module.exports.check_all_notifs = check_all_notifs;