import { openai } from "@/lib/openapi";
import { getStory } from "@/models/getStory";
import { Story } from "@/models/story";

export type Question = {
    prompt: string,
    debugMode: boolean,
}

const createPrompt = (question: Question,story: Story) => {
    return `
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
${question.prompt}

# 選択肢
- はい: 「回答者の質問」に対して「問題の答え」の状況は真である
- いいえ: 「回答者の質問」に対して「問題の答え」の状況は偽である
- 関係ない: 「回答者の回答」は「問題の答え」に対して関係ないもしくは読み取れないことを言っている。

# 出力
「問題の答え」を読んだ上で「回答者の質問」について、選択肢から1つ選び、それのみを回答する。
${question.debugMode ? "その理由も共に答える" :  ""}
`
}

export const askQuestion = async (storyId: string,  question: Question): Promise<string> => {

    const story = await getStory(storyId);
    const prompt = createPrompt(question,story);
    
    return openai.createCompletion({
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
            return text
        } else {
            throw new Error("OpenAI API Error")
        }
    })
}
    

