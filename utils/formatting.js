const moment = require("moment");
function createMessageData(username, text) {
  return {
    username,
    text,
    time: moment().format("h:mm a"),
  };
}

module.exports = createMessageData;
