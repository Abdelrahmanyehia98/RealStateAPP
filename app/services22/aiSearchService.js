import axios from 'axios';


const OPENROUTER_API_KEY = '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';

export const processNaturalLanguageQuery = async (query) => {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: "openai/gpt-3.5-turbo", 
        messages: [
          {
            role: "system",
            content: `You are a real estate search assistant. Extract parameters into JSON with:
            - bedrooms (number)
            - location (string)
            - minPrice (number)
            - maxPrice (number)
            - propertyType (apartment|villa|house|shop|office)
            - type (rent|buy)
            
            Rules:
            1. All lowercase
            2. Property types:
               - apartment → apartment
               - house/home → house
               - villa → villa
               - retail/shop → shop
               - office/workspace → office
            3. Transaction types:
               - rent/rental/lease → rent
               - buy/purchase/sale → buy
            4. Only include mentioned fields
            5. Return ONLY valid JSON, no extra text`
          },
          {
            role: "user",
            content: query
          }
        ],
        temperature: 0.1,
        response_format: { type: "json_object" }
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://yourpropertyapp.com', 
          'X-Title': 'Property Finder AI' // 
        }
      }
    );

    
    return JSON.parse(response.data.choices[0].message.content);
  } catch (error) {
    console.error('AI Search Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    throw new Error('Failed to process your request. Please try again later.');
  }
};