import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function generateResult(prompt) {
  let messages = [
    {
      content: prompt,
      role: "user",
    },
  ];

  const result = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0.5,
    messages: messages,
  });

  return result;
}

function parseQuestions(text) {
  const questions = text.split(/\n\n+/); // Split the text into questions using double newline as delimiter
  const parsedQuestions = questions.map((question) => {
    const [q, ...options] = question.split(/\n/); // Split each question into question and options

    const [_, answer] = options[options.length - 1].split(/\[ans:\s(\d)\]/); // Split the last option into answer and option text
    options.pop(); // Remove the last option from the options array

    // remove - from the options
    const parsedOptions = options.map((option) => option.replace(/-\s/, ""));
    return {
      question: q.replace(/Q:\s/, ""), // remove Q: from the question
      options: parsedOptions,
      answer: (parseInt(answer) - 1).toString(), // convert the answer to 0 based index
    };
  });

  return parsedQuestions;
}

export { parseQuestions, generateResult };

// Q\d*: .*
