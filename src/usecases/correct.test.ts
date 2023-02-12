
import { getStory } from '@/models/getStory.js';
import {test,expect} from "vitest"
import { askQuestion } from './question.js';

test('askQuestion', async t => {
    const id = "story02"
    const story = await getStory(id);
    await Promise.all(story.examples!.questions!.map(async q => {
        const answer = await askQuestion(id,{
            prompt: q.question,
            debugMode: false
        })
        expect(answer, q.question).equal(q.result);
    }))
})