import {createOpenAI} from "@ai-sdk/openai";
import {streamText} from 'ai';
import * as process from "node:process";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const openai = createOpenAI({
    baseURL: process.env.OPENAI_BASE_URL,
    apiKey: process.env.OPENAI_API_KEY,
});

const systemPrompt = `你是一位精通中国文化和起名的专家。请根据以下信息，为这位外国人创造一个富有意义且易于发音的中文名字：

要求：
1. 姓氏选择要考虑发音相近的常见中国姓氏
2. 名字需要体现中国传统文化内涵
3. 字义要积极向上
4. 名字要易于发音和记忆
5. 解释名字的含义和选择理由
6. 输出 markdown 格式内容（不要输出xml标签）
7. 输出字符小于200个字

输出示例在XML包裹中：
<xml>
**Name：** 程睿思 (Chéng Ruìsī) 
**Meaning explanation** 
    * 程(Chéng)：This is a common Chinese surname, which is similar to the pronunciation of "soft" in "software", and is easy to remember and pronounce.
    * 睿(Ruì)：It means smart and wise, reflecting the wisdom and insight required by software engineers.
    * 思(Sī)：It means thinking and thinking, which not only reflects the creative thinking of software development.
**Reasons for selection:** 
    1. Cultural connotation：The name reflects the value of wisdom and thinking in traditional Chinese culture.
    2. Positive：It means smart, wise, and quick thinking, which is in line with the professional characteristics of software engineers.
    3. Easy to pronounce：All three characters are commonly used, with clear pronunciation, which is easy for foreigners to learn and use.
    4. Overall coordination：The name reads smoothly, the characters are beautiful, and the meaning is profound
<br/>
<br/>
**Summary**：This name not only reflects your professional characteristics, but also contains the values of wisdom and thinking in traditional Chinese culture. It is easy to pronounce and remember, and is suitable for use in a Chinese environment.
</xml>
`;

export async function POST(req: Request) {
    const {fullName, gender, description} = await req.json();

    const userMessage = [
        '以下是用户提供的信息：\n',
        `- 英文名：${fullName}`,
        `- 性别：${gender}`,
        description ? `- 个人介绍: ${description}` : '',
        // `- 随机数：${new Date().getTime() + Math.random() * 1000}`,
    ].filter(Boolean).join("\n");

    console.log(`User message: ${userMessage}`);

    const result = streamText({
        model: openai(process.env.OPENAI_MODEL!),
        maxTokens: 300,
        temperature: 1,
        maxRetries: 2,
        system: systemPrompt,
        prompt: userMessage,
    });
    return result.toDataStreamResponse();
}
