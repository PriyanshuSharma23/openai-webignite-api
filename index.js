import { parseQuestions, generateResult } from "./quizbot.js";
import express from "express";
import chalk from "chalk";
import dotenv from "dotenv";

const app = express();
const PORT = process.env.PORT || 8000;

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

let rateLimit = true;

app.use(function (req, res, next) {
  if (res.headersSent) {
    console.log(chalk.green(req.method, req.url, res.statusCode));
  } else {
    res.on("finish", function () {
      console.log(chalk.green(req.method, req.url, res.statusCode));
    });
  }
  next();
});

app.get("/", (_req, res) => {
  res.send("Welcome to QuizBot API");
});

app.get("/questions", async (req, res) => {
  const { difficulty } = req.query;

  if (!difficulty) {
    res.status(400).send("difficulty is required");
    return;
  }

  if (
    difficulty !== "easy" &&
    difficulty !== "medium" &&
    difficulty !== "hard"
  ) {
    res.status(400).send("difficulty should be easy, medium or hard");
    return;
  }

  if (rateLimit) {
    res.send(mock);
    return;
  }

  let prompt = `generate an IPL themed quiz with 5 questions, the format should be as follows:\nQ: who won the IPL 2013?\n- Mumbai Indians\n- Delhi Capitals\n- Rajasthan Royals\n-  Chennai Super Kings\n[ans: 1]\nThe difficulty should be ${difficulty}.`;
  let result = await generateResult(prompt);

  const questions = parseQuestions(result.data.choices[0].message.content);

  res.send(questions);
});

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});

const mock = [
  {
    question:
      "Q1: Who holds the record for the most runs in a single IPL season?",
    options: ["Virat Kohli", "Chris Gayle", "Shane Watson", "David Warner"],
    answer: "1",
  },
  {
    question: "Q2: Who is the only player to win the IPL MVP award twice?",
    options: ["Rohit Sharma", "Sunil Narine", "Andre Russell", "Chris Gayle"],
    answer: "2",
  },
  {
    question: "Q3: Who has the highest individual score in IPL history?",
    options: ["AB de Villiers", "Chris Gayle", "Brendon McCullum", "KL Rahul"],
    answer: "1",
  },
  {
    question: "Q4: Which team has won the most IPL titles?",
    options: [
      "Mumbai Indians",
      "Chennai Super Kings",
      "Kolkata Knight Riders",
      "Royal Challengers Bangalore",
    ],
    answer: "0",
  },
  {
    question: "Q5: Who holds the record for the most wickets in IPL history?",
    options: [
      "Lasith Malinga",
      "Amit Mishra",
      "Harbhajan Singh",
      "Piyush Chawla",
    ],
    answer: "0",
  },
];
