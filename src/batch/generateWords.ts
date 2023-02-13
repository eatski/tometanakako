import { openai } from '@/lib/openapi';
import { writeFile } from 'fs/promises';
import { resolve } from 'path';
import * as z from 'zod';

const prompt = `
# 命令
以下を出力する
- カテゴリを5つ選ぶ。
- それぞれのカテゴリごとに日本の名詞を選ぶ
- それぞれの名詞を形容する特徴を4つずつ思い浮かべる。

# 制約
以下を必ず満たすこと
- その「特徴」で「名詞」が特定可能なようにする
- その「特徴」1つでは「名詞」が特定不可能なようにする
- その「カテゴリ」及び「名詞」の単語はその「特徴」の文章に含めない
- 「特徴」で使用した単語を他の「特徴」に含めない
- 「特徴」に具体的な数字や順位は使わない。例: 3776m 
- 「特徴」に固有名詞を含めない
- 「特徴」は10文字以内にする

# フォーマット
以下のTypeScriptの型に代入可能なJSONの形式で出力する
JSONのみを出力する。
type Output = {
    name: string,
    category: string,
    hints: string[]
}[]

# 出力
`

const WordSchema = z.object({
  name: z.string(),
  hints: z.array(z.string()),
  category: z.string(),
});

const OutputSchema = z.array(WordSchema);

export type Output = z.infer<typeof OutputSchema>;

export const generateWords = async () => {
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        temperature: 0.8,
        top_p: 1,
        frequency_penalty: 0.0,
        presence_penalty: 0.9,
        max_tokens: 2000,
    })
    const words = response.data.choices.flatMap((choice) => {
        if(choice.text){
            const json = JSON.parse(choice.text);
            const words = OutputSchema.parse(json);
            return words;
        } else {
            throw new Error("OpenAI API Error");
        }
    })

    const now = new Date().getTime();
    await writeFile(resolve(process.cwd(),'data',`${now}.json`), JSON.stringify(words, null, 2));
}