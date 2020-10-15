from flask import Flask
from flask import request
import requests


import json
app = Flask(__name__)


@app.route("/newgiveway", methods=['POST'])
def new_giveway():
    print(request.form)
    url = request.form["url"]
    url_webhook = "https://discordapp.com/api/webhooks/766282379898912778/IOnMUoi4r9SMynkfpfgDr5j2mleX7QbmZRQiti5mSposZP74M4rZpxUGx4Cto3wX-Onr"
    data_s = {"content": "Link : {}".format(url),"username":"New  giveaway"}
    #data_s = {"content": "Link : ","username":"New {} giveaway"}

    requests.post(url_webhook, data_s)
    return "ok"


if __name__ == '__main__':
    app.run(host="0.0.0.0",port=5000, debug = False)
