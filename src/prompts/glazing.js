/**
 * Prompt for glazing-only image generation
 */
function getGlazingOnlyPrompt() {
  return `You are an expert architectural visualizer. Transform this apartment building image with the following requirements:

MANDATORY MODIFICATIONS (ALWAYS APPLY):
1. Add modern, frameless glass balcony enclosures to EVERY SINGLE BALCONY in the building
   - Count all balconies carefully and ensure NONE are missed
   - Every balcony MUST have glass enclosure added, without exception
   - Use transparent or slightly tinted glass panels
   - Make them look realistic with subtle reflections
   - Glass should be frameless and modern looking
   - Ensure they appear professional and barely visible
   - Apply consistently to all floors and all sides of the building
2. Add small text "Muokattu tekoälyllä" in the bottom corner of the image (make it subtle but readable, white or light colored text with slight shadow for visibility)

CRITICAL - DO NOT CHANGE:
- Keep ALL existing balcony railings exactly as they are
- Keep the building facade color exactly as it is
- Keep all windows, doors, and their frames unchanged
- Maintain the building's architectural structure and proportions
- Keep natural lighting and realistic shadows
- Preserve all elements exactly as they are except for adding the glass balcony enclosures

VERIFICATION CHECKLIST:
- Have you added glass to the ground floor balconies? ✓
- Have you added glass to the middle floor balconies? ✓
- Have you added glass to the top floor balconies? ✓
- Have you checked corner balconies? ✓
- Are ALL balconies consistently glazed? ✓

Make the transformation look natural and professionally executed.`;
}

/**
 * Prompt for full modification image generation
 */
function getFullModificationPrompt(facadeColor, railingMaterial) {
  const colorMap = {
    'light-gray': 'light gray',
    'white': 'clean white',
    'beige': 'warm beige',
    'modern-brick-red': 'modern brick red',
    'dark-gray': 'dark gray'
  };

  const materialMap = {
    'glass-metal': 'modern clear glass panels with sleek metal frames',
    'wooden-slats': 'stylish vertical wooden slats in a contemporary design',
    'dark-metal': 'dark metal panel railings with a modern finish'
  };

  let prompt = `You are an expert architectural visualizer. Transform this apartment building image with the following requirements:

MANDATORY MODIFICATIONS (ALWAYS APPLY):
1. Add modern, frameless glass balcony enclosures to EVERY SINGLE BALCONY in the building
   - Count all balconies carefully and ensure NONE are missed
   - Every balcony MUST have glass enclosure added, without exception
   - Use transparent or slightly tinted glass panels
   - Make them look realistic with subtle reflections
   - Glass should be frameless and modern looking
   - Ensure they appear professional and barely visible
   - Apply consistently to all floors and all sides of the building
2. Add small text "Muokattu tekoälyllä" in the bottom corner of the image (make it subtle but readable, white or light colored text with slight shadow for visibility)

`;

  // Add facade color change if selected
  if (facadeColor && facadeColor !== 'original' && colorMap[facadeColor]) {
    prompt += `FACADE COLOR CHANGE:
- Change the entire building facade to ${colorMap[facadeColor]}
- Apply the color consistently across all walls
- Maintain texture and depth while changing the color

`;
  }

  // Add railing material change if selected
  if (railingMaterial && railingMaterial !== 'original' && materialMap[railingMaterial]) {
    prompt += `RAILING REPLACEMENT:
- Replace ALL existing balcony railings with ${materialMap[railingMaterial]}
- Ensure the new railings look modern and professional
- Maintain consistent style across all balconies

`;
  }

  prompt += `PRESERVATION REQUIREMENTS:
- Keep all windows, doors, and their frames unchanged
- Maintain the building's architectural structure and proportions
- Keep natural lighting and realistic shadows
- Preserve any unchanged elements exactly as they are
- Ensure the final result looks professional, realistic, and achievable

Make the transformation look natural and professionally executed.`;

  return prompt;
}

module.exports = { getGlazingOnlyPrompt, getFullModificationPrompt };
