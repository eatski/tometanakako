import { openai } from "@/lib/openapi";
import { getStory } from "@/models/getStory";
import { Story } from "@/models/story";


export type Answer = {
    prompt: string,
    debugMode: boolean,
}

const createPrompt = (answer: Answer,story: Story) => {
    return `
# 概要
問題とそれの答え、及びそれを読んだ回答者の回答を見て出力を決めてください。

# 問題
${story.question}

# 問題の答え
${story.coreDescription}

# 回答者の回答
${answer.prompt}

# 選択肢
- 正解: 「回答者の回答」は「問題の答え」を正しく表しており、要素を欠落していない。
- 説明不足: 「回答者の回答」は「問題の答え」を正しく表してはいるが、一部要素を欠落している。
- 不正解: 「回答者の回答」は「問題の答え」を正しく表していない。

# 出力
「問題の答え」に対する「回答者の回答」について、選択肢から1つ選び、それのみを出力する。
${answer.debugMode ? "その理由も共に答える" :  ""}
`
}

export const checkAnswerIsCorrect = async (storyId: string, answer: Answer): Promise<string> => {
    const story = await getStory(storyId);
    const prompt = createPrompt(answer,story);
    
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