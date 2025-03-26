/**
 * General AI Icon
 * Brain merged with circuitry representing broad AI symbolism
 * Features teal/green color scheme to represent balance of tech and organic
 */

function createGeneralAIIcon(x = 0, y = 0, z = 0, scale = 1, color = 0x00a896) {
    const iconGroup = new THREE.Group();
    
    // Create brain hemisphere shapes
    const leftHemisphereGeometry = new THREE.SphereGeometry(0.4, 16, 16, 0, Math.PI);
    const rightHemisphereGeometry = new THREE.SphereGeometry(0.4, 16, 16, Math.PI, Math.PI);
    
    const brainMaterial = new THREE.MeshPhongMaterial({
        color: color,
        flatShading: false,
        shininess: 60
    });
    
    const leftHemisphere = new THREE.Mesh(leftHemisphereGeometry, brainMaterial);
    leftHemisphere.position.set(-0.05, 0, 0);
    
    const rightHemisphere = new THREE.Mesh(rightHemisphereGeometry, brainMaterial);
    rightHemisphere.position.set(0.05, 0, 0);
    
    // Add brain grooves (wrinkles)
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const grooveGeometry = new THREE.TorusGeometry(0.25, 0.02, 8, 12, Math.PI);
        const groove = new THREE.Mesh(grooveGeometry, brainMaterial);
        groove.position.y = Math.sin(angle) * 0.2;
        groove.rotation.x = Math.PI / 2;
        groove.rotation.y = angle;
        iconGroup.add(groove);
    }
    
    // Add neural network nodes (abstract interconnected dots)
    const nodeMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.9
    });
    
    // Create neural network nodes array
    const nodes = [];
    const nodeCount = 12;
    
    for (let i = 0; i < nodeCount; i++) {
        const nodeGeometry = new THREE.SphereGeometry(0.03, 8, 8);
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        
        // Position nodes in a somewhat random but balanced pattern around the brain
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const radius = 0.5;
        
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        
        node.position.set(x, y, z);
        nodes.push(node);
        iconGroup.add(node);
    }
    
    // Connect nodes with lines (neural connections)
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.6
    });
    
    // Create connections between nodes
    for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
            // Only connect some nodes (not all-to-all) to avoid visual clutter
            if (Math.random() > 0.8) {
                const points = [];
                points.push(nodes[i].position);
                points.push(nodes[j].position);
                
                const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(lineGeometry, lineMaterial);
                iconGroup.add(line);
            }
        }
    }
    
    // Create circuit board base
    const baseGeometry = new THREE.BoxGeometry(0.8, 0.1, 0.8);
    const baseMaterial = new THREE.MeshPhongMaterial({
        color: 0x2a4747,
        shininess: 30
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = -0.4;
    
    // Add circuit patterns to base
    const circuitMaterial = new THREE.LineBasicMaterial({
        color: 0x66fcf1,
        transparent: false,
        opacity: 1.0
    });
    
    // Create horizontal circuit lines
    for (let i = -3; i <= 3; i++) {
        const points = [];
        points.push(new THREE.Vector3(-0.4, -0.34, i * 0.1));
        points.push(new THREE.Vector3(0.4, -0.34, i * 0.1));
        
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(lineGeometry, circuitMaterial);
        iconGroup.add(line);
    }
    
    // Create vertical circuit lines
    for (let i = -3; i <= 3; i++) {
        const points = [];
        points.push(new THREE.Vector3(i * 0.1, -0.34, -0.4));
        points.push(new THREE.Vector3(i * 0.1, -0.34, 0.4));
        
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(lineGeometry, circuitMaterial);
        iconGroup.add(line);
    }
    
    // Add connection lines from circuit board to brain
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const topX = 0.3 * Math.cos(angle);
        const topZ = 0.3 * Math.sin(angle);
        
        const points = [];
        points.push(new THREE.Vector3(topX, -0.34, topZ));
        points.push(new THREE.Vector3(topX * 0.8, -0.2, topZ * 0.8));
        points.push(new THREE.Vector3(topX * 0.6, 0, topZ * 0.6));
        
        const connGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const connector = new THREE.Line(connGeometry, circuitMaterial);
        iconGroup.add(connector);
    }
    
    // Add main components to group
    iconGroup.add(leftHemisphere);
    iconGroup.add(rightHemisphere);
    iconGroup.add(base);
    
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
    
    // Add subtle animation properties
    iconGroup.userData = {
        pulseSpeed: 0.003,
        pulseMin: 0.9,
        pulseMax: 1.1,
        rotationSpeed: 0.002,
        originalY: y
    };
    
    // Position and scale
    iconGroup.position.set(x, y, z);
    iconGroup.scale.set(scale, scale, scale);
    
    return iconGroup;
}

// Animation function to be called in the main animation loop
function animateGeneralAIIcon(icon, timeElapsed) {
    if (!icon) return;
    
    // Slowly rotate the icon
    icon.rotation.y += icon.userData.rotationSpeed;
    
    // Pulse effect for neural network
    const pulseScale = icon.userData.pulseMin + 
        (Math.sin(timeElapsed * icon.userData.pulseSpeed) + 1) / 2 * 
        (icon.userData.pulseMax - icon.userData.pulseMin);
    
    // Apply pulse to the glow
    if (icon.children[icon.children.length - 1].type === "Mesh") {
        icon.children[icon.children.length - 1].scale.set(
            pulseScale, pulseScale, pulseScale
        );
    }
}
