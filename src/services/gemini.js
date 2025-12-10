const { GoogleGenAI } = require('@google/genai');
const { getGlazingOnlyPrompt, getFullModificationPrompt } = require('../prompts/glazing');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Generate balcony glazing visualization images using Gemini 3 Pro
 * Using new @google/genai SDK with gemini-3-pro-image-preview model
 */
async function generateImages(imageBase64, facadeColor, railingMaterial) {
  // Strip data URL prefix if present
  const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

  // Generate glazing-only image
  console.log('[Gemini] Generating glazing-only image...');
  const glazingOnlyPrompt = getGlazingOnlyPrompt();
  
  const glazingOnlyResult = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: [
      { text: glazingOnlyPrompt },
      { inlineData: { mimeType: 'image/jpeg', data: base64Data } }
    ],
    config: {
      responseModalities: ['Text', 'Image']
    }
  });

  // Find the image part in the response
  const glazingOnlyParts = glazingOnlyResult.candidates?.[0]?.content?.parts || [];
  const glazingOnlyImagePart = glazingOnlyParts.find(part => part.inlineData);

  if (!glazingOnlyImagePart) {
    console.error('[Gemini] Response parts:', JSON.stringify(glazingOnlyParts, null, 2));
    throw new Error('No image in glazing-only response');
  }

  const glazingOnlyImage = `data:${glazingOnlyImagePart.inlineData.mimeType};base64,${glazingOnlyImagePart.inlineData.data}`;
  console.log('[Gemini] Glazing-only image generated successfully');

  // Check if additional modifications are requested
  const hasAdditionalModifications = 
    (facadeColor && facadeColor !== 'original') || 
    (railingMaterial && railingMaterial !== 'original');

  let fullModificationImage = null;

  if (hasAdditionalModifications) {
    console.log('[Gemini] Generating full modification image...');
    const fullPrompt = getFullModificationPrompt(facadeColor, railingMaterial);

    const fullResult = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: [
        { text: fullPrompt },
        { inlineData: { mimeType: 'image/jpeg', data: base64Data } }
      ],
      config: {
        responseModalities: ['Text', 'Image']
      }
    });

    const fullParts = fullResult.candidates?.[0]?.content?.parts || [];
    const fullImagePart = fullParts.find(part => part.inlineData);

    if (fullImagePart) {
      fullModificationImage = `data:${fullImagePart.inlineData.mimeType};base64,${fullImagePart.inlineData.data}`;
      console.log('[Gemini] Full modification image generated successfully');
    } else {
      console.warn('[Gemini] No image in full modification response');
      console.warn('[Gemini] Response parts:', JSON.stringify(fullParts, null, 2));
    }
  }

  return {
    glazingOnlyImage,
    fullModificationImage
  };
}

module.exports = { generateImages };
