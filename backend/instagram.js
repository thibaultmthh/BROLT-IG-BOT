async function login(browser, account_info, notif_ds, user_screen_name) {
  console.log("In login");
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

    return

  }

  try {
    const elemText = await page_auth.$eval("#react-root > section > main > article > div.rgFsT > div:nth-child(1) > h1", elem => elem.innerText)
    console.log("wrong password")
    notif_ds.add_D([Date.now().toString(), user_screen_name, "error", "Wrong password"])
    await browser.close()
    return


  } catch (err) {
    console.log("log in")
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





module.exports.login = login
module.exports.like = like
module.exports.follow = follow