const mongoose = require("mongoose");
const Message = require("../models/message").Message;

exports.postThread = async (req, res, next) => {
  try {
    const board = req.params.board;

    const newThread = await Message.create({
      board: board,
      text: req.body.text,
      created_on: new Date(),
      bumped_on: new Date(),
      reported: false,
      delete_password: req.body.delete_password,
      replies: []
    });

    return res.redirect("/b/" + board);
  } catch (err) {
    console.error('Error posting thread:', err);
    return res.status(500).json("error");
  }
};

exports.getThread = async (req, res) => {
    try {
      const board = req.params.board;
      const threadArray = await Message.find({ board: board })
        .sort({ bumped_on: "desc" })
        .limit(10)
        .lean()
        .exec();
  
      if (threadArray) {
        threadArray.forEach(ele => {
          ele.replycount = ele.replies.length;
  
          ele.replies.sort((a, b) => {
            return new Date(b.created_on) - new Date(a.created_on);
          });
  
          // limit replies to 3
          ele.replies = ele.replies.slice(0, 3);
  
          // Remove delete_password and reported fields from replies
          ele.replies.forEach(reply => {
            delete reply.delete_password;
            delete reply.reported;
          });
  
          // Remove delete_password and reported fields from thread
          delete ele.delete_password;
          delete ele.reported;
        });
        return res.json(threadArray);
      } else {
        res.status(404).json("error");
      }
    } catch (err) {
      console.error('Error getting threads:', err);
      return res.status(500).json("error");
    }
  };
  

exports.deleteThread = async (req, res) => {
    try {
      const board = req.params.board;
      const deletedThread = await Message.findById(req.body.thread_id);
      if (req.body.delete_password === deletedThread.delete_password) {
        await Message.findByIdAndDelete(req.body.thread_id);
        return res.send("success");
      } else {
        return res.send("incorrect password");
      }
    } catch (err) {
      console.error('Error deleting thread:', err);
      res.status(500).json("error");
    }
  };

  exports.putThread = async (req, res) => {
    try {
      const updateThread = await Message.findById(req.body.thread_id);
      updateThread.reported = true;
      await updateThread.save();
      return res.send("reported");
    } catch (err) {
      console.error('Error reporting thread:', err);
      res.status(500).json("error");
    }
  };
