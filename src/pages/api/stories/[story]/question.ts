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
問題とそれの答え、及びそれを読んだ回答者の質問を見て選択肢の中から出力を決めてください。
ある程度抽象的に考えてください。

# 問題
${story.question}

# 問題の答え
${story.coreDescription}

# 補足説明
${story.additionalDescription}

# 回答者の質問
${body.prompt}

# 選択肢
- はい: 「回答者の質問」に対して「問題の答え」の状況は真である
- いいえ: 「回答者の質問」に対して「問題の答え」の状況は偽である
- 関係ない: 「回答者の回答」は「問題の答え」に対して関係ないもしくは読み取れないことを言っている。

# 出力
「問題の答え」を読んだ上で「回答者の質問」について、選択肢から1つ選び、それのみを回答する。
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
        res.status(200).json({answer:e.data.choices[0].text})
    }).catch(() => {
        res.status(500).json({error: "OpenAI API Error"})
    })
}

export default handler

