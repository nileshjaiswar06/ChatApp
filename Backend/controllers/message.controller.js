import Conversation from "../models/conversation.model.js"
import Message from "../models/message.model.js"

export const sendMessage = async (req, res) => {
  try {
    const {message} = req.body
    const {id : receiverId} = req.params
    const senderId = req.user._id

    let conversation = await Conversation.findOne({
      participants : {
        $all : [senderId, receiverId]
      }
    })

    if(!conversation) {
      conversation = await Conversation.create({
        participants : [senderId, receiverId],
      })
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message
    })

    if(newMessage){
      conversation.messages.push(newMessage._id)
    }

    // Save conversation first and then message
    // await conversation.save() 
    // await newMessage.save()

    // Save both conversation and message in parallel
    await Promise.all([conversation.save(), newMessage.save()])

    res.status(201).json({newMessage})

  } catch (error) {
    console.log("error: ", error.message)
    res.status(500).json({error : "Internal server error"})
  }
}

export const getMessages = async (req, res) => {
  try {
    const {id : userToChatId} = req.params
    const userId = req.user._id

    const conversation = await Conversation.findOne({
      participants : {
        $all : [userId, userToChatId]
      }
    }).populate("messages")

    if(!conversation){
      return res.status(200).json({messages : []})
    }

    const messages = conversation.messages

    res.status(200).json({messages})

  } catch (error) {
    console.log("error: ", error.message)
    res.status(500).json({error : "Internal server error"})
  }
}