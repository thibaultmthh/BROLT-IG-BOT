const Twitter = require("twitter-lite")
const request = require("request")




function timeConverter(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp * 1);
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + hour + ':' + min;
  return time;
}







function check_dm(user, users_DS, notif_ds, settings_ds) {
  var keywords = ["win", "winner", "winners", "congrats", "congratulation", "congratulations", "dm", "claim", "won"];
  let perso_id = settings_ds.get_D("perso_id");
  user = users_DS.get_D(user)
  let api = new Twitter({
    consumer_key: user[2].consumer_key,
    consumer_secret: user[2].consumer_secret,
    access_token_key: user[2].access_token_key,
    access_token_secret: user[2].access_token_secret

  })
  api.get("direct_messages/events/list", {
    count: 6
  }).then(function(data) {
    let events = data.events
    for (var i in events) {
      event = events[i]
      if (event.sender_id != user[1]) {
        let unique_id = event.id
        let datas = {
          date: event.created_timestamp,
          message: event.message_create.message_data.text
        }
        notif_ds.add_D([unique_id, user[0], "dm", datas])

        if (datas.message.toLowerCase().includes(keywords[i])) { //webhooks sending
          let mention_data = {
            date: timeConverter(datas.date),
            text: datas.message,
            by:"",
            on: user[0],
            id: unique_id,
            type: "dm"
          }
          request.post('http://api.seigrobotics.com:5000/win_notification', {
            json: {
              notif_data: mention_data,
              user_id: perso_id,
            }
          }, (error, res, body) => {})
        }

      }
    }
  }).catch(err => {
    console.log(err);
  })
}


function check_mention(user, users_DS, notif_ds, settings_ds) {
  var keywords = ["win", "winner", "winners", "congrats", "congratulation", "congratulations", "dm", "claim", "won"];
  user = users_DS.get_D(user)
  let api = new Twitter({
    consumer_key: user[2].consumer_key,
    consumer_secret: user[2].consumer_secret,
    access_token_key: user[2].access_token_key,
    access_token_secret: user[2].access_token_secret

  })

  api.get("statuses/mentions_timeline", {
    count: 60
  }).then(function(data) {

    let all_id = users_DS.get_All_ids()
    let perso_id = settings_ds.get_D("perso_id");

    for (var i in data) {
      mention = data[i]
      if (mention.user != undefined) {

        if (all_id.includes(mention.user.id_str) == false) {

          notif_ds.add_D([mention.id_str, user[0], "mention", {
            date: mention.created_at,
            message: mention.text,
            send_by: mention.user.screen_name
          }])
          if (mention.text.toLowerCase().includes(keywords[i])) {
            let mention_data = {
              date: mention.created_at.substring(4, 17),
              text: mention.text,
              by: mention.user.screen_name,
              on: "",
              id: mention.id,
              type: "mention"
            }
            request.post('http://api.seigrobotics.com:5000/win_notification', {
              json: {
                notif_data: mention_data,
                user_id: perso_id,
              }
            }, (error, res, body) => {})
          }



        }
      }

    }

  }).catch(err => {
    console.log(err);
  })



}




function check_all_notifs(users_DS, notif_ds, settings_ds) {
  var all_user = users_DS.get_All_screen_name()
  var delay_between_user_check = 14000

  for (var i in all_user) {
    user = all_user[i]
    if (i == all_user.length - 1) {
      last = true
    } else {
      last = false
    }
    setTimeout(check_dm, delay_between_user_check * i, user, users_DS, notif_ds, settings_ds)
    setTimeout(check_mention, delay_between_user_check * i + 6000, user, users_DS, notif_ds, settings_ds)



  }
}


module.exports.check_all_notifs = check_all_notifs;
