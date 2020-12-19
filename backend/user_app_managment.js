var http = require('http')
var url = require("url")
var querystring = require('querystring')
const fs = require('fs').promises;
const fsS = require('fs');
const electron = require('electron');


//Module csv
const csv = require('csv-parser');



const cookies_path = (electron.app || electron.remote.app).getPath('userData') + "/cookies/";


if (!fsS.existsSync(cookies_path)) {
  fsS.mkdirSync(cookies_path);
}

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

async function auto_add_acc(account_info, users_DS, mainWindow, settings_ds) {
  /*
  account_info = {
  proxyhost: "http://proxy.com:5555",
  proxy_username: "proxy_username",
  proxy_password: "proxy_password",
  username: "thibaultmthh",
  password: "xjxjxjx"

}
  */
  let args = ['--enable-features=NetworkService', "--proxy-server=" + account_info.proxyhost]
  console.log(args);
  const browser = await puppeteer.launch({

    args: args,
    ignoreHTTPSErrors: true,
    slowMo: 30,
    headless: false,
    executablePath: getChromiumExecPath()

  });
  mainWindow.webContents.send("new_user_state", {
    type: "info",
    message: "Wait ..."
  });
  const page = await browser.newPage();
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
    const [button_accept] = await page.$x("//button[contains(., 'Accept')]"); //click on save info
    if (button_accept) {
      await button_accept.click();
    }
    // authentifiction
    await page.focus("input[name='username']")
    await page.keyboard.type(account_info.username)
    await page.focus("input[name='password']")
    await page.keyboard.type(account_info.password)
    await page.keyboard.press('Enter');
    await page.waitForNavigation({
      waitUntil: 'networkidle0'
    })
    await page.waitFor(1000)
    console.log("ok");
    try {
      const elemText = await page.$eval("#react-root > section > main > article > div.rgFsT > div:nth-child(1) > h1", elem => elem.innerText)
      console.log("wrong password")
      mainWindow.webContents.send("new_user_state", {
        type: "error",
        message: "Password incorect "
      });
    } catch (err) {
      await page.waitFor(1000)
      let regex1 = new RegExp('two_factor|challenge');
      let url = page.url()
      if (regex1.test(url) == true) {
        await page.waitFor(100000)

        for (var i = 0; i < 100; i++) {
          await page.waitFor(2000);
          if (i == 98) {
            console.log("ERROR : ", "Challenge not completed");
            mainWindow.webContents.send("new_user_state", {
              type: "error",
              message: "Challenge not completed"
            });
            await browser.close()
            return
          }
          if (regex1.test(page.url())) {
            break
          }

        }

      }

      mainWindow.webContents.send("new_user_state", {
        type: "success",
        message: "successfully added"
      });
      data_to_add = [account_info.username, "user_id_ups", account_info]
      users_DS.add_D(data_to_add)
    }

    const [button_save] = await page.$x("//button[contains(., 'Save Info')]"); //click on save info
    if (button_save) {
      await button_save.click();
    }
    await page.waitForNavigation({
      waitUntil: 'networkidle0'
    })
    const cookies = await page.cookies();
    await fs.writeFile(cookies_path + 'cookies_' + account_info.username + '.json', JSON.stringify(cookies, null, 2));

    await page.waitFor(400)

    await browser.close()
  } catch (err) {
    mainWindow.webContents.send("new_user_state", {
      type: "error",
      message: err.message
    });
    await browser.close()

  }


}



async function auto_add_multiple_acc(fichier_path, users_DS, mainWindow, settings_ds) {
  console.log("add multiple accounts");

  fsS.createReadStream(fichier_path)
    .pipe(csv())
    .on('data', (row) => {
      console.log(row);
      data = {
        proxyhost: row.proxyhost,
        proxy_username: row.proxy_username,
        proxy_password: row.proxy_password,
        username: row.username,
        password: row.password
      };

      //console.log(row.proxyhost==undefined);

      if (row.proxyhost == undefined) {
        data = {
          proxyhost: "",
          proxy_username: data.proxy_username,
          proxy_password: data.proxy_password,
          username: row.username,
          password: row.password
        }
      }

      if (row.proxy_username == undefined) {
        data = {
          proxyhost: data.proxyhost,
          proxy_username: "",
          proxy_password: data.proxy_password,
          username: row.username,
          password: row.password
        }
      }

      if (row.proxy_password == undefined) {
        data = {
          proxyhost: data.proxyhost,
          proxy_username: data.proxy_username,
          proxy_password: "",
          username: row.username,
          password: row.password
        }
      }
      try {
        auto_add_acc(data, users_DS, mainWindow, settings_ds);

      } catch (e) {
        mainWindow.webContents.send("new_user_state", {
          type: "error",
          message: err.message
        });
      }
      //waiting time
    })
    .on('end', () => {
      console.log('CSV file successfully processed');
    });
}







function add_new_app(name, tokens, app_ds, mainWindow) {
  console.log(name, tokens, app_ds);
  let api = new Twitter({
    consumer_key: tokens.consumer_key,
    consumer_secret: tokens.consumer_secret
  });
  api.getRequestToken(tokens.callback)
    .then(function (res) {
      app_ds.add_D([name, {
        consumer_key: tokens.consumer_key,
        consumer_secret: tokens.consumer_secret,
        callback: tokens.callback,
        bot_on_it: 0
      }]);
      mainWindow.webContents.send("add_app_error", "good");
    })
    .catch(function (error) {
      mainWindow.webContents.send("add_app_error", error);
    })

}


module.exports.auto_add_acc = auto_add_acc;
module.exports.add_new_app = add_new_app;
module.exports.auto_add_multiple_acc = auto_add_multiple_acc;