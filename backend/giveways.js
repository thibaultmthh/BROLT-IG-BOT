const Twitter = require("twitter-lite")
//const Twitter = require('twit')

var url = require("url")
var querystring = require('querystring');


const puppeteer = require('puppeteer-extra')

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())


function start_giveway(giveways_ds, users_DS, unstored_data, notif_ds, settings_ds) {
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
    if (i == all_user.length - 1) {
      last = true
    } else {
      last = false
    }
    setTimeout(take_giveway, delay_between_participate * i, giveway_data, user, users_DS, giveways_ds, unstored_data, notif_ds, settings_ds, last)


  }
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


  if (last == true) {
    giveways_ds.set_done(giveway_data[0]);
    setTimeout(function() {
      unstored_data.set_D("giveways_state", 0)
    }, settings_ds.get_D("cooldown_giveaways") + (13 * 1000))
  }
  let user = users_DS.get_D(user_screen_name)
  console.log("take on", user);

  if (user == 0) {
    return 0
  }

  screen_names = users_DS.get_All_screen_name()[0]
  let giveway_rules = giveway_data[1]
  let account_info = user[2]

  const browser = await puppeteer.launch({

    args: ['--enable-features=NetworkService', "--proxy-server=" + account_info.proxyhost],
    ignoreHTTPSErrors: true,
    slowMo: 20,
    headless: false,
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
    notif_ds.add_D([Date.now().toString(), user_screen_name, "error", "Cant connect" + e.message])
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

    await page_auth.waitForNavigation({
      waitUntil: 'networkidle0'
    })
  } catch (e) {
    console.log("Cant find connextion form", e.message);
    notif_ds.add_D([Date.now().toString(), user_screen_name, "error", "Cant find connextion form" + e.message])
    return

  }

  try {
    const elemText = await page_auth.$eval("#react-root > section > main > article > div.rgFsT > div:nth-child(1) > h1", elem => elem.innerText)
    console.log("wrong password")
    notif_ds.add_D([Date.now().toString(), user_screen_name, "error", "Wrong password"])

  } catch (err) {
    console.log("log in")
  }


  const page2 = await browser.newPage()
  await page2.authenticate({
    username: account_info.proxy_username,
    password: account_info.proxy_password,
  });

  try {
    await page2.goto(giveway_rules.link)
    const description = await page2.$eval("#react-root > section > main > div > div > article > div.eo2As > div.EtaWk > ul > div > li > div > div > div.C4VMK > span", elem => elem.innerText)
    const regex = /@[a-zA-Z-.-_]{0,}/g
    var matches = []
    var match = regex.exec(description)
    while (match != null) {
      matches.push(match[0])
      match = regex.exec(description)
    }
    let user_to_follow = []
    var mention_without_dupicate = Array.from(new Set(matches))
    for (i = 0; i < mention_without_dupicate.length; i++) {
      let a = mention_without_dupicate[i].replace("@", "")
      user_to_follow.push(a)
    }
    console.log(mention_without_dupicate)
    console.log(user_to_follow)
  } catch (e) {
    console.log("Can't fetch description", e.message);
    notif_ds.add_D([Date.now().toString(), user_screen_name, "error", "Can't fetch description" + e.message])
    return

  }
  console.log("new page")
  await page2.waitFor(5000)


  if (giveway_rules.need_like) {
    // NEED LIKE //LUCAS
    try {
      await page2.click("#react-root > section > main > div > div > article > div.eo2As > section.ltpMr.Slqrh > span.fr66n > button")
      console.log("liked")
      await page2.waitFor(2000)
    } catch (e) {
      console.log("Cant like", e.message);
      notif_ds.add_D([Date.now().toString(), user_screen_name, "error", "Cant like" + e.message])

    }
  }

  if (giveway_rules.tag_friend) {
    console.log("tag fiend");
    let random_screen_name = []
    let all_screen_name = shuffle(users_DS.get_All_screen_name())
    all_screen_name.forEach(function(item) {
      console.log(random_screen_name.length, giveway_rules.nb_friend_to_tag)
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
        console.log("commented")
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
      console.log("subsciber")
      await page2.waitFor(2000)
    } catch (e) {
      console.log("Can't follow provider", e.message);
    }
    // FOLOW PROVIDER //LUCAS

  }

  if (user_to_follow.length != 0 && giveway_rules.follow_mentioned) {
    for (var i in user_to_follow) {
      let mention = user_to_follow[i]
      const page = await browser.newPage()
      await page.authenticate({
        username: account_info.proxy_username,
        password: account_info.proxy_password,
      });
      await page.goto("https://www.instagram.com/" + mention)
      try {
        const elemText = await page.$eval("#react-root > section > main > div > header > section > div.Y2E37 > button", elem => elem.innerText)
        console.log("already subscribed to : " + mention)
      } catch (err) {
        //await page.click("#react-root > section > main > div > header > section > div.Y2E37 > button")
        const [button_login] = await page.$x("//button[contains(., 'Follow')]");
        console.log(button_login);
        await button_login.click();
        console.log("subsciber to : " + mention)
      }
      //FOLOW USER //LUCAS
    }
  }
  await page_auth.waitFor(2000)
  await browser.close()

}

module.exports.start_giveway = start_giveway;
