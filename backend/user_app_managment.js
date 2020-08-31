const Twitter = require("twitter-lite")
var http = require('http')
var url = require("url")
var querystring = require('querystring')

const puppeteer = require('puppeteer-extra')

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())




function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function getChromiumExecPath() {
    return puppeteer.executablePath().replace('app.asar', 'app.asar.unpacked');
}

async function auto_add_acc(account_info, users_DS, mainWindow) {
  /*
  account_info = {
  proxyhost: "http://proxy.com:5555",
  proxy_username: "proxy_username",
  proxy_password: "proxy_password",
  username: "thibaultmthh",
  password: "xjxjxjx"

}
  */
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
    await page.goto("https://www.instagram.com/", {
      timeout: 100000
    });

  } catch (err) {
    mainWindow.webContents.send("new_user_state", {
      type: "error",
      message: err.message
    });
  }
  try {
    await page.waitFor(1000)
  // authentifiction
    await page.focus("input[name='username']")
    await page.keyboard.type(account_info.username)
    await page.focus("input[name='password']")
    await page.keyboard.type(account_info.password)
    await page.keyboard.press('Enter');
    await page.waitForNavigation({ waitUntil: 'networkidle0' })
    await page.waitFor(1000)
    console.log("ok");
    try {
      const elemText = await page.$eval("#react-root > section > main > article > div.rgFsT > div:nth-child(1) > h1", elem => elem.innerText)
      console.log("wrong password")
      mainWindow.webContents.send("new_user_state", {
        type: "error",
        message: "Password incorect "
      });
    } catch(err){
      mainWindow.webContents.send("new_user_state", {
        type: "success",
        message: "successfully added"
      });
      data_to_add = [account_info.username, "user_id_ups", account_info]
      users_DS.add_D(data_to_add)
    }

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


module.exports.auto_add_acc = auto_add_acc;
module.exports.add_new_app = add_new_app;
