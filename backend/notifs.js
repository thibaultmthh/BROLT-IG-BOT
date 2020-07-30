const Twitter = require("twitter-lite")
const request = require("request")
const {
  v4: uuidv4
} = require('uuid')

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

    args: ['--enable-features=NetworkService', "--proxy-server=" + account_info.proxyhost,'--window-size=1920,1080','--user-agent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"'],
    ignoreHTTPSErrors: true,
    slowMo: 20,
    headless: true,
    executablePath: getChromiumExecPath()

  });

  const page_auth = await browser.newPage()
  await page_auth.authenticate({
    username: account_info.proxy_username,
    password: account_info.proxy_password,
  });
  try {
    await page_auth.goto("https://www.instagram.com/")
  } catch (e) {
    console.log("Cant connect" + e.message);
    //notif_ds.add_D([Date.now().toString(), user_screen_name, "error", "Cant connect" + e.message])
    await browser.close()
    return
  }

  await page_auth.waitFor(1000)
  // authentifiction
  try {
    await page_auth.focus("input[name='username']")
    await page_auth.keyboard.type(account_info.username)
    await page_auth.focus("input[name='password']")
    await page_auth.keyboard.type(account_info.password)
    await page_auth.keyboard.press('Enter');
    await page_auth.waitFor(3000)
    await page_auth.keyboard.press('Enter');

    try{
      await page_auth.waitForNavigation({
        waitUntil: 'networkidle0'
      })
    }
    catch (e){
      await page_auth.waitFor(3000)
      await page_auth.keyboard.press('Enter');
      await page_auth.waitForNavigation({
        waitUntil: 'networkidle0'
      })
      await page_auth.waitFor(800)

    }

  } catch (e) {
    console.log("Cant find connexion form", e.message);
    //notif_ds.add_D([Date.now().toString(), user_screen_name, "error", "Cant find connextion form" + e.message])
    await browser.close()
    return

  }

  try {
    var page2 = await browser.newPage()
    await page2.goto("https://www.instagram.com/direct/inbox/")
    await page2.waitFor(1000)

    //await page2.click("body > div.RnEpo.Yx5HN > div > div > div > div.mt3GC > button.aOOlW.HoLwm")
    await page2.click("#react-root > section > div > div._lz6s.Hz2lF > div > div.ctQZg > div > div:nth-child(4) > a")


    await page2.waitFor(5000)
  } catch (e) {
    console.log("Can't start page 2", e.message);
    await page2.screenshot({path: 'example.png'});
    await browser.close()
    return


  }

  try {

    const elements = await page2.$$(".YFq-A")
    var keywords = ["mentioned"];

    for (i in elements) {
      let element = elements[i]
      let text = await page2.evaluate(element => element.textContent, element);
      text = text.substring(0, text.length-3)
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
      }
      console.log("Mentions", text);

    }
  } catch (e) {
    console.log("Can't get mention", e.message);
  }

  try {
    const elements_x = await page2.$$(".OEMU4")
    for (i in elements_x) {
      let element = elements_x[i]
      let text = await page2.evaluate(element => element.textContent, element);
      let datas = {
        //date: event.created_timestamp,
        message: text
      }
      notif_ds.add_D([text, user[0], "dm", datas])
      console.log("DM", text);

    }
  } catch (e) {
    console.log("Can't get DM", e.message);
  }

  await browser.close()
  console.log("browser closed")









}




function check_all_notifs(users_DS, notif_ds, settings_ds) {
  var all_user = users_DS.get_All_screen_name()
  var delay_between_user_check = 14000

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
