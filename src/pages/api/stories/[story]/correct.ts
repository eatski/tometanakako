// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getStory } from '@/models/getStory';
import type { NextApiHandler } from 'next'
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const handler : NextApiHandler = async (req, res) => {
    if(!(typeof req.query.story === "string")){
        throw new Error("Invalid query")
    };
    const story = await getStory(req.query.story);
    const body = JSON.parse(req.body);
    const prompt = `
    以下の2つの文章があります。
    A:${story.coreDescription}
    B:${body.prompt}

    Bに対するAの説明として「ほとんど同じ意味である」「関係ない」「説明不足である」のから選ぶ。
    ${body.debugMode ? "その理由も共に答える" :  ""}
    `
    await openai.createCompletion({
        model: "text-davinci-003",
        prompt,
        temperature: 0,
        top_p: 1,
        max_tokens: 1000,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
    }).then(e => { 
        const text = e.data.choices[0].text
        if(text){
            res.status(200).json({answer:text})
        } else {
            res.status(500).json("OpenAI API Error")
        }
       
    }).catch((e) => {
        console.error(e);
        res.status(500).json({error: "OpenAI API Error"})
    })
}

export default handler
