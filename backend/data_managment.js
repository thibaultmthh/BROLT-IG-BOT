const Store = require("electron-store")


class Users_DS extends Store {
  constructor() {
    super()
    this.data_name = "user_list"
    this.datas = this.get(this.data_name) || [] // [screen_name, {user_id, tokens(json), app_name, state:good/bad}, ...]
    //this.datas = []

  }
  get_D(user_screen_name) {
    for (var index_user in this.datas) {
      if (this.datas.hasOwnProperty(index_user)) {
        if (this.datas[index_user][0] == user_screen_name) {
          return this.datas[index_user]
        }
      }
    }
    console.log(user_screen_name, "no found in database");
    return 0
  }

  get_All(){return this.datas}
  get_All_screen_name(){let responce=[];  for (var index_user in this.datas){responce.push(this.datas[index_user][0])} return responce }
  get_All_ids(){let responce=[];  for (var index_user in this.datas){responce.push(this.datas[index_user][1])} return responce }


  add_D(user_datas) {
    console.log("add user", user_datas);
    if (this.get_D(user_datas[0]) == 0) {
      this.datas.push(user_datas)
      console.log(user_datas, "added")
    } else {

      for (var index_user in this.datas) {
        if (this.datas.hasOwnProperty(index_user)) {
          if (this.datas[index_user][0] == user_datas[0]) {
            this.datas[index_user] = user_datas
            console.log(user_datas, "replace a last one");
          }
        }
      }
    }

    this.set(this.data_name, this.datas)
  }

  remove_D(user_screen_name) {
    if (this.get_D(user_screen_name) === undefined) {

    } else {

      for (var index_user in this.datas) {
        if (this.datas.hasOwnProperty(index_user)) {
          if (this.datas[index_user][0] == user_screen_name) {
            this.datas.splice(index_user, 1)
          }
        }
      }
    }

    this.set(this.data_name, this.datas)
  }

}




class Giveways_DS extends Store {
  constructor() {
    super()
    this.data_name = "giveways_data"
    this.datas = this.get(this.data_name) || [] // [id, data{user_to_follow, follow_provider, text_to_add, like, rt, link} , status, add_timestamps]
    //this.datas = [["a"],["b"],["be"]]
    //this.datas = []

  }

  get_D(giveway_id) {
    for (var index_user in this.datas) {
      if (this.datas.hasOwnProperty(index_user)) {
        if (this.datas[index_user][0] == giveway_id) {
          return this.datas[index_user]
        }
      }
    }
  }
  get_All(){return this.datas}

  add_D(giveway_id, datas) {
    if (datas == null){return 1}
    if (this.get_D(giveway_id) === undefined) {
      this.datas.push([giveway_id, datas, 0, Math.floor(Date.now() / 1000)])
      console.log("giveways add", giveway_id, datas);
    } else {

      for (var index_user in this.datas) {
        if (this.datas.hasOwnProperty(index_user)) {
          if (this.datas[index_user][0] == giveway_id) {
            this.datas[index_user] = [giveway_id, datas, 0, Math.floor(Date.now() / 1000)]
            console.log("giveways add", giveway_id, datas);

          }
        }
      }
    }

    this.set(this.data_name, this.datas)
  }

  remove_D(giveway_id) {
    if (this.get_D(giveway_id) === undefined) {

    } else {

      for (var index_user in this.datas) {
        if (this.datas.hasOwnProperty(index_user)) {
          if (this.datas[index_user][0] == giveway_id) {
            this.datas.splice(index_user, 1)
          }
        }
      }
    }

    this.set(this.data_name, this.datas)
  }

  set_done(giveway_id) {
    if (this.get_D(giveway_id) === undefined) {
      return "no giveways at this id"
    } else {

      for (var index_user in this.datas) {
        if (this.datas.hasOwnProperty(index_user)) {
          if (this.datas[index_user][0] == giveway_id) {
            this.datas[index_user] = [this.datas[index_user][0], this.datas[index_user][1], 1, this.datas[index_user][3]]
          }
        }
      }
    }

    this.set(this.data_name, this.datas)
  }
  set_running(giveway_id) {
    if (this.get_D(giveway_id) === undefined) {
      return "no giveways at this id"
    } else {

      for (var index_user in this.datas) {
        if (this.datas.hasOwnProperty(index_user)) {
          if (this.datas[index_user][0] == giveway_id) {
            this.datas[index_user] = [this.datas[index_user][0], this.datas[index_user][1], 2, this.datas[index_user][3]]
          }
        }
      }
    }

    this.set(this.data_name, this.datas)
  }

  clear_running(){
    let running = this.get_running()
    for (var i in running){
      let e = running[i][0]
      this.set_done(e)

    }
  }


  get_done() {
    let done_giveway = []
    for (var index_user in this.datas) {
      if (this.datas.hasOwnProperty(index_user)) {
        if (this.datas[index_user][2] == 1) {
          done_giveway.push(this.datas[index_user])
        }
      }
    }
    return done_giveway
  }
  get_not_done() {
    let done_giveway = []
    for (var index_user in this.datas) {
      if (this.datas.hasOwnProperty(index_user)) {
        if (this.datas[index_user][2] == 0) {
          done_giveway.push(this.datas[index_user])
        }
      }
    }
    return done_giveway
  }
  get_running() {
    let done_giveway = []
    for (var index_user in this.datas) {
      if (this.datas.hasOwnProperty(index_user)) {
        if (this.datas[index_user][2] == 2) {
          done_giveway.push(this.datas[index_user])
        }
      }
    }
    return done_giveway
  }


}





class Notif_DS extends Store {
  constructor() {
    super()
    this.data_name = "notif_save"
    this.defaut =
      this.datas = this.get(this.data_name) || [] // [source (user or system), type(dm, mention, error), datas{message, date, ect}]
    //this.datas = [["a"],["b"],["be"]]

  }
  get_D(notif_id) {
    for (var index_user in this.datas) {
      if (this.datas.hasOwnProperty(index_user)) {
        if (this.datas[index_user][0] == notif_id) {
          return this.datas[index_user]
        }
      }
    }
  }



  get_All(){return this.datas}
  clear_All(){this.datas = [];this.set(this.data_name, this.datas)}

  add_D(datas_notif) {
    if (this.get_D(datas_notif[0]) === undefined) {
      this.datas.push(datas_notif)
    }

    this.set(this.data_name, this.datas)
  }


}





class Settings_DS extends Store {
  constructor() {
    super()
    this.data_default = {
      "key": "",
      "cooldown_giveaways":190000,
      "cooldown_account":50000,
      "webhook_url": ""
    }
    this.data_name = "setings"
    this.datas = this.get(this.data_name) || this.data_default // [screen_name, tokens(json), ...]
    console.log(this.datas);
    if (this.datas.cooldown_giveaways === undefined){
      this.datas.cooldown_giveaways = this.data_default.cooldown_giveaways
    }
    if (this.datas.cooldown_account === undefined){
      this.datas.cooldown_account = this.data_default.cooldown_account
    }
    if (this.datas.webhook_url === undefined){
      this.datas.webhook_url = this.data_default.webhook_url
    }
    this.set(this.data_name, this.datas)
    //this.datas = [["a"],["b"],["be"]]

  }
  get_All() {return this.datas;}

  get_D(key) {
    return this.datas[key]
  }

  add_D(key, data) {
      this.datas[key] = data
      this.set(this.data_name, this.datas)

  }

  remove_D(key) {
    this.datas[key] = null
    this.set(this.data_name, this.datas)
  }

}


class Unstored_DS{
  constructor() {
    this.datas = {
      "ready": false,
      "version": "2.0.0",
      "giveways_state":0,



    }
  }
  get_D(key) {
    return this.datas[key]
  }

  set_D(key, data) {
    console.log('set', key, data);
    this.datas[key] = data
  }

  remove_D(key) {
    this.datas[key] = null
  }

}





module.exports.Settings_DS = Settings_DS
module.exports.Giveways_DS = Giveways_DS
module.exports.Users_DS = Users_DS

module.exports.Notif_DS = Notif_DS;
module.exports.Unstored_DS = Unstored_DS;
