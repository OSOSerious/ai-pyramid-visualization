// Initialize Three.js scene
let scene, camera, renderer, labelRenderer, controls;
let pyramid, labels = [];
let icons = []; // Store all 3D icons
let css2dLabels = []; // Store CSS2D labels
let isTimelineView = false;

// Presentation variables
let currentSlide = 1;
let totalSlides = 10;
let isFullscreen = false;

// Colors for each era
const colors = {
    asi: 0xe91e63,           // Pink - ASI
    agi: 0xffc107,           // Amber - AGI
    modernAI: 0x673ab7,      // Deep Purple - Modern AI
    genAI: 0x2196f3,         // Blue - Gen AI
    personalAI: 0x00bcd4,    // Cyan - Personal Assistant AI
    deepLearning: 0x009688,  // Teal - Deep Learning
    symbolicAI: 0x4caf50,    // Green - Symbolic AI
    earlyAI: 0x8bc34a,       // Light Green - Early AI
    cybernetics: 0xcddc39    // Lime - Cybernetics
};

// Timeline data with year ranges and descriptions
const timelineData = [
    {
        id: "cybernetics",
        name: "Cybernetics & Foundations",
        years: "1950-1960",
        color: colors.cybernetics,
        events: [
            { year: 1950, name: "Turing Test proposed by Alan Turing" },
            { year: 1956, name: "'Artificial Intelligence' term coined at Dartmouth Conference" },
            { year: 1958, name: "Perceptron invented by Frank Rosenblatt" }
        ]
    },
    {
        id: "earlyAI",
        name: "Early AI Research",
        years: "1960-1980",
        color: colors.earlyAI,
        events: [
            { year: 1966, name: "ELIZA chatbot created by Joseph Weizenbaum" },
            { year: 1969, name: "Shakey the Robot at Stanford Research Institute" },
            { year: 1971, name: "Project Cybersyn begins in Chile under Stafford Beer" }
        ]
    },
    {
        id: "symbolicAI",
        name: "Symbolic AI & Expert Systems",
        years: "1980-2000",
        color: colors.symbolicAI,
        events: [
            { year: 1980, name: "Expert systems become prominent" },
            { year: 1984, name: "First 'AI Winter' begins" },
            { year: 1997, name: "Deep Blue defeats Garry Kasparov at chess" }
        ]
    },
    {
        id: "deepLearning",
        name: "Deep Learning Revolution",
        years: "2000-2011",
        color: colors.deepLearning,
        events: [
            { year: 2006, name: "Deep learning breakthrough by Geoffrey Hinton" },
            { year: 2010, name: "ImageNet competition drives computer vision advances" },
            { year: 2011, name: "IBM Watson defeats humans on Jeopardy!" }
        ]
    },
    {
        id: "personalAI",
        name: "Personal AI Assistants",
        years: "2011-2017",
        color: colors.personalAI,
        events: [
            { year: 2011, name: "Apple launches Siri" },
            { year: 2014, name: "Amazon introduces Alexa" },
            { year: 2016, name: "Google Assistant debuts" }
        ]
    },
    {
        id: "genAI",
        name: "Early Generative AI",
        years: "2017-2020",
        color: colors.genAI,
        events: [
            { year: 2017, name: "Transformer architecture introduced by Google" },
            { year: 2018, name: "GPT-1 released by OpenAI" },
            { year: 2020, name: "GPT-3 demonstrates breakthrough capabilities" }
        ]
    },
    {
        id: "modernAI",
        name: "Modern AI",
        years: "2020-2025",
        color: colors.modernAI,
        events: [
            { year: 2021, name: "DALL-E and other multimodal models emerge" },
            { year: 2022, name: "ChatGPT popularizes AI for general public" },
            { year: 2023, name: "GPT-4 and advancement of AI agents" }
        ]
    },
    {
        id: "agi",
        name: "AGI (Approaching)",
        years: "Future",
        color: colors.agi,
        events: [
            { year: "?", name: "Human-level intelligence across domains" },
            { year: "?", name: "Systems that can learn any intellectual task" },
            { year: "?", name: "Self-improvement capabilities" }
        ]
    },
    {
        id: "asi",
        name: "ASI (Theoretical)",
        years: "Beyond AGI",
        color: colors.asi,
        events: [
            { year: "?", name: "Superintelligence surpassing human capabilities" },
            { year: "?", name: "Ability to solve problems beyond human comprehension" },
            { year: "?", name: "Potential technological singularity" }
        ]
    }
];

// Initialize the scene
function init() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x121212);

    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth * 0.7 / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 5);

    // Create renderer with improved settings
    renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth * 0.7, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    document.getElementById('pyramid-container').appendChild(renderer.domElement);
    
    // Create CSS2D renderer for labels with improved settings
    labelRenderer = new THREE.CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth * 0.7, window.innerHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0';
    labelRenderer.domElement.style.pointerEvents = 'none';
    labelRenderer.domElement.classList.add('css2d-labels');
    document.getElementById('pyramid-container').appendChild(labelRenderer.domElement);

    // Add enhanced orbit controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.7;
    controls.minDistance = 3;
    controls.maxDistance = 10;
    controls.maxPolarAngle = Math.PI / 1.5; // Limit rotation to prevent seeing under the pyramid
    controls.addEventListener('change', onControlsChange);

    // Add improved lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // Add rim light for better definition
    const rimLight = new THREE.DirectionalLight(0x4fc3f7, 0.3);
    rimLight.position.set(-1, 0, -1);
    scene.add(rimLight);

    // Create pyramid
    createPyramid();

    // Add event listeners
    window.addEventListener('resize', onWindowResize);
    document.getElementById('toggle-view').addEventListener('click', toggleView);
    renderer.domElement.addEventListener('click', onPyramidClick);

    // Start animation loop
    animate();
}

// Handle controls change event
function onControlsChange() {
    // Update CSS2D labels to always face the camera
    css2dLabels.forEach(label => {
        const parent = label.parent;
        if (parent) {
            // Store the original position
            const position = label.position.clone();
            // Temporarily remove from parent to reset transformations
            parent.remove(label);
            // Add back at original position
            label.position.copy(position);
            parent.add(label);
        }
    });
    
    // Synchronize info panel with current view
    synchronizeInfoPanel();
}

// Synchronize the info panel with the current view
function synchronizeInfoPanel() {
    if (isTimelineView) return; // Only for pyramid view
    
    // Find which layer is most prominently in view
    const cameraPosition = camera.position.clone();
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    const raycaster = new THREE.Raycaster(cameraPosition, forward);
    
    // Filter for pyramid layer meshes
    const pyramidLayers = [];
    pyramid.traverse(child => {
        if (child.isMesh && child.userData && child.userData.layerId) {
            pyramidLayers.push(child);
        }
    });
    
    // Check for intersections
    const intersects = raycaster.intersectObjects(pyramidLayers);
    if (intersects.length > 0) {
        const hitObject = intersects[0].object;
        if (hitObject.userData && hitObject.userData.layerId) {
            highlightInfoSection(hitObject.userData.layerId);
        }
    }
}

// Handle click events on the pyramid
function onPyramidClick(event) {
    // Calculate mouse position
    const rect = renderer.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    // Set up raycaster
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    
    // Filter for pyramid layer meshes
    const pyramidLayers = [];
    pyramid.traverse(child => {
        if (child.isMesh && child.userData && child.userData.layerId) {
            pyramidLayers.push(child);
        }
    });
    
    // Check for intersections
    const intersects = raycaster.intersectObjects(pyramidLayers);
    if (intersects.length > 0) {
        const hitObject = intersects[0].object;
        if (hitObject.userData && hitObject.userData.layerId) {
            // Highlight corresponding info section
            highlightInfoSection(hitObject.userData.layerId);
            
            // Animate camera to focus on clicked layer
            animateCameraToLayer(hitObject);
        }
    }
}

// Highlight the corresponding info section in the panel
function highlightInfoSection(layerId) {
    // Remove active class from all info sections
    document.querySelectorAll('.info-panel .level').forEach(el => {
        el.classList.remove('active-info');
    });
    
    // Add active class to the selected section
    const infoSection = document.getElementById(`${layerId}-info`);
    if (infoSection) {
        infoSection.classList.add('active-info');
        // Scroll to the section
        infoSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Animate camera to focus on a specific layer
function animateCameraToLayer(layerMesh) {
    const layer = layerMesh.userData;
    const layerPosition = new THREE.Vector3();
    layerMesh.getWorldPosition(layerPosition);
    
    // Calculate target position based on layer height
    const totalLayers = timelineData.length;
    const layerIndex = layer.layerIndex;
    const normalizedHeight = layerIndex / totalLayers; // 0 to 1
    
    // Adjust camera target based on layer position
    const targetPosition = new THREE.Vector3(
        camera.position.x * 0.7,
        layerPosition.y, 
        camera.position.z * 0.7
    );
    
    // Animate the camera movement
    const startPosition = camera.position.clone();
    const duration = 1000; // ms
    const startTime = Date.now();
    
    function updateCamera() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Use easing function for smoother movement
        const easeProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease out
        
        // Update camera position
        camera.position.lerpVectors(startPosition, targetPosition, easeProgress);
        
        // Look at the layer
        camera.lookAt(layerPosition);
        
        // Continue animation if not complete
        if (progress < 1) {
            requestAnimationFrame(updateCamera);
        } else {
            // When animation completes, restore orbit controls
            controls.target.copy(layerPosition);
            controls.update();
        }
    }
    
    // Start the animation
    updateCamera();
}

// Create the layered pyramid
function createPyramid() {
    // Clear any existing pyramid, labels and icons
    if (pyramid) {
        scene.remove(pyramid);
    }
    
    labels.forEach(label => scene.remove(label));
    labels = [];
    
    icons.forEach(icon => scene.remove(icon));
    icons = [];
    
    // Clear CSS2D labels
    css2dLabels.forEach(label => scene.remove(label));
    css2dLabels = [];
    
    // Create a new group for the pyramid
    pyramid = new THREE.Group();
    scene.add(pyramid);
    
    if (isTimelineView) {
        createTimelineVisualization();
    } else {
        createLayeredPyramid();
        // Create the layer connections after the pyramid is built
        createPyramidConnections();
        // Add 3D icons for each AI type
        addAIIcons();
    }
}

// Create the original layered pyramid
function createLayeredPyramid() {
    // Adjust these values based on how many layers we want to show
    const totalLayers = timelineData.length;
    const baseWidth = 3.6; // Slightly wider base for better visibility
    const topWidth = 0;
    const totalHeight = 7; // Taller pyramid to space out layers better
    const layerHeight = totalHeight / totalLayers;
    
    // Create each layer of the pyramid from bottom to top
    for (let i = 0; i < totalLayers; i++) {
        const layer = timelineData[i];
        const bottomRadius = baseWidth * (1 - i / totalLayers);
        const topRadius = baseWidth * (1 - (i + 1) / totalLayers);
        
        // Create the layer geometry with more segments for smoother appearance
        const layerGeometry = new THREE.CylinderGeometry(
            topRadius,
            bottomRadius,
            layerHeight,
            12, // More segments for smoother pyramid
            1,
            false
        );
        
        // Create material with refined appearance
        const layerMaterial = new THREE.MeshPhongMaterial({
            color: layer.color,
            transparent: true,
            opacity: 0.85, // Slightly more opaque
            flatShading: false, // Smooth shading
            shininess: 60, // More shininess for better visual
            specular: 0x222222 // Add specular highlight
        });
        
        const layerMesh = new THREE.Mesh(layerGeometry, layerMaterial);
        layerMesh.position.y = (i * layerHeight) + (layerHeight / 2);
        layerMesh.rotation.y = Math.PI / 4;
        
        // Store reference to layer ID in mesh for interaction
        layerMesh.userData = { layerId: layer.id, layerIndex: i };
        
        pyramid.add(layerMesh);
        
        // Add visual embellishments to the layer
        addLayerEmbellishments(layerMesh, layer, i, totalLayers, layerHeight, bottomRadius);
        
        // Add text label for this layer with better positioning
        const yPosition = i * layerHeight + layerHeight / 2;
        
        // Calculate offset based on layer position
        const zOffset = bottomRadius * 1.6 + 0.3; // Increased offset for better readability
        
        // For top layers (ASI and AGI), position text differently
        const isTopLayer = i >= totalLayers - 2;
        
        // Improved text sizes for better hierarchy
        const nameSize = Math.max(0.13, 0.16 - (i * 0.003));
        const yearSize = Math.max(0.08, 0.10 - (i * 0.002));
        const milestoneSize = Math.max(0.07, 0.08 - (i * 0.001));
        
        // Add the era name with enhanced styling
        const nameLabel = addText(
            layer.name, 
            0, 
            yPosition, 
            zOffset, 
            nameSize, 
            0xffffff
        );
        
        // Add the year range with better styling
        const yearLabel = addText(
            layer.years, 
            0, 
            yPosition - (layerHeight * 0.22), 
            zOffset, 
            yearSize, 
            0xdddddd
        );
        
        // Add informative events with better formatting
        if (layer.events && layer.events.length > 0) {
            // Display multiple events for more information
            const eventCount = Math.min(layer.events.length, isTopLayer ? 2 : 2);
            
            for (let j = 0; j < eventCount; j++) {
                const milestone = layer.events[j];
                
                if (milestone) {
                    // Format milestone text for better readability
                    const yearPart = milestone.year.toString();
                    const namePart = milestone.name;
                    
                    // Different formatting based on the era
                    let milestoneText;
                    if (isTopLayer) {
                        milestoneText = namePart;
                    } else {
                        milestoneText = yearPart !== "?" ? `${yearPart}: ${namePart}` : namePart;
                    }
                    
                    // Position events with proper spacing
                    addText(
                        milestoneText, 
                        0, 
                        yPosition - (layerHeight * (0.35 + j * 0.18)), 
                        zOffset, 
                        milestoneSize, 
                        0xcccccc
                    );
                }
            }
            
            // Add a connecting line from the pyramid to the text for better visual association
            addConnectingLine(
                0, yPosition, bottomRadius * 0.5,
                0, yPosition, zOffset - 0.2,
                0xcccccc, 0.5
            );
        }
        
        // Create highlighted connections between adjacent layers
        if (i < totalLayers - 1) {
            const nextLayerY = (i + 1) * layerHeight + (layerHeight / 2);
            const nextLayerRadius = baseWidth * (1 - (i + 1) / totalLayers);
            
            // Add vertical connecting visual element
            addLayerConnection(yPosition, nextLayerY, bottomRadius, nextLayerRadius, layer.color);
        }
    }
}

// Add visual embellishments to the pyramid layer
function addLayerEmbellishments(layerMesh, layer, layerIndex, totalLayers, layerHeight, radius) {
    // Add a highlight ring at the top edge of each layer
    const ringGeometry = new THREE.TorusGeometry(radius * 0.95, radius * 0.02, 16, 32);
    const ringMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3,
        shininess: 100
    });
    
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.y = layerIndex * layerHeight + layerHeight;
    ring.rotation.x = Math.PI / 2;
    pyramid.add(ring);
    
    // For important layers, add animated particles
    if (layerIndex === totalLayers - 1 || // ASI layer
        layerIndex === totalLayers - 2 || // AGI layer
        layerIndex === totalLayers - 3) { // General AI layer
        
        // Add particle effect around the layer
        const particlesCount = 15 - (5 * (totalLayers - 1 - layerIndex));
        const particleSize = 0.03;
        
        const particlesGeometry = new THREE.BufferGeometry();
        const particlePositions = [];
        
        for (let i = 0; i < particlesCount; i++) {
            const angle = (i / particlesCount) * Math.PI * 2;
            const radiusVariation = radius * (0.8 + Math.random() * 0.3);
            
            particlePositions.push(
                Math.cos(angle) * radiusVariation,
                layerIndex * layerHeight + layerHeight / 2 + (Math.random() * 0.4 - 0.2),
                Math.sin(angle) * radiusVariation
            );
        }
        
        particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(particlePositions, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            color: layer.color,
            size: particleSize,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending
        });
        
        const particles = new THREE.Points(particlesGeometry, particleMaterial);
        particles.userData = { layerId: layer.id, type: 'particles', initialY: particles.position.y };
        pyramid.add(particles);
    }
}

// Add a visual connection between adjacent layers
function addLayerConnection(y1, y2, radius1, radius2, color) {
    // Create connection points around the circumference
    const connectionCount = 4;
    
    for (let i = 0; i < connectionCount; i++) {
        const angle = (i / connectionCount) * Math.PI * 2;
        const x1 = Math.cos(angle) * radius1 * 0.6;
        const z1 = Math.sin(angle) * radius1 * 0.6;
        
        const x2 = Math.cos(angle) * radius2 * 0.6;
        const z2 = Math.sin(angle) * radius2 * 0.6;
        
        // Create a line connecting the layers
        addLine(x1, y1, z1, x2, y2, z2, color, 0.7);
    }
}

// Add a connecting line for visual association
function addConnectingLine(x1, y1, z1, x2, y2, z2, color, opacity = 1.0) {
    const material = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: opacity
    });
    
    const geometry = new THREE.BufferGeometry();
    const points = [new THREE.Vector3(x1, y1, z1), new THREE.Vector3(x2, y2, z2)];
    geometry.setFromPoints(points);
    
    const line = new THREE.Line(geometry, material);
    pyramid.add(line);
    
    return line;
}

// Create the pyramid with proper layer connections
function createPyramidConnections() {
    const totalLayers = timelineData.length;
    const totalHeight = 7;
    const layerHeight = totalHeight / totalLayers;
    
    // Add arrows to show progression between layers with better visibility
    for (let i = 0; i < totalLayers - 1; i++) {
        const yPosition = i * layerHeight + layerHeight / 2;
        addArrow(yPosition + layerHeight * 0.5, 1, 0xffffff);
    }
    
    // Position the pyramid with better centering
    pyramid.position.y = -totalHeight / 2 + 0.5; // Slight adjustment for better view
}

// Create the timeline visualization
function createTimelineVisualization() {
    // Clear existing icons
    icons.forEach(icon => scene.remove(icon));
    icons = [];
    
    const totalEvents = timelineData.length;
    const spacing = 2.0; // More spacing between columns
    const width = 1.2; // Wider blocks for better readability
    const depth = 1.0; // Deeper blocks for better 3D effect
    
    // Create each era as a vertical column with improved layout
    for (let i = 0; i < totalEvents; i++) {
        const era = timelineData[i];
        const xPosition = (i - (totalEvents - 1) / 2) * spacing;
        const height = 0.7 + (i * 0.35); // Taller blocks with more distinction
        
        // Create the era block with better materials
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const material = new THREE.MeshPhongMaterial({
            color: era.color,
            transparent: true,
            opacity: 0.85,
            shininess: 40,
            flatShading: false
        });
        
        const block = new THREE.Mesh(geometry, material);
        block.position.set(xPosition, height / 2, 0);
        
        // Add a subtle animation effect
        const originalY = block.position.y;
        block.userData = { 
            originalY: originalY,
            animate: true
        };
        
        pyramid.add(block);
        
        // Add text labels with better positioning and sizes
        // Era name (e.g., "Modern AI", "AGI")
        addText(
            era.name, 
            xPosition, 
            height + 0.3, // Position higher above the block
            0, 
            0.14, // Larger text size
            0xffffff
        );
        
        // Year range (e.g., "2020-2025", "Future")
        addText(
            era.years, 
            xPosition, 
            height + 0.7, // Position higher for better separation 
            0, 
            0.11, // Larger text size
            0xdddddd
        );
        
        // Add key events with improved formatting and positioning
        // Limit to max 3 events per column for readability
        const displayEvents = era.events.slice(0, 3);
        
        // Add AI icon to the top of the column for certain eras
        if (era.id === "modernAI" || era.id === "genAI" || era.id === "personalAI" || era.id === "deepLearning") {
            addIconToTimelineItem(era.id, xPosition, height + 1.2, 0, 0.4);
        } else if (era.id === "agi") {
            addIconToTimelineItem("agi", xPosition, height + 1.2, 0, 0.5);
        } else if (era.id === "asi") {
            addIconToTimelineItem("asi", xPosition, height + 1.2, 0, 0.5);
        }
        
        displayEvents.forEach((event, eventIndex) => {
            // Format the event text for better readability
            let eventYear = typeof event.year === 'string' ? event.year : event.year.toString();
            let eventName = event.name;
            
            // Truncate long event names for better display
            if (eventName.length > 25) {
                eventName = eventName.substring(0, 22) + '...';
            }
            
            const eventText = `${eventYear}: ${eventName}`;
            
            // Position events with better spacing
            addText(
                eventText, 
                xPosition, 
                height / 2 - 0.2 - (eventIndex * 0.4), // More spacing between events 
                depth / 2 + 0.1, // Position more forward for better visibility
                0.08, // Larger text size
                0xffffff
            );
        });
        
        // Add connecting lines between eras with improved styling
        if (i < totalEvents - 1) {
            const nextEra = timelineData[i + 1];
            const nextXPosition = (i + 1 - (totalEvents - 1) / 2) * spacing;
            const nextHeight = 0.7 + ((i + 1) * 0.35);
            
            // Create curved connector instead of straight line
            const curve = new THREE.QuadraticBezierCurve3(
                new THREE.Vector3(xPosition + width / 2, height, 0),
                new THREE.Vector3((xPosition + nextXPosition) / 2, Math.max(height, nextHeight) + 0.5, 0),
                new THREE.Vector3(nextXPosition - width / 2, nextHeight, 0)
            );
            
            const points = curve.getPoints(20);
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({
                color: 0x4fc3f7,
                linewidth: 2,
                opacity: 0.8,
                transparent: true
            });
            
            const curvedLine = new THREE.Line(geometry, material);
            pyramid.add(curvedLine);
        }
    }
    
    // Position the timeline and adjust camera for better viewing
    pyramid.position.y = -1.5;
    
    // Adjust camera for better viewing of the timeline
    camera.position.set(0, 4, 12);
    controls.update();
}

// Create and add 3D icons for AI types to the pyramid
function addAIIcons() {
    // Define icon positions based on pyramid layers
    const totalLayers = timelineData.length;
    const baseWidth = 3.5;
    const totalHeight = 7;
    const layerHeight = totalHeight / totalLayers;
    
    // Add ANI (Narrow AI) icon - single gear with magnifying glass
    // Position near the middle-lower part of the pyramid 
    const narrowAILayer = 3; // deepLearning layer 
    const narrowY = narrowAILayer * layerHeight + (layerHeight / 2);
    const narrowRadius = baseWidth * (1 - narrowAILayer / totalLayers) * 1.2;
    const aniIcon = createGearMagnifierIcon(0, narrowY, narrowRadius, 0.5, 0x039be5); // Light blue for ANI
    addCSS2DLabel(aniIcon, "Artificial Narrow Intelligence", "Specialized in single tasks", "ani-label", 1.2);
    
    // Add General AI icon - brain with circuitry
    // Position in the middle-upper part of the pyramid
    const generalAILayer = 5; // genAI layer
    const generalY = generalAILayer * layerHeight + (layerHeight / 2);
    const generalRadius = baseWidth * (1 - generalAILayer / totalLayers) * 1.2;
    const generalAIIcon = createBrainCircuitIcon(0, generalY, generalRadius, 0.5, 0x00a896); // Teal for General AI
    addCSS2DLabel(generalAIIcon, "General AI", "Capable of learning multiple tasks", "general-ai-label", 1.2);
    
    // Add AGI icon - humanoid with brain
    // Position near the top of the pyramid
    const agiLayer = totalLayers - 2; // AGI layer
    const agiY = agiLayer * layerHeight + (layerHeight / 2);
    const agiRadius = baseWidth * (1 - agiLayer / totalLayers) * 1.2;
    const agiIcon = createHumanoidBrainIcon(0, agiY, agiRadius, 0.5, 0xffa000); // Gold/Orange for AGI
    addCSS2DLabel(agiIcon, "Artificial General Intelligence", "Human-level intelligence across domains", "agi-label", 1.2);
    
    // Add ASI icon - pyramid with glowing apex
    // Position at the very top of the pyramid
    const asiLayer = totalLayers - 1; // ASI layer
    const asiY = asiLayer * layerHeight + (layerHeight / 2);
    const asiRadius = baseWidth * (1 - asiLayer / totalLayers) * 1.2;
    const asiIcon = createPyramidGlowIcon(0, asiY, asiRadius, 0.5, 0x7b1fa2); // Purple for ASI
    addCSS2DLabel(asiIcon, "Artificial Superintelligence", "Beyond human capabilities in all domains", "asi-label", 1.2);
}

// Add icon to timeline item based on AI type
function addIconToTimelineItem(eraId, x, y, z, scale) {
    // Map era IDs to specific icon types, colors, and labels
    let iconType, iconColor, title, description, labelClass;
    
    if (eraId === "asi") {
        iconType = "pyramid-glow";
        iconColor = 0x7b1fa2; // Purple
        title = "ASI";
        description = "Artificial Superintelligence";
        labelClass = "asi-label";
    } else if (eraId === "agi") {
        iconType = "humanoid-brain";
        iconColor = 0xffa000; // Gold/Orange
        title = "AGI";
        description = "Artificial General Intelligence";
        labelClass = "agi-label";
    } else if (eraId === "modernAI" || eraId === "genAI") {
        iconType = "brain-circuit";
        iconColor = 0x00a896; // Teal
        title = "General AI";
        description = "Multi-domain capabilities";
        labelClass = "general-ai-label";
    } else {
        iconType = "gear-magnifier";
        iconColor = 0x039be5; // Light Blue
        title = "ANI";
        description = "Artificial Narrow Intelligence";
        labelClass = "ani-label";
    }
    
    // Create the actual icon
    let icon;
    if (iconType === "gear-magnifier") {
        icon = createGearMagnifierIcon(x, y, z, scale, iconColor);
    } else if (iconType === "brain-circuit") {
        icon = createBrainCircuitIcon(x, y, z, scale, iconColor);
    } else if (iconType === "humanoid-brain") {
        icon = createHumanoidBrainIcon(x, y, z, scale, iconColor);
    } else if (iconType === "pyramid-glow") {
        icon = createPyramidGlowIcon(x, y, z, scale, iconColor);
    }
    
    // Add CSS2D label to the icon
    addCSS2DLabel(icon, title, description, labelClass, scale * 1.5);
    
    return icon;
}

// Create Gear with Magnifying Glass icon (ANI - Artificial Narrow Intelligence)
function createGearMagnifierIcon(x, y, z, scale, color) {
    const iconGroup = new THREE.Group();
    
    // Create gear
    const gearGeometry = new THREE.CircleGeometry(0.5, 8);
    const gearMaterial = new THREE.MeshPhongMaterial({ 
        color: color,
        flatShading: true,
        shininess: 50
    });
    const gear = new THREE.Mesh(gearGeometry, gearMaterial);
    
    // Add teeth to the gear
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const toothGeometry = new THREE.BoxGeometry(0.15, 0.15, 0.05);
        const tooth = new THREE.Mesh(toothGeometry, gearMaterial);
        tooth.position.set(Math.cos(angle) * 0.5, Math.sin(angle) * 0.5, 0);
        tooth.rotation.z = angle;
        gear.add(tooth);
    }
    
    // Create magnifying glass handle
    const handleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.6, 8);
    const handleMaterial = new THREE.MeshPhongMaterial({
        color: 0x555555,
        flatShading: true
    });
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    handle.rotation.z = Math.PI / 4;
    handle.position.set(0.4, -0.4, 0.1);
    
    // Create magnifying glass frame
    const frameGeometry = new THREE.RingGeometry(0.3, 0.35, 16);
    const frameMaterial = new THREE.MeshPhongMaterial({
        color: 0x777777,
        side: THREE.DoubleSide
    });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.position.set(0.2, 0.2, 0.1);
    
    // Create magnifying glass lens
    const lensGeometry = new THREE.CircleGeometry(0.3, 16);
    const lensMaterial = new THREE.MeshPhongMaterial({
        color: 0xadd8e6,
        transparent: true,
        opacity: 0.7,
        shininess: 80
    });
    const lens = new THREE.Mesh(lensGeometry, lensMaterial);
    lens.position.set(0.2, 0.2, 0.09);
    
    // Add all components to group
    iconGroup.add(gear);
    iconGroup.add(handle);
    iconGroup.add(frame);
    iconGroup.add(lens);
    
    // Position and scale the icon
    iconGroup.position.set(x, y, z);
    iconGroup.scale.set(scale, scale, scale);
    
    // Add to scene and store reference
    scene.add(iconGroup);
    icons.push(iconGroup);
    
    return iconGroup;
}

// Create Brain with Circuit icon (General AI)
function createBrainCircuitIcon(x, y, z, scale, color) {
    const iconGroup = new THREE.Group();
    
    // Create brain hemisphere shapes
    const leftHemisphereGeometry = new THREE.SphereGeometry(0.4, 12, 12, 0, Math.PI);
    const rightHemisphereGeometry = new THREE.SphereGeometry(0.4, 12, 12, Math.PI, Math.PI);
    
    const brainMaterial = new THREE.MeshPhongMaterial({
        color: color,
        flatShading: true,
        shininess: 60
    });
    
    const leftHemisphere = new THREE.Mesh(leftHemisphereGeometry, brainMaterial);
    leftHemisphere.position.set(-0.05, 0, 0);
    
    const rightHemisphere = new THREE.Mesh(rightHemisphereGeometry, brainMaterial);
    rightHemisphere.position.set(0.05, 0, 0);
    
    // Add brain grooves (wrinkles)
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI;
        const grooveGeometry = new THREE.TorusGeometry(0.25, 0.02, 8, 12, Math.PI);
        const groove = new THREE.Mesh(grooveGeometry, brainMaterial);
        groove.position.y = Math.sin(angle) * 0.2;
        groove.rotation.x = Math.PI / 2;
        groove.rotation.y = angle;
        iconGroup.add(groove);
    }
    
    // Add circuit patterns to brain
    const circuitMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.8
    });
    
    // Create circuit lines
    for (let i = 0; i < 5; i++) {
        const lineGeometry = new THREE.BoxGeometry(0.3 + (i * 0.05), 0.01, 0.01);
        const line = new THREE.Mesh(lineGeometry, circuitMaterial);
        line.position.set(0, -0.1 + (i * 0.08), 0.36);
        iconGroup.add(line);
        
        // Create nodes/connection points
        const nodeGeometry = new THREE.SphereGeometry(0.02, 6, 6);
        const node = new THREE.Mesh(nodeGeometry, circuitMaterial);
        node.position.set(0.15 + (i * 0.02), -0.1 + (i * 0.08), 0.36);
        iconGroup.add(node);
    }
    
    // Add components to group
    iconGroup.add(leftHemisphere);
    iconGroup.add(rightHemisphere);
    
    // Create glowing effect
    const glowGeometry = new THREE.SphereGeometry(0.45, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.2,
        side: THREE.BackSide
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    iconGroup.add(glow);
    
    // Position and scale
    iconGroup.position.set(x, y, z);
    iconGroup.scale.set(scale, scale, scale);
    
    // Add to scene and store reference
    scene.add(iconGroup);
    icons.push(iconGroup);
    
    return iconGroup;
}

// Create Humanoid with Fractal Brain icon (AGI)
function createHumanoidBrainIcon(x, y, z, scale, color) {
    const iconGroup = new THREE.Group();
    
    // Create humanoid head
    const headGeometry = new THREE.SphereGeometry(0.25, 16, 16);
    const headMaterial = new THREE.MeshPhongMaterial({
        color: 0xf5deb3, // Slightly human-like color
        shininess: 30
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 0.4;
    
    // Create body
    const bodyGeometry = new THREE.CylinderGeometry(0.15, 0.2, 0.4, 8);
    const bodyMaterial = new THREE.MeshPhongMaterial({
        color: 0x444444,
        flatShading: true
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.1;
    
    // Create fractal brain (glowing)
    const brainGeometry = new THREE.IcosahedronGeometry(0.2, 1); // Fractal-like geometry
    const brainMaterial = new THREE.MeshPhongMaterial({
        color: color,
        transparent: true,
        opacity: 0.9,
        emissive: color,
        emissiveIntensity: 0.5,
        shininess: 100
    });
    const brain = new THREE.Mesh(brainGeometry, brainMaterial);
    brain.position.y = 0.45;
    brain.scale.set(0.7, 1, 0.7);
    
    // Create glowing effect around brain
    const glowGeometry = new THREE.SphereGeometry(0.25, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.4,
        side: THREE.BackSide
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.y = 0.45;
    glow.scale.set(1, 1.2, 1);
    
    // Create arms
    const armGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.4, 8);
    const leftArm = new THREE.Mesh(armGeometry, bodyMaterial);
    leftArm.position.set(-0.22, 0.15, 0);
    leftArm.rotation.z = Math.PI / 6;
    
    const rightArm = new THREE.Mesh(armGeometry, bodyMaterial);
    rightArm.position.set(0.22, 0.15, 0);
    rightArm.rotation.z = -Math.PI / 6;
    
    // Add all components
    iconGroup.add(head);
    iconGroup.add(body);
    iconGroup.add(brain);
    iconGroup.add(glow);
    iconGroup.add(leftArm);
    iconGroup.add(rightArm);
    
    // Add energy connections between brain and body
    for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2;
        const x = Math.cos(angle) * 0.15;
        const z = Math.sin(angle) * 0.15;
        
        const connectionGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.2, 4);
        const connectionMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.7
        });
        const connection = new THREE.Mesh(connectionGeometry, connectionMaterial);
        connection.position.set(x, 0.3, z);
        iconGroup.add(connection);
    }
    
    // Position and scale icon
    iconGroup.position.set(x, y, z);
    iconGroup.scale.set(scale, scale, scale);
    
    // Add to scene and store reference
    scene.add(iconGroup);
    icons.push(iconGroup);
    
    return iconGroup;
}

// Create Pyramid with Glowing Apex icon (ASI)
function createPyramidGlowIcon(x, y, z, scale, color) {
    const iconGroup = new THREE.Group();
    
    // Create pyramid base
    const pyramidGeometry = new THREE.ConeGeometry(0.4, 0.6, 4);
    const pyramidMaterial = new THREE.MeshPhongMaterial({
        color: color,
        flatShading: true,
        shininess: 70
    });
    const pyramid = new THREE.Mesh(pyramidGeometry, pyramidMaterial);
    pyramid.rotation.y = Math.PI / 4; // Align the pyramid faces
    
    // Create glowing apex
    const apexGeometry = new THREE.SphereGeometry(0.12, 16, 16);
    const apexMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 1,
        transparent: true,
        opacity: 0.9,
        shininess: 100
    });
    const apex = new THREE.Mesh(apexGeometry, apexMaterial);
    apex.position.y = 0.4;
    
    // Create outer glow for apex
    const glowGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.4,
        side: THREE.BackSide
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.y = 0.4;
    
    // Create cosmic/galaxy elements around the pyramid
    const particleCount = 20;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    const colorOptions = [
        new THREE.Color(0x7b1fa2), // Purple
        new THREE.Color(0x9c27b0), // Light purple
        new THREE.Color(0x3f51b5), // Indigo
        new THREE.Color(0xffffff)  // White
    ];
    
    for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 0.3 + Math.random() * 0.7;
        const height = (Math.random() - 0.5) * 0.8;
        
        const ix = i * 3;
        positions[ix] = Math.cos(angle) * radius;
        positions[ix + 1] = height;
        positions[ix + 2] = Math.sin(angle) * radius;
        
        const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
        colors[ix] = color.r;
        colors[ix + 1] = color.g;
        colors[ix + 2] = color.b;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.05,
        transparent: true,
        opacity: 0.7,
        vertexColors: true
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    
    // Add cosmic rays/beams from the apex
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const beamGeometry = new THREE.CylinderGeometry(0.005, 0.02, 0.6, 4);
        const beamMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.6
        });
        const beam = new THREE.Mesh(beamGeometry, beamMaterial);
        beam.position.set(
            Math.cos(angle) * 0.3,
            0.2,
            Math.sin(angle) * 0.3
        );
        beam.rotation.x = Math.PI / 2;
        beam.rotation.z = angle;
        iconGroup.add(beam);
    }
    
    // Add all components
    iconGroup.add(pyramid);
    iconGroup.add(apex);
    iconGroup.add(glow);
    iconGroup.add(particles);
    
    // Position and scale icon
    iconGroup.position.set(x, y, z);
    iconGroup.scale.set(scale, scale, scale);
    
    // Add to scene and store reference
    scene.add(iconGroup);
    icons.push(iconGroup);
    
    return iconGroup;
}

// Toggle between pyramid and timeline views
function toggleView() {
    isTimelineView = !isTimelineView;
    const button = document.getElementById('toggle-view');
    button.textContent = isTimelineView ? 
        'Switch to Pyramid View' : 
        'Switch to Timeline View';
    
    // Clear the scene
    labels.forEach(label => scene.remove(label));
    labels = [];
    
    if (pyramid) {
        scene.remove(pyramid);
    }
    
    // Create the new visualization
    createPyramid();
    
    // Adjust camera for the specific view
    if (isTimelineView) {
        // Timeline view - position camera to see full timeline
        camera.position.set(0, 4, 12);
    } else {
        // Pyramid view - reset to default camera position
        camera.position.set(0, 2, 5);
    }
    
    // Update controls and camera
    controls.update();
}

// Helper function to add text to the scene with enhanced readability
function addText(text, x, y, z, size, color) {
    // Create canvas for text with even higher resolution for razor-sharp text
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 2048; // High resolution for sharper text
    canvas.height = 1024; // Taller canvas for better formatting of multi-line text
    
    // Determine if this is a title (larger text typically at the top)
    const isTitle = size >= 0.1;
    const isSubtitle = size >= 0.08 && size < 0.1;
    
    // Create gradient background for better visual appeal
    const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
    // Use more opacity for titles, less for details
    const baseOpacity = isTitle ? 0.85 : (isSubtitle ? 0.8 : 0.75);
    
    gradient.addColorStop(0, `rgba(20, 20, 40, ${baseOpacity})`);
    gradient.addColorStop(1, `rgba(10, 10, 20, ${baseOpacity})`);
    
    // Add rounded rectangle with gradient background
    const cornerRadius = 50; // More rounded corners
    context.fillStyle = gradient;
    
    // Draw rounded rectangle with proper border radius
    context.beginPath();
    context.moveTo(cornerRadius, 0);
    context.lineTo(canvas.width - cornerRadius, 0);
    context.quadraticCurveTo(canvas.width, 0, canvas.width, cornerRadius);
    context.lineTo(canvas.width, canvas.height - cornerRadius);
    context.quadraticCurveTo(canvas.width, canvas.height, canvas.width - cornerRadius, canvas.height);
    context.lineTo(cornerRadius, canvas.height);
    context.quadraticCurveTo(0, canvas.height, 0, canvas.height - cornerRadius);
    context.lineTo(0, cornerRadius);
    context.quadraticCurveTo(0, 0, cornerRadius, 0);
    context.closePath();
    context.fill();
    
    // Add a subtle glow border effect
    const colorObj = new THREE.Color(color);
    const borderGlow = `rgba(${Math.floor(colorObj.r * 255)}, ${Math.floor(colorObj.g * 255)}, ${Math.floor(colorObj.b * 255)}, 0.8)`;
    
    // Create subtle outer glow
    const glowSize = 15;
    context.shadowColor = borderGlow;
    context.shadowBlur = glowSize;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    
    // Inner border with subtle gradient
    const borderGradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
    borderGradient.addColorStop(0, borderGlow);
    borderGradient.addColorStop(1, `rgba(${Math.floor(colorObj.r * 255)}, ${Math.floor(colorObj.g * 255)}, ${Math.floor(colorObj.b * 255)}, 0.4)`);
    
    context.strokeStyle = borderGradient;
    context.lineWidth = isTitle ? 12 : 8;
    
    // Draw inner border with more padding for better spacing
    const borderPadding = 20;
    context.beginPath();
    context.moveTo(cornerRadius + borderPadding, borderPadding);
    context.lineTo(canvas.width - cornerRadius - borderPadding, borderPadding);
    context.quadraticCurveTo(canvas.width - borderPadding, borderPadding, canvas.width - borderPadding, cornerRadius + borderPadding);
    context.lineTo(canvas.width - borderPadding, canvas.height - cornerRadius - borderPadding);
    context.quadraticCurveTo(canvas.width - borderPadding, canvas.height - borderPadding, canvas.width - cornerRadius - borderPadding, canvas.height - borderPadding);
    context.lineTo(cornerRadius + borderPadding, canvas.height - borderPadding);
    context.quadraticCurveTo(borderPadding, canvas.height - borderPadding, borderPadding, canvas.height - cornerRadius - borderPadding);
    context.lineTo(borderPadding, cornerRadius + borderPadding);
    context.quadraticCurveTo(borderPadding, borderPadding, cornerRadius + borderPadding, borderPadding);
    context.closePath();
    context.stroke();
    
    // Reset shadow for text drawing
    context.shadowBlur = 0;
    
    // Calculate appropriate font size based on content and importance
    let fontSize = isTitle ? 100 : (isSubtitle ? 80 : 65);
    
    // Use a more readable font with proper fallbacks
    const fontWeight = isTitle ? 'bold' : (isSubtitle ? 'semibold' : 'medium');
    context.font = `${fontWeight} ${fontSize}px 'Poppins', 'Segoe UI', 'Arial', sans-serif`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    // Handle multi-line text with improved spacing and formatting
    const lines = text.split('\n');
    const lineHeight = fontSize * 1.3;
    
    // Determine text color with better contrast
    context.fillStyle = new THREE.Color(color).getStyle();
    
    // Add text with enhanced shadow and outline for better readability
    if (lines.length > 1) {
        lines.forEach((line, index) => {
            const yPos = (canvas.height / 2) - ((lines.length - 1) * lineHeight / 2) + (index * lineHeight);
            
            // Add multi-layered text outline for better definition
            // Outer shadow
            context.strokeStyle = 'rgba(0, 0, 0, 0.9)';
            context.lineWidth = 8;
            context.strokeText(line, canvas.width / 2, yPos);
            
            // Inner shadow for better definition
            context.strokeStyle = 'rgba(30, 30, 30, 0.8)';
            context.lineWidth = 4;
            context.strokeText(line, canvas.width / 2, yPos);
            
            // Actual text
            context.fillText(line, canvas.width / 2, yPos);
        });
    } else {
        // Same multi-layered approach for single line text
        // Outer shadow
        context.strokeStyle = 'rgba(0, 0, 0, 0.9)';
        context.lineWidth = 8;
        context.strokeText(text, canvas.width / 2, canvas.height / 2);
        
        // Inner shadow
        context.strokeStyle = 'rgba(30, 30, 30, 0.8)';
        context.lineWidth = 4;
        context.strokeText(text, canvas.width / 2, canvas.height / 2);
        
        // Actual text
        context.fillText(text, canvas.width / 2, canvas.height / 2);
    }
    
    // Create texture from canvas with enhanced filtering
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = 16; // Improve text quality at angles
    
    // Create sprite material with optimized settings
    const material = new THREE.SpriteMaterial({ 
        map: texture,
        transparent: true,
        depthTest: false, // Ensures text is always visible
        depthWrite: false,
        alphaTest: 0.1 // Improves transparency rendering
    });
    
    // Calculate aspect ratio for better scaling
    const aspectRatio = canvas.width / canvas.height;
    
    // Create sprite with improved scaling based on content type
    const sprite = new THREE.Sprite(material);
    sprite.position.set(x, y, z);
    
    // Adjust scaling based on text type and content length
    const widthScale = size * (isTitle ? 15 : 13) * (text.length > 25 ? 1.2 : 1);
    const heightScale = size * (isTitle ? 4 : 3.5) * (lines.length > 1 ? lines.length * 0.8 : 1);
    
    sprite.scale.set(widthScale, heightScale, 1);
    
    // Add to scene and store reference with metadata
    sprite.userData = { textType: isTitle ? 'title' : (isSubtitle ? 'subtitle' : 'detail') };
    scene.add(sprite);
    labels.push(sprite);
    
    return sprite;
}

// Helper function to add arrows
function addArrow(y, direction, color) {
    const arrowGeometry = new THREE.ConeGeometry(0.2, 0.4, 32);
    const arrowMaterial = new THREE.MeshPhongMaterial({ color: color });
    const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
    
    // Position and rotate based on direction
    arrow.position.set(0, y, 0);
    arrow.rotation.z = direction === 1 ? Math.PI : 0;
    
    pyramid.add(arrow);
    return arrow;
}

// Helper function to add lines
function addLine(x1, y1, z1, x2, y2, z2, color, opacity = 0.6) {
    const points = [];
    points.push(new THREE.Vector3(x1, y1, z1));
    points.push(new THREE.Vector3(x2, y2, z2));
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ 
        color: color, 
        transparent: true,
        opacity: opacity
    });
    const line = new THREE.Line(geometry, material);
    
    pyramid.add(line);
    return line;
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth * 0.7 / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth * 0.7, window.innerHeight);
    labelRenderer.setSize(window.innerWidth * 0.7, window.innerHeight);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Update controls
    controls.update();
    
    // Slowly rotate the pyramid in pyramid view
    if (pyramid && !isTimelineView) {
        pyramid.rotation.y += 0.002;
    }
    
    // Render both WebGL and CSS2D renderers
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
    
    // Update label positions to face camera
    labels.forEach(label => {
        label.lookAt(camera.position);
    });
    
    // Render scene
    renderer.render(scene, camera);
}

// Add CSS2D label to an object
function addCSS2DLabel(object, title, description, labelClass, yOffset = 1) {
    // Create label container
    const labelContainer = document.createElement('div');
    labelContainer.className = `label-container ${labelClass}`;
    
    // Create title element
    const titleElement = document.createElement('div');
    titleElement.className = 'ai-type-label';
    titleElement.textContent = title;
    labelContainer.appendChild(titleElement);
    
    // Create description element
    const descElement = document.createElement('div');
    descElement.className = 'ai-description';
    descElement.textContent = description;
    labelContainer.appendChild(descElement);
    
    // Create CSS2D label
    const label = new THREE.CSS2DObject(labelContainer);
    
    // Position the label above the object
    const objectPosition = new THREE.Vector3();
    object.getWorldPosition(objectPosition);
    label.position.set(objectPosition.x, objectPosition.y + yOffset, objectPosition.z);
    
    // Add label to scene and store reference
    scene.add(label);
    css2dLabels.push(label);
    
    return label;
}

// Start the visualization
window.onload = function() {
    init();
    initPresentationControls();
};

// Initialize presentation controls
function initPresentationControls() {
    const prevButton = document.getElementById('prev-slide');
    const nextButton = document.getElementById('next-slide');
    const fullscreenButton = document.getElementById('fullscreen');
    const currentSlideIndicator = document.getElementById('current-slide');
    const totalSlidesIndicator = document.getElementById('total-slides');
    
    // Update indicators
    currentSlideIndicator.textContent = currentSlide;
    totalSlidesIndicator.textContent = totalSlides;
    
    // Previous slide button
    prevButton.addEventListener('click', () => {
        if (currentSlide > 1) {
            showSlide(currentSlide - 1);
        }
    });
    
    // Next slide button
    nextButton.addEventListener('click', () => {
        if (currentSlide < totalSlides) {
            showSlide(currentSlide + 1);
        }
    });
    
    // Fullscreen button
    fullscreenButton.addEventListener('click', toggleFullscreen);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            if (currentSlide > 1) {
                showSlide(currentSlide - 1);
            }
        } else if (e.key === 'ArrowRight') {
            if (currentSlide < totalSlides) {
                showSlide(currentSlide + 1);
            }
        } else if (e.key === 'f') {
            toggleFullscreen();
        }
    });
    
    // Initialize slide display
    showSlide(1);
}

// Show specific slide
function showSlide(slideNumber) {
    // Hide all slides
    const slides = document.querySelectorAll('.slide');
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Show the target slide
    const targetSlide = document.getElementById(`slide-${slideNumber}`);
    if (targetSlide) {
        targetSlide.classList.add('active');
        currentSlide = slideNumber;
        
        // Update current slide indicator
        document.getElementById('current-slide').textContent = currentSlide;
        
        // Special handling for slide 2 (3D pyramid visualization)
        if (slideNumber === 2 && scene) {
            // Make sure the 3D visualization is properly sized and rendered
            onWindowResize();
            animate();
        }
    }
}

// Toggle fullscreen mode
function toggleFullscreen() {
    const fullscreenButton = document.getElementById('fullscreen');
    
    if (!isFullscreen) {
        // Enter fullscreen
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) { // Firefox
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari, Opera
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
            document.documentElement.msRequestFullscreen();
        }
        
        fullscreenButton.innerHTML = '<i class="fas fa-compress"></i><span class="sr-only">Exit Fullscreen</span>';
        fullscreenButton.title = "Exit Fullscreen";
        isFullscreen = true;
    } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { // Firefox
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { // Chrome, Safari, Opera
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // IE/Edge
            document.msExitFullscreen();
        }
        
        fullscreenButton.innerHTML = '<i class="fas fa-expand"></i><span class="sr-only">Toggle Fullscreen</span>';
        fullscreenButton.title = "Toggle Fullscreen";
        isFullscreen = false;
    }
    
    // Ensure 3D visualization is properly sized after fullscreen toggle
    setTimeout(onWindowResize, 100);
}
