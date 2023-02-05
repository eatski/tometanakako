// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiHandler } from 'next'
import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const story = "ホゲホゲ町はクリスマスの夜景で有名である。その夜景はサラリーマンたちの残業によるビルの明かりでできている。クリスマスの夜、町はサラリーマンの残業を推奨し、いつもより多めの残業代を出すように企業に要請している。その多めの残業代目当てにより多くのサラリーマンが自主的に残業をすることで明るく綺麗な夜景を実現しているのである"

const handler : NextApiHandler = async (req, res) => {
    const body = JSON.parse(req.body);
    const prompt = `
    『${story}』
    『』内の物語について質問するので、その質問に「はい」か「いいえ」、もしくは物語から読み取れないことは「答えられない」で答えてください。
    「はい」「いいえ」「答えられない」以外に余計なことは言わないでください。 
    Q:${body.prompt}
    A:`
    await openai.createCompletion({
        model: "text-davinci-003",
        prompt,
        temperature: 0,
        top_p: 1,
        max_tokens: 10,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
    }).then(e => {
        res.status(200).json({answer:e.data.choices[0].text})
    }).catch(() => {
        res.status(500).json({error: "OpenAI API Error"})
    })
}

export default handler

