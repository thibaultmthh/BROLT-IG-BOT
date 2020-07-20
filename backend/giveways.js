const Twitter = require("twitter-lite")
//const Twitter = require('twit')

var url = require("url")
var querystring = require('querystring');


const puppeteer = require('puppeteer-extra')

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())





function get_giveway_info(link, app_ds, mainWindow) {
  if (link == null) {
    return
  }
  path_split_url = url.parse(link).pathname.split('/')
  id = path_split_url[path_split_url.length - 1]
  organiser_screen_name = path_split_url[path_split_url.length - 2]

  var app = app_ds.get_All()
  if (app.length < 1) {
    mainWindow.webContents.send("giveway_info", {
      errors: "Add some app/user first"
    });
    return 1
  }
  app = app[0]
  const api = new Twitter({
    consumer_key: app[1].consumer_key,
    consumer_secret: app[1].consumer_secret
  });

  api.getBearerToken().then(function(response) {
    const api = new Twitter({
      bearer_token: response.access_token
    });
    api.get("statuses/show", {
      id: id,
      include_entities: true,
      tweet_mode: "extended"
    }).then(function(data) {
      mainWindow.webContents.send("giveway_info", {
        user_mentioned: data.entities.user_mentions,
        hashtags: data.entities.hashtags,
        organiser_screen_name: data.user.screen_name,
        link: link,
        giveway_id: id,
        provider: data.user.id_str,

      });
    }).catch(function(error) {
      console.error;
      mainWindow.webContents.send("giveway_info", error);
    })
  })

}



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





function follow_someone(api, user_id, notif_ds) {
  console.log("follow done", user_id);
  api.post("friendships/create", {
    user_id: user_id
  }).catch((error) => {
    notif_ds.add_D([Date.now().toString(), user_screen_name, "error", error.message])
  });

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

async function puppeteer_comment(link, message, account_info, notif_ds) {
  const browser = await puppeteer.launch({

    args: ['--enable-features=NetworkService', "--proxy-server=" + account_info.proxyhost],
    ignoreHTTPSErrors: true,
    slowMo: 20,
    headless: false,
    executablePath: getChromiumExecPath()

  });
  const page = await browser.newPage();
  //await page.setRequestInterception(true);
  await page.authenticate({
    username: account_info.proxy_username,
    password: account_info.proxy_password,
  });
  try {
    await page.goto(link, {
      timeout: 100000
    });

  } catch (err) {

    notif_ds.add_D([Date.now().toString(), "X", "error", "While comment : " + err.message])
  }
  try {
    const [button_login] = await page.$x("//span[contains(., 'Log in')]");
    await button_login.click();

    await sleep(1202)
    await page.focus("input[name='session[username_or_email]']")
    await page.keyboard.type(account_info.username)
    await sleep(452)
    await page.focus("input[name='session[password]']")
    await page.keyboard.type(account_info.password)
    await page.keyboard.press('Enter');
    await sleep(15226)
    await page.click("#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > main > div > div > div > div > div > div:nth-child(2) > div > section > div > div > div > div:nth-child(1) > div > div > article > div > div > div > div:nth-child(3) > div.css-1dbjc4n.r-1oszu61.r-1gkumvb.r-1efd50x.r-5kkj8d.r-18u37iz.r-ahm1il.r-a2tzq0 > div:nth-child(1) > div");
    await sleep(781)
    page.keyboard.type(message)
    await sleep(54)
    const [button_reply] = await page.$x("//span[contains(., 'Reply')]");
    await button_reply.click();
    await sleep(3000)
    console.log("Success");
    await browser.close()



  } catch (err) {
    console.log("----Error : ", err);
    notif_ds.add_D([Date.now().toString(), "X", "error", "While comment : " + err.message])
  }
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








function take_giveway(giveway_data, user_screen_name, users_DS, giveways_ds, unstored_data, notif_ds, settings_ds, last) {
  let time_between_action = 14000
  let action_done = 0
  console.log("take on", user);

  if (last == true) {
    giveways_ds.set_done(giveway_data[0]);
    setTimeout(function() {
      unstored_data.set_D("giveways_state", 0)
    }, settings_ds.get_D("cooldown_giveaways") + (13 * 1000))
  }
  user = users_DS.get_D(user_screen_name)
  if (user == 0) {
    return 0
  }
  const api = new Twitter({
    consumer_key: user[2].consumer_key,
    consumer_secret: user[2].consumer_secret,
    access_token_key: user[2].access_token_key,
    access_token_secret: user[2].access_token_secret

  })
  screen_name = users_DS.get_All_screen_name()[0]
  giveway_rules = giveway_data[1]
  console.log(giveway_rules);
  if (giveway_rules.follow_provider) {
    console.log('follow provider')
    action_done++;
    setTimeout(function() {
      api.post("friendships/create", {
        user_id: giveway_rules.provider_id
      }).catch((error) => {
        notif_ds.add_D([Date.now().toString(), user_screen_name, "error", error.message])
      });
    }, time_between_action * action_done);
  }


  if (giveway_rules.need_like) {
    console.log("like")
    action_done++;
    setTimeout(function() {
      api.post("favorites/create", {
        id: giveway_rules.giveway_id
      }).catch((error) => {
        notif_ds.add_D([Date.now().toString(), user_screen_name, "error", error])
      });
    }, time_between_action * action_done);
  }

  if (giveway_rules.need_rt) {
    console.log("rt")
    action_done++;
    setTimeout(function() {
      api.post("statuses/retweet/" + giveway_rules.giveway_id, {
        id: giveway_rules.giveway_id
      }).catch((error) => {
        notif_ds.add_D([Date.now().toString(), user_screen_name, "error", error])
      });
    }, time_between_action * action_done);
  }
  if (giveway_rules.user_to_follow != 0) {
    for (var i in giveway_rules.user_to_follow) {
      user_id = giveway_rules.user_to_follow[i].id_str
      action_done++;
      console.log("followe", user_id)
      setTimeout(follow_someone, time_between_action * action_done, api, user_id, notif_ds);
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
    action_done++;
    if (message.length > 0) {
      setTimeout(function() {
        if (giveway_rules.without_proxy) {
          api.post("statuses/update", {
            status: message,
            in_reply_to_status_id: giveway_rules.giveway_id,
            auto_populate_reply_metadata: true
          }).catch((error) => {
            notif_ds.add_D([Date.now().toString(), user_screen_name, "error", error])
          });
        } else {
          console.log(user[2]);
          puppeteer_comment(giveway_rules.link, message, user[2].account_info, notif_ds)
        }


      }, time_between_action * action_done);
      console.log(message)
    }
  }

}




module.exports.get_giveway_info = get_giveway_info;
module.exports.start_giveway = start_giveway;
