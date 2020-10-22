const MessageModel = require("../models/message")
const { success, failed } = require("../helper/response")

const message = {
  destroy: (req, res) => {
    try {
      const id = req.params.id
      MessageModel.destroy(id)
        .then((result) => {
          success(res, result, "Delete data success")
        }).catch((err) => failed(res, [], err.message))
      } catch (error) {
        failed(res, [], "Internal Server Error")
      }
  }
}

module.exports = message