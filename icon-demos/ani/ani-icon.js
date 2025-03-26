/**
 * Artificial Narrow Intelligence (ANI) Icon
 * A single gear with a magnifying glass representing task-specific, focused AI
 * Features blues/greys color scheme to represent technical, focused nature
 */

function createANIIcon(x = 0, y = 0, z = 0, scale = 1, color = 0x4b9cd3) {
    const iconGroup = new THREE.Group();
    
    // Create gear (main component)
    const gearGeometry = new THREE.CircleGeometry(0.5, 12);
    const gearMaterial = new THREE.MeshPhongMaterial({ 
        color: color,
        flatShading: true,
        shininess: 50
    });
    const gear = new THREE.Mesh(gearGeometry, gearMaterial);
    
    // Add teeth to the gear (more teeth for more precise/detailed look)
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const toothGeometry = new THREE.BoxGeometry(0.15, 0.15, 0.05);
        const tooth = new THREE.Mesh(toothGeometry, gearMaterial);
        tooth.position.set(Math.cos(angle) * 0.5, Math.sin(angle) * 0.5, 0);
        tooth.rotation.z = angle;
        gear.add(tooth);
    }
    
    // Add center hole to gear
    const centerHoleGeometry = new THREE.CircleGeometry(0.1, 12);
    const centerHoleMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x222222,
        side: THREE.DoubleSide 
    });
    const centerHole = new THREE.Mesh(centerHoleGeometry, centerHoleMaterial);
    centerHole.position.z = 0.01;
    gear.add(centerHole);
    
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
    
    // Create simple circuit pattern inside gear representing focused capabilities
    const circuitMaterial = new THREE.LineBasicMaterial({ 
        color: 0xaaaaaa,
        transparent: true,
        opacity: 0.8
    });
    
    // Add a few straight circuit lines to represent narrow pathways
    for (let i = 0; i < 3; i++) {
        const points = [];
        points.push(new THREE.Vector3(-0.3, -0.1 * i, 0.01));
        points.push(new THREE.Vector3(0.3, -0.1 * i, 0.01));
        
        const circuitGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const circuit = new THREE.Line(circuitGeometry, circuitMaterial);
        gear.add(circuit);
    }
    
    // Add all components to group
    iconGroup.add(gear);
    iconGroup.add(handle);
    iconGroup.add(frame);
    iconGroup.add(lens);
    
    // Add subtle animation properties
    iconGroup.userData = {
        rotationSpeed: 0.005,
        hoverDistance: 0.05,
        originalY: y
    };
    
    // Position and scale the icon
    iconGroup.position.set(x, y, z);
    iconGroup.scale.set(scale, scale, scale);
    
    return iconGroup;
}

// Animation function to be called in the main animation loop
function animateANIIcon(icon, timeElapsed) {
    if (!icon) return;
    
    // Rotate the gear slightly
    icon.children[0].rotation.z += icon.userData.rotationSpeed;
    
    // Add subtle floating motion
    icon.position.y = icon.userData.originalY + 
        Math.sin(timeElapsed * 2) * icon.userData.hoverDistance;
}

// Scene setup and animation
let scene, camera, renderer, controls;
let icon;
let clock = new THREE.Clock();

function init() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x121212);

    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 3);

    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    // Add controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Create icon
    icon = createANIIcon(0, 0, 0, 2, 0x4b9cd3);
    scene.add(icon);

    // Handle window resize
    window.addEventListener('resize', onWindowResize);

    // Start animation
    animate();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    
    const elapsedTime = clock.getElapsedTime();
    
    // Animate the icon
    animateANIIcon(icon, elapsedTime);
    
    // Update controls
    controls.update();
    
    // Render
    renderer.render(scene, camera);
}

// Start everything
window.onload = init;
