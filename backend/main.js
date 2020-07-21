// Modules to control application life and create native browser window

//Electron modules
const {
  app,
  BrowserWindow
} = require('electron')
const ipc = require('electron').ipcMain;
const {
  autoUpdater
} = require("electron-updater");

//module perso
const Twitter = require("twitter-lite")

//http modules
var http = require('http');
var url = require("url")
var querystring = require('querystring');
//require('electron-reload')(__dirname);
const request = require("request")


//modules perso
const {
  auto_add_acc,
  add_new_app
} = require("./user_app_managment.js")
const {
  Users_DS,
  App_DS,
  Giveways_DS,
  Settings_DS,
  Unstored_DS,
  Notif_DS
} = require("./data_managment.js")
const {
  get_giveway_info,
  start_giveway
} = require("./giveways.js")
const activate = require("./activation.js")
const {
  get_perso_id,
  send_alive
} = require("./analytics.js")
const {
  check_all_notifs
} = require("./notifs.js")

//declaration classes perso
const unstored_data = new Unstored_DS()
const users_DS = new Users_DS()
const giveways_ds = new Giveways_DS()
const notif_ds = new Notif_DS()
const settings_ds = new Settings_DS()
const app_ds = new App_DS()


const {
  LexActivator,
  PermissionFlags,
  LexActivatorException,
  LexStatusCodes
} = require("@cryptlex/lexactivator")

function activate2(key, settings_ds) {
  return [1, 'License activated successfully!'];
  if (key == "") {
    key = settings_ds.get_D("key")
  }

  LexActivator.SetProductData("MTQ3RkFBQ0VCNTU0NUIwNUNENjhFMjNFRDc2NDJCMDk=.oiGuXjPN/rPHtoFGk8jXtc3nSXmtG8vQGpdx+wTgjt4K0vd3gZ5LLRn0lC03ZUS3pLUxOPDjJ7rtAPOp3bAcAO85ZFNZohbYBFDfrPFLa4lDSY3hZqay+C1fZ6myE+dyIKDIzw9AvPmSX+nxXp9YCNxNmtp3BAWiuy+GNMOVh17lB0BHhJV5dFMPRqEhzi5xc/R+QeZ3nXRMD1GyKypdN5z8sJRImw/G6oshiCXYOLqElRNCGrlOY7uiAU1sYqxtVDIzLvNkfUCmCSD3xEdEe2TKEQZ7ioH8g/d60xkszywMCehaPBw8n5ySfQAai+xwaSc+BZjV8529KuUWS7Bqkeb4wSWaJBqp1m4Dxz8S/6PHBgT3vncdoU6Th2gRcdq8GFAMaekTMH0qTD0s0gA0/yR3cOvjCPGISMZZC/e6miKsDNLBSSOBBpS90/PVFUC/oZyGeUx6P9vW3SPYbDXAZnz90Sj0/epPlYspS0EbXouDyHfcOlAAEq7fgU54l0p7ukkqi56XJOKZu7TD8dYi+kyRtP9P4/PP5EMHQXrJeYfW8MV3CCCpEBCMo76U3Z9fsjPiCVf+LSzj1CbUqg7QUg1kyfZqOYU0IAVFShdjUngQCvEOfA3JNMxs/opksGqZVj8hDGTuwGKD3WW+ciKjJEISndzr6xZ2nKuKBVKDpd/aFh0LeiXSxw4kwcj917LPMqut5M6HzW/dRTQEWHIHIM3ZWQ+wVaJhy+ViGMGoSOs=");
  LexActivator.SetProductId("09caaf9b-d55d-45dd-8f09-665a070098ac", PermissionFlags.LA_USER);
  try {
    LexActivator.SetLicenseKey(key);
    LexActivator.SetActivationMetadata('key1', 'value1');
    const status = LexActivator.ActivateLicense();
    if (LexStatusCodes.LA_OK == status) {
      settings_ds.add_D("key", key)
      return [1, 'License activated successfully!'];

    } else if (LexStatusCodes.LA_EXPIRED == status) {
      return [0, 'License activated successfully but has expired!'];
    } else if (LexStatusCodes.LA_SUSPENDED == status) {
      return [0, 'License activated successfully but has been suspended!'];
    }
  } catch (error) {
    return [0, error.message, error.code];
  }
}


/*
var server = http.createServer(function(req, res) {
  var params = querystring.parse(url.parse(req.url).query);
  var page = url.parse(req.url).pathname;

  if (page == "/callback") {
    const client = new Twitter({
      consumer_key: app_ds.get_D(unstored_data.get_D("last_app"))[1].consumer_key,
      consumer_secret: app_ds.get_D(unstored_data.get_D("last_app"))[1].consumer_secret
    });
    client
      .getAccessToken({
        oauth_verifier: params.oauth_verifier,
        oauth_token: params.oauth_token
      })
      .then(function(res_twtt) {
        data_to_add = [res_twtt.screen_name, res_twtt.user_id, {
          consumer_key: client.config.consumer_key,
          consumer_secret: client.config.consumer_secret,
          access_token_key: res_twtt.oauth_token,
          access_token_secret: res_twtt.oauth_token_secret,
          app_name: unstored_data.get_D("last_app"),
          account_info: unstored_data.get_D("last_account")
        }]
        console.log(data_to_add);
        users_DS.add_D(data_to_add)
        res.writeHead(200, {
          "Content-Type": "text/plain"
        });
        res.write("Done, you can close this windows now")
        res.end()
      })
      .catch(console.error);
  }
});
server.listen(5000);
*/



function send_activity() {
  send_alive(get_perso_id(settings_ds))

}
send_activity()






function security() {
  if (activate2("", settings_ds)[0] == 0) {
    app.quit()
  }
}





function app_window() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 1000,
    frame: false,
    movable: true,
    backgroundColor: "#091821",
    webPreferences: {
      nodeIntegration: true,
      affinity: "window"
    }

  })
  mainWindow.setResizable(false)

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })
  // and load the index.html of the app.
  mainWindow.loadFile('./frontend/Giveaways.html')
  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  return mainWindow
}

function activation_windows() {
  const mainWindow = new BrowserWindow({
    width: 450,
    height: 200,
    frame: false,
    movable: true,
    webPreferences: {
      nodeIntegration: true,
      affinity: "window"
    }



  })

  mainWindow.setResizable(false)

  // and load the index.html of the app.
  mainWindow.loadFile('./frontend/Activation.html')
  return mainWindow

}






function main() {
  var mainWindow
  if (activate("", settings_ds)[0] == 0) {
    mainWindow = activation_windows()
  } else {
    mainWindow = app_window()
    setInterval(security, 200000)
    setInterval(start_giveway, 4000, giveways_ds, users_DS, unstored_data, notif_ds, settings_ds)
    notif_ds.clear_All()
    check_all_notifs(users_DS, notif_ds,settings_ds)
    setInterval(check_all_notifs, 360000, users_DS, notif_ds, settings_ds)
    giveways_ds.clear_running()


  }

  //all
  ipc.on("close_app", (event, data) => {
    app.quit()
  })

  //activation window
  ipc.on('check_key', function(event, data) {
    let activate_status = activate(data, settings_ds)
    console.log(activate_status);
    if (activate_status[0] == 0) {
      console.log(data);
      event.sender.send("back_check_key", activate_status[1])


    } else {
      mainWindow.close()
      mainWindow = null
      mainWindow = app_window()
    }
  })


  //Giveaway windows
  //display giveways
  ipc.on("get_all_giveways", (event, data) => {
    mainWindow.webContents.send("all_giveways_value", giveways_ds.get_All())
  })

  //set new giveways
  ipc.on("get_giveway_info", (event, data) => {
    get_giveway_info(data, app_ds, mainWindow)
  })

  ipc.on("add_new_giveway", (event, data) => {
    giveways_ds.add_D(data[0], data[1])
  })
  ipc.on("delete_app_giveway", (event, data) => {
    giveways_ds.remove_D(data)
  })


  //bot managment window (add new user)
  ipc.on("add_account", (event, data) => {
    console.log("go add", data);
    auto_add_acc(data, users_DS, mainWindow)
  })

  ipc.on("get_all_app_name", (event, data) => {
    mainWindow.webContents.send("all_app_name", app_ds.get_All_app_name())
  })
  //display all bots
  ipc.on("get_bot_list", (event, data) => {
    mainWindow.webContents.send("bot_list", users_DS.get_All())
  })
  ipc.on("delete_account", (event, data) => {
    users_DS.remove_D(data)
  })


  //app managment window
  ipc.on("get_app_list", (event, data) => {
    mainWindow.webContents.send("app_list", app_ds.get_All())
  })
  ipc.on("delete_app", (event, data) => {
    app_ds.remove_D(data)
  })

  ipc.on("add_new_app", (event, data) => {
    add_new_app(data[0], data[1], app_ds, mainWindow)
  })

  //notif window
  ipc.on("get_list_notif", (event, data) => {
    mainWindow.webContents.send("list_notif", notif_ds.get_All())
  })

  ipc.on("win_notification", (event, data) => {
    let notif_data = data


  })



  //settings window
  ipc.on("get_settings", (event, data) => {
    mainWindow.webContents.send("all_settings", settings_ds.get_All())
  })
  ipc.on("set_settings", (event, data) => {
    settings_ds.add_D(data.key, data.data)
  })

  ipc.on("set_webhook", (event, data) => {
    console.log("set_webhook");
    let perso_id = settings_ds.get_D("perso_id");
    let webhook_url = data;
    request.post('http://api.seigrobotics.com:5000/set_webhook', {
      json: {
        webhook_url: webhook_url,
        user_id: perso_id,
      }
    }, (error, res, body) => {})
    let mention_data = {
      date: "28/10/2015",
      text: "That test was successfully failed",
      by: "Marty",
      on: "",
      id: "test_webhook",
      type: "mention"
    }
    request.post('http://api.seigrobotics.com:5000/win_notification', {
      json: {
        notif_data: mention_data,
        user_id: perso_id,
      }
    }, (error, res, body) => {})
  })
}


autoUpdater.on('update-downloaded', (ev, info) => {
  // Wait 5 seconds, then quit and install
  // In your application, you don't need to wait 5 seconds.
  // You could call autoUpdater.quitAndInstall(); immediately
  setTimeout(function() {
    autoUpdater.quitAndInstall();
  }, 5000)
})

app.on('ready', function() {
  autoUpdater.checkForUpdates();
});
autoUpdater.on('checking-for-update', () => {
  console.log("check");
})
autoUpdater.on('update-available', (ev, info) => {
  console.log("update avaliav");
})
autoUpdater.on('update-not-available', (ev, info) => {
  console.log("non avaliable update");
})
autoUpdater.on('error', (ev, err) => {
  console.log("error in updater ");
})

app.whenReady().then(main)
// Quit when all windows are closed.
app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function() {
  if (BrowserWindow.getAllWindows().length === 0) main()
})
