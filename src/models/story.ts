
import { z } from "zod";

export const Story = z.object({
    title: z.string(),
    coreDescription: z.string(),
    additionalDescription: z.string(),
    question: z.string(),
    examples: z.object({
        questions: z.array(
          z.object({
            question: z.string(),
            result: z.string(),
          })
        ).optional(),
        answers: z.array(
          z.object({
            answer: z.string(),
            result: z.string(),
          })
        ).optional(),
      }).optional(),
});

export type Story = z.infer<typeof Story>;

