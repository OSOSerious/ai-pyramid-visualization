/**
 * Artificial General Intelligence (AGI) Icon
 * Humanoid silhouette with a fractal/glowing brain representing human-like adaptability and learning
 * Features gold/orange color scheme to represent wisdom and human-like warmth
 */

function createAGIIcon(x = 0, y = 0, z = 0, scale = 1, color = 0xffa500) {
    const iconGroup = new THREE.Group();
    
    // Create humanoid silhouette
    // Create head
    const headGeometry = new THREE.SphereGeometry(0.25, 16, 16);
    const humanoidMaterial = new THREE.MeshPhongMaterial({
        color: 0x222222, // Dark silhouette
        flatShading: false,
        shininess: 30
    });
    const head = new THREE.Mesh(headGeometry, humanoidMaterial);
    head.position.y = 0.4;
    
    // Create body
    const bodyGeometry = new THREE.CylinderGeometry(0.15, 0.25, 0.5, 8);
    const body = new THREE.Mesh(bodyGeometry, humanoidMaterial);
    body.position.y = 0;
    
    // Create arms
    const armGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 8);
    
    const leftArm = new THREE.Mesh(armGeometry, humanoidMaterial);
    leftArm.position.set(-0.3, 0.1, 0);
    leftArm.rotation.z = Math.PI / 4;
    
    const rightArm = new THREE.Mesh(armGeometry, humanoidMaterial);
    rightArm.position.set(0.3, 0.1, 0);
    rightArm.rotation.z = -Math.PI / 4;
    
    // Create legs
    const legGeometry = new THREE.CylinderGeometry(0.07, 0.07, 0.5, 8);
    
    const leftLeg = new THREE.Mesh(legGeometry, humanoidMaterial);
    leftLeg.position.set(-0.15, -0.4, 0);
    
    const rightLeg = new THREE.Mesh(legGeometry, humanoidMaterial);
    rightLeg.position.set(0.15, -0.4, 0);
    
    // Create fractal brain (using icosahedron for complex structure)
    const brainGeometry = new THREE.IcosahedronGeometry(0.3, 2); // Higher detail for complexity
    const brainMaterial = new THREE.MeshPhongMaterial({
        color: color,
        transparent: true,
        opacity: 0.9,
        emissive: color,
        emissiveIntensity: 0.7,
        shininess: 100
    });
    const brain = new THREE.Mesh(brainGeometry, brainMaterial);
    brain.position.y = 0.4;
    brain.scale.set(0.7, 1, 0.7);
    
    // Create overlapping circles - mechanical and organic
    // Mechanical circle (gears)
    const gearRingGeometry = new THREE.RingGeometry(0.4, 0.5, 16);
    const gearRingMaterial = new THREE.MeshPhongMaterial({
        color: 0x996515, // Darker gold
        side: THREE.DoubleSide,
        shininess: 80
    });
    const gearRing = new THREE.Mesh(gearRingGeometry, gearRingMaterial);
    gearRing.position.set(-0.2, 0.7, 0.2);
    gearRing.rotation.x = Math.PI / 3;
    gearRing.rotation.y = Math.PI / 4;
    
    // Add gear teeth
    for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI * 2;
        const radius = 0.45;
        const toothGeometry = new THREE.BoxGeometry(0.06, 0.06, 0.05);
        const tooth = new THREE.Mesh(toothGeometry, gearRingMaterial);
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        tooth.position.set(-0.2 + x, 0.7 + y, 0.2);
        tooth.rotation.z = angle;
        tooth.rotation.x = Math.PI / 3;
        tooth.rotation.y = Math.PI / 4;
        iconGroup.add(tooth);
    }
    
    // Organic circle (neuron/leaf pattern)
    const organicRingGeometry = new THREE.RingGeometry(0.4, 0.5, 16);
    const organicRingMaterial = new THREE.MeshPhongMaterial({
        color: 0xffd700, // Brighter gold
        side: THREE.DoubleSide,
        shininess: 80
    });
    const organicRing = new THREE.Mesh(organicRingGeometry, organicRingMaterial);
    organicRing.position.set(0.2, 0.7, 0.2);
    organicRing.rotation.x = Math.PI / 3;
    organicRing.rotation.y = -Math.PI / 4;
    
    // Add organic patterns (stylized neurons)
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 0.45;
        
        // Create organic branch points
        const points = [];
        points.push(new THREE.Vector3(0, 0, 0));
        points.push(new THREE.Vector3(0.1, 0.05, 0));
        points.push(new THREE.Vector3(0.2, 0, 0));
        
        const branchGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const branch = new THREE.Line(branchGeometry, organicRingMaterial);
        
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        branch.position.set(0.2 + x, 0.7 + y, 0.2);
        branch.rotation.z = angle;
        branch.rotation.x = Math.PI / 3;
        branch.rotation.y = -Math.PI / 4;
        iconGroup.add(branch);
    }
    
    // Create neural network connections inside brain
    const neuralMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.7
    });
    
    // Create neural connection points
    const neuronCount = 10;
    const neurons = [];
    
    for (let i = 0; i < neuronCount; i++) {
        const neuronGeometry = new THREE.SphereGeometry(0.02, 8, 8);
        const neuronMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.9
        });
        const neuron = new THREE.Mesh(neuronGeometry, neuronMaterial);
        
        // Position neurons within the brain volume
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const radius = 0.2 * Math.random();
        
        const nx = radius * Math.sin(phi) * Math.cos(theta);
        const ny = radius * Math.sin(phi) * Math.sin(theta) + 0.4; // Center around head position
        const nz = radius * Math.cos(phi);
        
        neuron.position.set(nx, ny, nz);
        neurons.push(neuron);
        iconGroup.add(neuron);
    }
    
    // Connect neurons
    for (let i = 0; i < neuronCount; i++) {
        for (let j = i + 1; j < neuronCount; j++) {
            // Create more connections for AGI compared to General AI
            if (Math.random() > 0.6) {
                const points = [];
                points.push(neurons[i].position);
                points.push(neurons[j].position);
                
                const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(lineGeometry, neuralMaterial);
                iconGroup.add(line);
            }
        }
    }
    
    // Create glowing effect for the brain
    const glowGeometry = new THREE.SphereGeometry(0.32, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.3,
        side: THREE.BackSide
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.y = 0.4;
    
    // Add knowledge absorption visual (book transforming to chip)
    // Book side
    const bookGeometry = new THREE.BoxGeometry(0.2, 0.05, 0.3);
    const bookMaterial = new THREE.MeshPhongMaterial({
        color: 0xb87333, // Bronze/book-like
        shininess: 50
    });
    const book = new THREE.Mesh(bookGeometry, bookMaterial);
    book.position.set(-0.25, -0.15, 0.3);
    book.rotation.y = Math.PI / 6;
    
    // Chip side
    const chipGeometry = new THREE.BoxGeometry(0.2, 0.02, 0.3);
    const chipMaterial = new THREE.MeshPhongMaterial({
        color: 0x32CD32, // Green PCB-like
        shininess: 90
    });
    const chip = new THREE.Mesh(chipGeometry, chipMaterial);
    chip.position.set(0.25, -0.15, 0.3);
    chip.rotation.y = -Math.PI / 6;
    
    // Transition particles between book and chip
    const particleMaterial = new THREE.PointsMaterial({
        color: 0xffd700,
        size: 0.02,
        transparent: true,
        opacity: 0.8
    });
    
    const particleCount = 20;
    const particlePositions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        // Position particles in a transformation flow between book and chip
        const progress = i / particleCount;
        particlePositions[i3] = -0.25 + progress * 0.5; // X: move from book to chip
        particlePositions[i3+1] = -0.15 + Math.sin(progress * Math.PI) * 0.1; // Y: arc upward and back down
        particlePositions[i3+2] = 0.3;
    }
    
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    
    // Add all components to group
    iconGroup.add(head);
    iconGroup.add(body);
    iconGroup.add(leftArm);
    iconGroup.add(rightArm);
    iconGroup.add(leftLeg);
    iconGroup.add(rightLeg);
    iconGroup.add(brain);
    iconGroup.add(glow);
    iconGroup.add(gearRing);
    iconGroup.add(organicRing);
    iconGroup.add(book);
    iconGroup.add(chip);
    iconGroup.add(particles);
    
    // Add subtle animation properties
    iconGroup.userData = {
        brainPulseSpeed: 0.004,
        brainPulseMin: 0.9,
        brainPulseMax: 1.1,
        rotationSpeed: 0.001,
        particleFlowSpeed: 0.02,
        originalY: y
    };
    
    // Position and scale
    iconGroup.position.set(x, y, z);
    iconGroup.scale.set(scale, scale, scale);
    
    return iconGroup;
}

// Animation function to be called in the main animation loop
function animateAGIIcon(icon, timeElapsed) {
    if (!icon) return;
    
    // Slow rotation for the entire icon
    icon.rotation.y += icon.userData.rotationSpeed;
    
    // Pulsating brain effect
    const brainPulseScale = icon.userData.brainPulseMin + 
        (Math.sin(timeElapsed * icon.userData.brainPulseSpeed) + 1) / 2 * 
        (icon.userData.brainPulseMax - icon.userData.brainPulseMin);
    
    // Find the brain and glow components
    if (icon.children.length > 7) {
        // Brain is the 7th child in our structure
        const brain = icon.children[6];
        const glow = icon.children[7];
        
        if (brain && glow) {
            brain.scale.set(
                0.7 * brainPulseScale, 
                1 * brainPulseScale, 
                0.7 * brainPulseScale
            );
            glow.scale.set(
                brainPulseScale, 
                brainPulseScale, 
                brainPulseScale
            );
        }
    }
    
    // Animate the knowledge transfer particles
    if (icon.children.length > 12) {
        const particles = icon.children[12];
        if (particles && particles.type === "Points") {
            const positions = particles.geometry.attributes.position.array;
            const particleCount = positions.length / 3;
            
            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                
                // Update particle positions to create flowing effect
                positions[i3+1] = -0.15 + Math.sin((i / particleCount) * Math.PI + 
                                 timeElapsed * icon.userData.particleFlowSpeed) * 0.1;
            }
            
            particles.geometry.attributes.position.needsUpdate = true;
        }
    }
}
