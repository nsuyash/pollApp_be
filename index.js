const express = require("express");
const { initalizeDatabase } = require("./db/db.connect");

const Poll = require("./models/polls.models")

const app = express();
const cors = require("cors");

const corsOpt = {
  origin: "*",
  credentials: true,
};

initalizeDatabase();

app.use(express.json());
app.use(cors(corsOpt));


const obtainAllQuestion = async () => {
    try {
        const polls = await Poll.find()
        return polls
    } catch (error) {
        throw error
    }
}

app.get("/polls", async (req, res) => {
    try {
        const polls = await obtainAllQuestion();

        if(!polls){
            res.status(404).json({message: "Poll not found."});
        }
        res.status(200).json(polls)

    } catch (error) {
        res.status(500).json({error: `Server error: ${error}`})
    }
})


const seedPolls = async (pollData) => {
    try {
        const polls = new Poll(pollData)
        const savePoll = await polls.save()
        return savePoll
    } catch (error) {
        throw error
    }
}

app.post("/polls", async (req, res) => {
    try {
        const polls = await seedPolls(req.body)

        if(!polls){
            res.status(303).json({message: "Poll is not save."})
        }

        res.status(200).json(polls)
    } catch (error) {
        res.status(500).json({error: `Server error: ${error}`})
    }
})

app.post("/polls/:id/vote", async (req, res) => {
    try {
      const poll = await Poll.findById(req.params.id);
      if (!poll) return res.status(404).json({ error: "Poll not found" });
  
      const { questionIndex, optionIndex } = req.body;
  
      if (questionIndex < 0 || questionIndex >= poll.questionAndOptions.length) {
        return res.status(400).json({ error: "Invalid question index" });
      }
  
      const question = poll.questionAndOptions[questionIndex];
      if (optionIndex < 0 || optionIndex >= question.answer.length) {
        return res.status(400).json({ error: "Invalid option index" });
      }
  
      question.answer[optionIndex].votes += 1;
      
      await poll.save();
  
      res.json({ message: "Vote recorded successfully", poll });
    } catch (error) {
      res.status(500).json({ error: "Failed to vote" });
    }
  });
  
  
  app.delete("/polls/:id", async (req, res) => {
    await Poll.findByIdAndDelete(req.params.id);
    res.json({ message: "Poll deleted" });
  });

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Sever is running on port ${PORT}`);
});