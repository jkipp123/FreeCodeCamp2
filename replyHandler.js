const mongoose = require("mongoose");
const Message = require("../models/message").Message;

exports.postReply = async (req, res, next) => {
  try {
    const board = req.params.board;
    const foundBoard = await Message.findById(req.body.thread_id);
    foundBoard.bumped_on = new Date().toUTCString();
    foundBoard.replies.push({
      text: req.body.text,
      created_on: new Date().toUTCString(),
      delete_password: req.body.delete_password,
      reported: false
    });

    await foundBoard.save();
    return res.redirect("/b/" + board + "/" + req.body.thread_id);
  } catch (err) {
    console.error('Error posting reply:', err);
    res.status(500).json("error");
  }
};

exports.getReply = async (req, res) => {
  try {
    const board = req.params.board;
    const thread = await Message.findById(req.query.thread_id);
    if (thread) {
      thread.delete_password = undefined;
      thread.reported = undefined;
      thread.replycount = thread.replies.length;

      thread.replies.forEach(reply => {
        reply.delete_password = undefined;
        reply.reported = undefined;
      });

      return res.json(thread);
    } else {
      res.status(404).json("error");
    }
  } catch (err) {
    console.error('Error getting reply:', err);
    res.status(500).json("error");
  }
};

exports.deleteReply = async (req, res) => {
  try {
    const foundThread = await Message.findById(req.body.thread_id);
    let replyFound = false;
    foundThread.replies.forEach(async ele => {
      if (ele._id == req.body.reply_id) {
        replyFound = true;
        if (ele.delete_password == req.body.delete_password) {
          ele.text = "[deleted]";
          await foundThread.save();
          return res.send("success");
        } else {
          return res.send("incorrect password");
        }
      }
    });
    if (!replyFound) {
      res.status(404).json("error");
    }
  } catch (err) {
    console.error('Error deleting reply:', err);
    res.status(500).json("error");
  }
};

exports.putReply = async (req, res) => {
    try {
      const foundThread = await Message.findById(req.body.thread_id);
      let replyFound = false;
      foundThread.replies.forEach(ele => {
        if (ele._id == req.body.reply_id) {
          replyFound = true;
          ele.reported = true;
          foundThread.save();
          return res.send("reported");
        }
      });
      if (!replyFound) {
        res.status(404).json("error");
      }
    } catch (err) {
      console.error('Error reporting reply:', err);
      res.status(500).json("error");
    }
  };
  
