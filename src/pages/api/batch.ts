// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { generateWords } from '@/batch/generateWords';
import type { NextApiResponse } from 'next'

export default async function handler(
  _: never,
  res: NextApiResponse<any>
) {
  await generateWords().then(() => {
    res.status(200).send("ok");
  }).catch((e) => {
    console.error(e)
    res.status(500).send("error");
  })
}
