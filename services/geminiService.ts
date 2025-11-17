import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const extractBrandInfoFromImage = async (imageBase64: string, mimeType: string): Promise<{ brandName: string; address: string; businessNumber: string; }> => {
    const prompt = `This is an image of a Korean business registration certificate (사업자등록증). 
    Extract the following information:
    1. Company Name (상호(법인명))
    2. Business Registration Number (등록번호)
    3. Address of the head office or main store (본점 또는 주사무소 소재지)

    Return the result as a JSON object with the following keys: "brandName", "address", "businessNumber".
    If a field is not found, return an empty string for that field.`;

    const imagePart = {
        inlineData: {
            data: imageBase64,
            mimeType: mimeType,
        },
    };

    const textPart = {
        text: prompt
    };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        brandName: { type: Type.STRING },
                        address: { type: Type.STRING },
                        businessNumber: { type: Type.STRING },
                    },
                    required: ["brandName", "address", "businessNumber"],
                }
            }
        });
        const parsedJson = JSON.parse(response.text);
        return parsedJson;
    } catch (error) {
        console.error("Error extracting brand info from image:", error);
        throw new Error("Failed to analyze the certificate image.");
    }
};

export const fetchTargetBrands = async (query: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Search for '${query}' and list the top 5 brand names. Format the response as a simple comma-separated list. For example: Brand A, Brand B, Brand C`,
            config: {
                tools: [{googleSearch: {}}],
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error fetching target brands:", error);
        return "Error: Unable to fetch data from Google Search.";
    }
};

export const generateSalesStrategies = async (brandName: string): Promise<string[]> => {
    const prompt = `I am a salesperson for a signage (간판) company. My target client is the franchise brand '${brandName}'. 
    Generate exactly three distinct and actionable initial sales approach strategies. 
    Each strategy should be a short, single sentence in Korean.
    Format the output as a JSON array of strings. For example: ["strategy 1", "strategy 2", "strategy 3"]`;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });

        // The response text should be a JSON string array
        const strategies = JSON.parse(response.text);
        if (Array.isArray(strategies) && strategies.every(s => typeof s === 'string')) {
            return strategies;
        }
        throw new Error("Invalid format received from Gemini API.");

    } catch (error) {
        console.error("Error generating sales strategies:", error);
        // Provide fallback strategies on error
        return [
            `${brandName}의 브랜드 아이덴티티를 강조하는 맞춤형 디자인을 제안합니다.`,
            `초기 가맹점 확장을 위한 합리적인 비용의 표준화된 간판 패키지를 제안합니다.`,
            `경쟁 브랜드와 차별화되는 혁신적인 디지털 사이니지 도입을 제안합니다.`
        ];
    }
};