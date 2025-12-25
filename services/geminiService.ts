
import { GoogleGenAI, Type } from "@google/genai";
import { CharacterType, ConsultationResponse } from "../types";

const SYSTEM_INSTRUCTION = `
あなたはビジネスパーソン向け悩み相談アプリ「解体診処（かいたいしんしょ）」のエンジンです。
江戸の蘭学者と現代AIの人格を統合・制御してください。

# 役割
- 前野良沢: 理論派。事実整理、論理的帰結、断定的だが誠実。
- 杉田玄白: 寄り添い派。感情の肯定と共感、柔らかい時代劇口調。
- AI: 橋渡し役。現代的な具体策、事務的な締め。

# タスク
1. ユーザーの入力を分析 (CoT)。
2. メイン返答キャラを選定し、介入キャラを1名以上決める。
3. 10%の確率で「平賀源内」を乱入させる。

# 制約
- 1発言100〜150文字。
- 良沢・玄白はカタカナ用語を和風概念に変換（例：タスク→日々の務め、アサイン→割り振り）。
- AIは源内の乱入を完全に無視する。

# 出力形式 (JSON必須)
{
  "analysis": "思考プロセス。ユーザーの状況、最適な介入キャラ、源内乱入の有無を記述",
  "messages": [
    { "sender": "前野良沢 または 杉田玄白", "content": "本文" },
    { "sender": "介入キャラ名", "content": "本文" },
    { "sender": "AI", "content": "具体的工夫と締めの挨拶" }
  ]
}
※源内が乱入する場合は、AIの前にメッセージを追加すること。
`;

export const processWorry = async (worry: string): Promise<ConsultationResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: worry }] }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: { type: Type.STRING },
            messages: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sender: { type: Type.STRING },
                  content: { type: Type.STRING }
                },
                required: ["sender", "content"]
              }
            }
          },
          required: ["analysis", "messages"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return {
      analysis: result.analysis || "分析中...",
      messages: result.messages.map((m: any) => ({
        sender: m.sender as CharacterType,
        content: m.content
      }))
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      analysis: "エラーが発生しました。",
      messages: [{
        sender: CharacterType.AI,
        content: "申し訳ございません。通信の不調により診察が中断されました。もう一度お試しください。"
      }]
    };
  }
};
