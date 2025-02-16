const mongoose = require("mongoose")

const pollSchema = new mongoose.Schema({
    pollName: {
        type:String,
        required: true
    },
    questionAndOptions: [
        {
            question: {
                type: String,
                required: true
            },
            answer: [
                {
                   option: {
                        type: String,
                        required: true
                   },
                   votes: {
                        type: Number,
                        required: true,
                        default: 0
                   }
                }
            ]
        }
    ]
}, {timestamps: true})

const Poll = mongoose.model("Poll", pollSchema)

module.exports = Poll