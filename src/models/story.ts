
import { z } from "zod";

export const Story = z.object({
    title: z.string(),
    coreDescription: z.string(),
    additionalDescription: z.string(),
    question: z.string(),
});

export type Story = z.infer<typeof Story>;

