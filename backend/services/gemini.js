const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class GeminiService {
  // Initialize Gemini model
  static getModel() {
    return genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  // Initialize Gemini Vision model for image analysis
  static getVisionModel() {
    // Allow model override via env var, fallback to gemini-pro-vision
    const modelName = process.env.GEMINI_VISION_MODEL || 'gemini-pro-vision';
    return genAI.getGenerativeModel({ model: modelName });
  }

  // Analyze clothing item from image
  static async analyzeClothingItem(imageUrl, description = '') {
    try {
      const model = this.getVisionModel();
      
      const prompt = `
        Analyze this clothing item image and provide detailed information:
        
        Please provide:
        1. Type of clothing (shirt, pants, dress, etc.)
        2. Estimated size (XS, S, M, L, XL, XXL)
        3. Condition assessment (new, like-new, good, fair, poor)
        4. Color description
        5. Style/design description
        6. Material type (if visible)
        7. Brand (if visible)
        8. Season appropriateness
        9. Suggested title for listing
        10. Suggested description for listing
        
        Format the response as JSON with these fields:
        {
          "type": "string",
          "estimatedSize": "string", 
          "condition": "string",
          "color": "string",
          "style": "string",
          "material": "string",
          "brand": "string",
          "season": "string",
          "suggestedTitle": "string",
          "suggestedDescription": "string"
        }
        
        Additional context: ${description}
      `;

      const result = await model.generateContent([prompt, imageUrl]);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Failed to parse AI response');
    } catch (error) {
      console.error('Gemini analysis error:', error);
      throw new Error('Failed to analyze image');
    }
  }

  // Generate item description
  static async generateItemDescription(itemData) {
    try {
      const model = this.getModel();
      
      const prompt = `
        Generate an engaging and detailed description for a clothing item with the following details:
        
        Type: ${itemData.type}
        Size: ${itemData.size}
        Condition: ${itemData.condition}
        Color: ${itemData.color}
        Style: ${itemData.style}
        Material: ${itemData.material}
        Brand: ${itemData.brand || 'Unknown'}
        
        Please create a compelling description that:
        1. Highlights the item's best features
        2. Mentions the condition and size
        3. Describes the style and color
        4. Includes any notable details
        5. Makes it appealing for potential swappers
        
        Keep it under 200 words and make it engaging.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini description error:', error);
      throw new Error('Failed to generate description');
    }
  }

  // Suggest similar items for swapping
  static async suggestSimilarItems(itemData, userPreferences = '') {
    try {
      const model = this.getModel();
      
      const prompt = `
        Based on this clothing item, suggest 5 similar items that would be good for swapping:
        
        Item: ${itemData.type} - ${itemData.color} - ${itemData.size}
        Style: ${itemData.style}
        Material: ${itemData.material}
        
        User preferences: ${userPreferences}
        
        Please suggest items that:
        1. Are similar in style or type
        2. Would appeal to someone who likes this item
        3. Are practical for swapping
        4. Match the quality level
        
        Format as JSON array:
        [
          {
            "type": "string",
            "description": "string",
            "reason": "string"
          }
        ]
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Failed to parse suggestions');
    } catch (error) {
      console.error('Gemini suggestions error:', error);
      throw new Error('Failed to generate suggestions');
    }
  }

  // Generate personalized recommendations
  static async generateRecommendations(userProfile, items) {
    try {
      const model = this.getModel();
      
      const prompt = `
        Based on this user profile and available items, generate personalized recommendations:
        
        User Profile:
        - Location: ${userProfile.location}
        - Style preferences: ${userProfile.stylePreferences || 'Not specified'}
        - Size: ${userProfile.size || 'Not specified'}
        
        Available Items: ${JSON.stringify(items.slice(0, 10))}
        
        Please provide:
        1. Top 5 recommended items with reasons
        2. Style suggestions based on their profile
        3. Seasonal recommendations
        
        Format as JSON:
        {
          "recommendations": [
            {
              "itemId": "string",
              "reason": "string",
              "matchScore": "number"
            }
          ],
          "styleSuggestions": ["string"],
          "seasonalRecommendations": ["string"]
        }
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Failed to parse recommendations');
    } catch (error) {
      console.error('Gemini recommendations error:', error);
      throw new Error('Failed to generate recommendations');
    }
  }

  // Analyze user preferences from their items
  static async analyzeUserPreferences(items) {
    try {
      const model = this.getModel();
      
      const prompt = `
        Analyze this user's clothing items to understand their style preferences:
        
        Items: ${JSON.stringify(items)}
        
        Please provide:
        1. Primary style preferences
        2. Color preferences
        3. Size range
        4. Condition preferences
        5. Brand preferences
        6. Seasonal preferences
        
        Format as JSON:
        {
          "stylePreferences": ["string"],
          "colorPreferences": ["string"],
          "sizeRange": "string",
          "conditionPreferences": "string",
          "brandPreferences": ["string"],
          "seasonalPreferences": ["string"]
        }
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Failed to parse preferences');
    } catch (error) {
      console.error('Gemini preferences error:', error);
      throw new Error('Failed to analyze preferences');
    }
  }
}

module.exports = GeminiService; 