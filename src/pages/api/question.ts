// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiResponse, NextApiHandler } from 'next'
import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const handler : NextApiHandler = (req, res) => {
    const body = JSON.parse(req.body);
    openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Q:${body.prompt} \nA:`,
        temperature: 0,
        top_p: 1,
        max_tokens: 1000,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        stop: ["\n"],
    }).then(e => {
        res.status(200).json({answer:e.data.choices[0].text})
    }).catch(() => {
        res.status(500).json({error: "OpenAI API Error"})
    })
}

export default handler

