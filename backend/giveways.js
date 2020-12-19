const request = require('request');

var url = require("url")
var querystring = require('querystring');

const {
  login,
  like,
  follow
} = require("./instagram.js")



const puppeteer = require('puppeteer-extra')
// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())


function get_giveway_info(url, mainWindow) {
  request.get(url, (error, res, body) => {
    console.log(res.statusCode);
    if (error) {
      mainWindow.webContents.send("giveway_info", {
        error: error.message
      })

    } else if (res.statusCode != 200) {
      if (res.statusCode == 404) {
        mainWindow.webContents.send("giveway_info", {
          error: "404 No found, wrong link or private pic"
        })

      } else {
        mainWindow.webContents.send("giveway_info", {
          error: res.statusCode.toString() + " Error"
        })
      }
    } else {
      mainWindow.webContents.send("giveway_info", {
        body: body
      })
    }
  })


}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function start_giveway(giveways_ds, users_DS, unstored_data, notif_ds, settings_ds) {
  if (unstored_data.get_D("giveways_state") != 0) {
    return 1
  }
  var all_user = users_DS.get_All_screen_name()
  var delay_between_participate = settings_ds.get_D("cooldown_account")
  var e = (13 * 1000)
  list_not_done = giveways_ds.get_not_done()

  if (list_not_done == undefined) {
    return 1
  }
  if (list_not_done.length == 0) {
    return 1
  }
  unstored_data.set_D("giveways_state", 1)

  giveway_data = list_not_done[0]
  giveways_ds.set_running(giveway_data[0])
  for (var i in all_user) {
    user = all_user[i]

    await take_giveway(giveway_data, user, users_DS, giveways_ds, unstored_data, notif_ds, settings_ds)
    await sleep(delay_between_participate)


  }
  giveways_ds.set_done(giveway_data[0]);
  setTimeout(function () {
    unstored_data.set_D("giveways_state", 0)
  }, settings_ds.get_D("cooldown_giveaways") + (13 * 1000))
}


function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}



function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getChromiumExecPath() {
  return puppeteer.executablePath().replace('app.asar', 'app.asar.unpacked');
}


/*
var acc_i = {
  appname: "select_value",
  proxyhost: "",
  proxy_username: "",
  proxy_password: "",
  username: "bastiTricky@gmx.de",
  password: "Password333#"
}
puppeteer_comment("https://twitter.com/NetflixFR/status/1283353483534532608", "ok", acc_i)
*/


async function take_giveway(giveway_data, user_screen_name, users_DS, giveways_ds, unstored_data, notif_ds, settings_ds, last) {
  /*
  giveway_rules = les donnees du giveways : {
  link: "",
  follow_provider: true/false,
  follow_mentioned: true/false,
  need_like: true/false,
  tag_friend: true/false}
*/



  let user = users_DS.get_D(user_screen_name)
  console.log("---take on", user_screen_name, "---");

  if (user == 0) {
    return 0
  }

  screen_names = users_DS.get_All_screen_name()[0]
  let giveway_rules = giveway_data[1]
  let account_info = user[2]

  const browser = await puppeteer.launch({

    args: ['--enable-features=NetworkService', "--proxy-server=" + account_info.proxyhost],
    ignoreHTTPSErrors: true,
    slowMo: 25,
    headless: settings_ds.get_D("input_headless"),
    executablePath: getChromiumExecPath()

  });
  await login(browser, account_info, notif_ds, user_screen_name)




  const page2 = await browser.newPage()
  await page2.authenticate({
    username: account_info.proxy_username,
    password: account_info.proxy_password,
  });


  try {
    await page2.goto(giveway_rules.link)
    await page2.waitFor(300)
    const description = await page2.$eval("#react-root > section > main > div > div > article > div.eo2As > div.EtaWk > ul > div > li > div > div > div.C4VMK > span", elem => elem.innerText)
    const regex = /@[a-zA-Z-.-_]{0,}/g
    var matches = []
    var match = regex.exec(description)
    while (match != null) {
      matches.push(match[0])
      match = regex.exec(description)
    }
    var user_to_follow = []
    var mention_without_dupicate = Array.from(new Set(matches))
    for (i = 0; i < mention_without_dupicate.length; i++) {
      let a = mention_without_dupicate[i].replace("@", "")
      user_to_follow.push(a)
    }
    console.log(user_to_follow)
  } catch (e) {
    console.log("Can't fetch description", e.message);
    notif_ds.add_D([Date.now().toString(), user_screen_name, "error", "Can't fetch description" + e.message])
    await browser.close()

    return

  }
  await page2.waitFor(5000)

  if (giveway_rules.need_like) {
    await like(page2, notif_ds, user_screen_name)

  }

  if (giveway_rules.tag_friend) {
    console.log("tag fiend");
    let random_screen_name = []
    let all_screen_name = shuffle(users_DS.get_All_screen_name())
    all_screen_name.forEach(function (item) {
      //console.log(random_screen_name.length, giveway_rules.nb_friend_to_tag)
      if (item != user_screen_name && random_screen_name.length < giveway_rules.nb_friend_to_tag) {
        random_screen_name.push("@" + item)
      }
    })
    let message = random_screen_name.join(" ") + " " + giveway_rules.text_to_add
    if (message.length > 0) {
      try {
        await page2.click("#react-root > section > main > div > div > article > div.eo2As > section.ltpMr.Slqrh > span._15y0l > button")
        await page2.focus("#react-root > section > main > div > div.ltEKP > article > div.eo2As > section.sH9wk._JgwE > div > form > textarea")
        await page2.keyboard.type(message)
        await page2.waitFor(3000)
        await page2.click("#react-root > section > main > div > div.ltEKP > article > div.eo2As > section.sH9wk._JgwE > div > form > button")
        console.log("Comented")
        await page2.waitFor(2000)
      } catch (e) {
        console.log("Can't comment", e.message);
        notif_ds.add_D([Date.now().toString(), user_screen_name, "error", "Can't comment" + e.message])

      }
      //COMMENT MESSAGE //LUCAS
      console.log(message)
    }
  }


  if (giveway_rules.follow_provider) {
    try {
      await page2.click("#react-root > section > main > div > div > article > header > div.o-MQd.z8cbW > div.PQo_0.RqtMr > div.bY2yH > button")
      console.log("Subscribe")
      await page2.waitFor(2000)
    } catch (e) {
      console.log("Can't follow provider", e.message);
    }
    // FOLOW PROVIDER //LUCAS

  }

  if (giveway_rules.follow_mentioned) {
    try {

      const description = await page2.$eval("#react-root > section > main > div > div > article > div.eo2As > div.EtaWk > ul > div > li > div > div > div.C4VMK > span", elem => elem.innerText)
      const regex = /@[a-zA-Z-.-]{0,}/g
      var matches = []
      var match = regex.exec(description)
      while (match != null) {
        matches.push(match[0])
        match = regex.exec(description)
      }
      var user_to_follow = []
      var mention_without_dupicate = Array.from(new Set(matches))
      for (i = 0; i < mention_without_dupicate.length; i++) {
        let a = mention_without_dupicate[i].replace("@", "")
        user_to_follow.push(a)
      }
      console.log(user_to_follow)
    } catch (e) {
      console.log("Can't fetch description", e.message);
      notif_ds.add_D([Date.now().toString(), user_screen_name, "error", "Can't fetch description" + e.message])
      await browser.close()

      return

    }
    if (user_to_follow.length != 0) {
      for (var i in user_to_follow) {
        let mention = user_to_follow[i]
        await follow(browser, account_info, mention, notif_ds, user_screen_name)

      }

    }
  }
  if (giveway_rules.user_to_follow_man.length != 0) {

    let user_to_follow_man = []
    user_to_follow_man = giveway_rules.user_to_follow_man.split(" ");
    for (i in user_to_follow_man) {
      let follow_man = user_to_follow_man[i]
      await follow(browser, account_info, follow_man, notif_ds, user_screen_name)
    }

  }
  await browser.close()

}

module.exports.get_giveway_info = get_giveway_info
module.exports.start_giveway = start_giveway;