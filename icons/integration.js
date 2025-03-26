/**
 * Integration file for the new 3D AI icons
 * This file demonstrates how to use the three separate icon files in the existing project
 */

// Icons reference table to help with selection
const aiIconTypes = {
    ani: "artificial-narrow-intelligence",
    generalAi: "general-ai",
    agi: "artificial-general-intelligence",
    asi: "artificial-superintelligence" // Using existing ASI icon
};

// Enhanced function to add icons to the pyramid layers
function addEnhancedAIIcons() {
    // Clear existing icons
    icons.forEach(icon => scene.remove(icon));
    icons = [];
    
    // Add ANI icon (bottom of pyramid)
    const aniIcon = createANIIcon(0, 1.2, 0, 0.6, colors.personalAI);
    scene.add(aniIcon);
    icons.push(aniIcon);
    
    // Add General AI icon (middle lower)
    const generalAiIcon = createGeneralAIIcon(-1.2, 2.4, 0, 0.6, colors.genAI);
    scene.add(generalAiIcon);
    icons.push(generalAiIcon);
    
    // Add AGI icon (middle upper)
    const agiIcon = createAGIIcon(1.2, 3.6, 0, 0.6, colors.agi);
    scene.add(agiIcon);
    icons.push(agiIcon);
    
    // Add ASI icon (top) - using existing pyramid glow icon
    const asiIcon = createPyramidGlowIcon(0, 5.4, 0, 0.6, colors.asi);
    scene.add(asiIcon);
    icons.push(asiIcon);
}

// Enhanced function to add icon to timeline item based on AI type
function addEnhancedIconToTimelineItem(eraId, x, y, z, scale) {
    let iconType = "";
    let iconColor = 0xffffff;
    
    // Match era to icon type
    if (eraId === "asi") {
        iconType = "pyramid-glow";
        iconColor = colors.asi;
    } else if (eraId === "agi") {
        iconType = "humanoid-brain";
        iconColor = colors.agi;
    } else if (["modernAI", "genAI", "personalAI"].includes(eraId)) {
        iconType = "brain-circuit";
        iconColor = colors[eraId];
    } else {
        iconType = "gear-magnifier";
        iconColor = colors[eraId];
    }
    
    // Create the appropriate icon
    let icon;
    
    if (iconType === "gear-magnifier") {
        icon = createANIIcon(x, y, z, scale, iconColor);
    } else if (iconType === "brain-circuit") {
        icon = createGeneralAIIcon(x, y, z, scale, iconColor);
    } else if (iconType === "humanoid-brain") {
        icon = createAGIIcon(x, y, z, scale, iconColor);
    } else if (iconType === "pyramid-glow") {
        icon = createPyramidGlowIcon(x, y, z, scale, iconColor);
    }
    
    if (icon) {
        scene.add(icon);
        icons.push(icon);
    }
    
    return icon;
}

// Enhanced animation loop that animates the new icons
function enhancedAnimateIcons(timeElapsed) {
    icons.forEach(icon => {
        // Determine which animation function to use based on the icon's structure
        if (icon.userData && icon.children) {
            // Check icon type by structure
            if (icon.children.length >= 4 && icon.children[0].type === "Mesh" && 
                icon.children[0].geometry.type.includes("CircleGeometry")) {
                // ANI icon (gear with magnifying glass)
                animateANIIcon(icon, timeElapsed);
            } else if (icon.children.length >= 12 && icon.children[12] && 
                       icon.children[12].type === "Points") {
                // AGI icon (humanoid with fractal brain)
                animateAGIIcon(icon, timeElapsed);
            } else if (icon.children.length >= 7 && 
                      icon.children[0].geometry.type.includes("SphereGeometry") && 
                      icon.children[1].geometry.type.includes("SphereGeometry")) {
                // General AI icon (brain with circuit)
                animateGeneralAIIcon(icon, timeElapsed);
            } else {
                // ASI icon (pyramid with glow)
                // Default rotation for other icons
                icon.rotation.y += 0.002;
            }
        }
    });
}

// Implementation guide:
/*
1. Include the new icon files in your index.html after Three.js but before script.js:
   <script src="icons/ani-icon.js"></script>
   <script src="icons/general-ai-icon.js"></script>
   <script src="icons/agi-icon.js"></script>
   <script src="icons/integration.js"></script>

2. In script.js, replace the existing addAIIcons() function with addEnhancedAIIcons()
   and replace addIconToTimelineItem() with addEnhancedIconToTimelineItem()

3. In the animate() function, add a call to enhancedAnimateIcons(elapsedTime) to 
   animate the new icons with their custom animations
*/
