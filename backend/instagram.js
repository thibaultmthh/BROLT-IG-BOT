const fsP = require('fs').promises;
const fs = require('fs')
const electron = require('electron');
const cookies_path = (electron.app || electron.remote.app).getPath('userData') + "/cookies_i/";

console.log(cookies_path);
if (!fs.existsSync(cookies_path)) {
  console.log("existe paaaaa");
  fs.mkdirSync(cookies_path);
}




const puppeteer = require('puppeteer-extra')
// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

function getChromiumExecPath() {
  return puppeteer.executablePath().replace('app.asar', 'app.asar.unpacked');
}



async function login(browser, account_info, notif_ds, user_screen_name) {
  console.log("In login");

  const page_auth = await browser.newPage()
  await page_auth.authenticate({
    username: account_info.proxy_username,
    password: account_info.proxy_password,
  });



  try {
    const cookiesString = await fsP.readFile(cookies_path + 'cookies_' + user_screen_name + '.json');
    var cookies = JSON.parse(cookiesString);
    await page_auth.setCookie(...cookies);
    page_auth.goto("https://www.instagram.com/direct/inbox/")
    await page_auth.waitForNavigation({
      waitUntil: 'networkidle0'
    })
    let url = page_auth.url()
    let regex1 = new RegExp('accounts');
    if (regex1.test(url)) {

    } else {
      console.log("successfully logged in with cookies");
      var cookies_2 = await page_auth.cookies();
      await fsP.writeFile(cookies_path + 'cookies_' + account_info.username + '.json', JSON.stringify(cookies_2, null, 2));
      return page_auth
    }

  } catch (e) {
    console.log(e.message)
  }

  try {
    console.log("plan B de connection");
    await page_auth.goto("https://www.instagram.com/")
  } catch (e) {
    console.log("Cant connect" + e.message);
    notif_ds.add_D([Date.now().toString(), user_screen_name, "error", "Cant connect" + e.message])
    await browser.close()
    return page_auth
  }

  await page_auth.waitFor(2000)
  const [button_accept] = await page_auth.$x("//button[contains(., 'Accept')]"); //click on save info
  if (button_accept) {
    await button_accept.click();
  }
  // authentifiction
  try {
    await page_auth.focus("input[name='username']")
    await page_auth.keyboard.type(account_info.username)
    await page_auth.focus("input[name='password']")
    await page_auth.keyboard.type(account_info.password)
    await page_auth.keyboard.press('Enter');
    try {
      await page_auth.waitForNavigation({
        waitUntil: 'networkidle0'
      })
    } catch (e) {
      await page_auth.waitFor(3000)
      await page_auth.keyboard.press('Enter');
      await page_auth.waitForNavigation({
        waitUntil: 'networkidle0'
      })
      await page_auth.waitFor(800)
    }


  } catch (e) {
    console.log("Cant find connextion form", e.message);
    notif_ds.add_D([Date.now().toString(), user_screen_name, "error", "Cant find connextion form" + e.message])
    await browser.close()

    return page_auth

  }

  try {
    const elemText = await page_auth.$eval("#react-root > section > main > article > div.rgFsT > div:nth-child(1) > h1", elem => elem.innerText)
    console.log("wrong password")
    notif_ds.add_D([Date.now().toString(), user_screen_name, "error", "Wrong password"])
    await browser.close()
    return page_auth


  } catch (err) {
    const [button_save] = await page_auth.$x("//button[contains(., 'Save Info')]"); //click on save info
    if (button_save) {
      await button_save.click();
    }
    await page_auth.waitForNavigation({
      waitUntil: 'networkidle0'
    })
    console.log("log in")
    const cookies = await page_auth.cookies();
    await fsP.writeFile(cookies_path + 'cookies_' + account_info.username + '.json', JSON.stringify(cookies, null, 2));
    await page_auth.waitFor(400)
    return page_auth
  }




}


async function like(page, notif_ds, user_screen_name) {
  try {
    await page.click("#react-root > section > main > div > div > article > div.eo2As > section.ltpMr.Slqrh > span.fr66n > button")
    console.log("Liked")
    await page.waitFor(2000)
  } catch (e) {
    console.log("Cant like", e.message);
    notif_ds.add_D([Date.now().toString(), user_screen_name, "error", "Cant like" + e.message])
  }
}

async function follow(browser, account_info, mention, notif_ds, user_screen_name) {
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
    try {
      const [button_login] = await page.$x("//button[contains(., 'Follow')]");
      console.log(button_login);
      await button_login.click();
      console.log("subsciber to : " + mention)
    } catch (e) {
      console.log("Can't follow ", mention);
    }

  }
  //FOLOW USER //LUCAS

}

async function open_dm_page(users_DS, notif_ds, user_screen_name) {

  let user = users_DS.get_D(user_screen_name)
  let account_info = user[2]

  const browser = await puppeteer.launch({

    args: ['--enable-features=NetworkService', "--proxy-server=" + account_info.proxyhost],
    ignoreHTTPSErrors: true,
    slowMo: 25,
    headless: false,
    executablePath: getChromiumExecPath()

  });
  let page = await login(browser, account_info, notif_ds, user_screen_name)
  if (page.url() == "https://www.instagram.com/direct/inbox/") {

  } else {
    page.goto("https://www.instagram.com/direct/inbox/")
  }




}


module.exports.open_dm_page = open_dm_page
module.exports.login = login
module.exports.like = like
module.exports.follow = follow
