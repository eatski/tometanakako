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
# 概要
問題とそれの答え、及びそれを読んだ回答者の回答を見て出力を決めてください。

# 問題
${story.question}

# 問題の答え
${story.coreDescription}

# 回答者の回答
${body.prompt}

# 選択肢
- 正解: 「回答者の回答」は「問題の答え」を正しく表しており、要素を欠落していない。
- 説明不足: 「回答者の回答」は「問題の答え」を正しく表してはいるが、一部要素を欠落している。
- 不正解: 「回答者の回答」は「問題の答え」を正しく表していない。

# 出力
「問題の答え」に対する「回答者の回答」について、選択肢から1つ選び、それのみを出力する。
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
