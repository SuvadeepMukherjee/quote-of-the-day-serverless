import { getAllQuotes } from "./db";
import { Quote } from "./types";

const TABLE = process.env.DYNAMO_TABLE as string;

export const handler = async () => {
  try {
    const quotes = (await getAllQuotes(TABLE)) as Quote[];

    if (!quotes.length) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "No quotes available" }),
      };
    }

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];

    return {
      statusCode: 200,
      body: JSON.stringify(quote),
      headers: { "Content-Type": "application/json" },
    };
  } catch (err) {
    console.error("Error fetching quote:", err);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
