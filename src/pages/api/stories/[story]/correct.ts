// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { checkAnswerIsCorrect } from '@/usecases/correct';
import type { NextApiHandler } from 'next';
import * as z from "zod"

const RequestBody = z.object({
    prompt: z.string(),
    debugMode: z.boolean()
})

const handler : NextApiHandler = async (req, res) => {
    if(!(typeof req.query.story === "string")){
        throw new Error("Invalid query")
    };
    const body = RequestBody.parse(JSON.parse(req.body));
    await checkAnswerIsCorrect(req.query.story, body).then(text => {
        res.status(200).json({answer:text})
    }).catch((e) => {
        console.error(e);
        res.status(500).json("OpenAI API Error")
    })
}

export default handler
