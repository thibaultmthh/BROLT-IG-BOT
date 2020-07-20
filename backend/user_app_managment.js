const Twitter = require("twitter-lite")
var http = require('http')
var url = require("url")
var querystring = require('querystring')

const puppeteer = require('puppeteer-extra')

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())


function get_redirect_url(data, app_ds, account_info, mainWindow) {
  var app_name = data.appname
  console.log("X" + app_name + "X");
  app = app_ds.get_D(app_name)
  console.log(app);
  let client_get = new Twitter({
    consumer_key: app[1].consumer_key,
    consumer_secret: app[1].consumer_secret
  });
  if (app[1].callback === undefined) {
    var callback = "http://127.0.0.1:5000/callback"
  } else {
    var callback = app[1].callback
  }
  let responce
  responce = client_get.getRequestToken(callback)
    .then(function(res) {
      url = "https://api.twitter.com/oauth/authenticate?oauth_token=" + res.oauth_token
      console.log(url);
      auto_add_acc(url, data, mainWindow)
    })
    .catch(function(error) {
      console.log(error);
      mainWindow.webContents.send("new_user_state", {
        type: "error",
        message: "cant get url"
      });

    })
  return responce

}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function getChromiumExecPath() {
    return puppeteer.executablePath().replace('app.asar', 'app.asar.unpacked');
}

async function auto_add_acc(redirect_url, account_info, mainWindow) {
  const browser = await puppeteer.launch({

    args: ['--enable-features=NetworkService', "--proxy-server=" + account_info.proxyhost],
    ignoreHTTPSErrors: true,
    slowMo: 14,
    headless: true,
    executablePath: getChromiumExecPath()

  });
  mainWindow.webContents.send("new_user_state", {
    type: "info",
    message: "Wait ..."
  });
  const page = await browser.newPage();
  //await page.setRequestInterception(true);
  await page.authenticate({
    username: account_info.proxy_username,
    password: account_info.proxy_password,
  });
  try {
    await page.goto(redirect_url, {
      timeout: 100000
    });

  } catch (err) {
    mainWindow.webContents.send("new_user_state", {
      type: "error",
      message: err.message
    });
  }
  try {
    await page.focus('#username_or_email')
    await page.keyboard.type(account_info.username);
    await sleep(1023)

    await page.focus('#password')
    await page.keyboard.type(account_info.password);
    await sleep(1023)

    await page.click("#allow")
    await sleep(7000)
    await browser.close();

    mainWindow.webContents.send("new_user_state", {
      type: "success",
      message: "successfully added"
    });
    await browser.close()
  } catch (err) {
    mainWindow.webContents.send("new_user_state", {
      type: "error",
      message: err.message
    });
    await browser.close()

  }


}









function add_new_app(name, tokens, app_ds, mainWindow) {
  console.log(name, tokens, app_ds);
  let api = new Twitter({
    consumer_key: tokens.consumer_key,
    consumer_secret: tokens.consumer_secret
  });
  api.getRequestToken(tokens.callback)
    .then(function(res) {
      app_ds.add_D([name, {
        consumer_key: tokens.consumer_key,
        consumer_secret: tokens.consumer_secret,
        callback: tokens.callback,
        bot_on_it: 0
      }]);
      mainWindow.webContents.send("add_app_error", "good");
    })
    .catch(function(error) {
      mainWindow.webContents.send("add_app_error", error);
    })

}


module.exports.get_redirect_url = get_redirect_url;
module.exports.add_new_app = add_new_app;
