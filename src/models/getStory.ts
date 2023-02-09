import { readFile } from "fs/promises";
import { resolve } from "path";
import * as yaml from "yaml";
import { Story } from "./story";

export const getStory = async (storyId: string): Promise<Story> => {
    const file = await readFile(resolve(process.cwd(),"data","stories",storyId + ".yaml"));
    const storyYaml =  yaml.parse(file.toString());
    return Story.parse(storyYaml);
}