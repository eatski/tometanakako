import { askQuestion } from '@/usecases/question';
import type { NextApiHandler } from 'next'

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
    return askQuestion(req.query.story, body).then(answer => {
        res.status(200).json({answer})
    }).catch(() => {
        res.status(500).json({error: "OpenAI API Error"})
    })
}

export default handler

