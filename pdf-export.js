// PDF Export functionality for AI Pyramid Visualization
// Requires jsPDF and html2canvas libraries

function captureSlideAsPDF() {
    // Create a new jsPDF instance
    const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
    });
    
    let currentSlide = 0;
    const totalSlides = document.querySelectorAll('.slide').length;
    
    // Function to capture a single slide
    function captureSlide() {
        // Get the current slide
        const slide = document.querySelectorAll('.slide')[currentSlide];
        
        // Make sure only current slide is visible
        document.querySelectorAll('.slide').forEach(s => s.style.display = 'none');
        slide.style.display = 'block';
        
        // Wait for rendering
        setTimeout(() => {
            // Use html2canvas to capture the slide
            html2canvas(slide, {
                scale: 2, // Higher scale for better quality
                logging: false,
                useCORS: true,
                allowTaint: true
            }).then(canvas => {
                // Calculate dimensions to fit the page
                const imgData = canvas.toDataURL('image/jpeg', 1.0);
                const imgWidth = 297; // A4 landscape width in mm
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                
                // Add image to PDF
                if (currentSlide > 0) {
                    pdf.addPage();
                }
                pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, 210); // 210 is A4 height in mm
                
                // Add slide number
                pdf.setFontSize(10);
                pdf.text(`${currentSlide + 1}/${totalSlides}`, 285, 205);
                
                // Move to next slide or save if done
                currentSlide++;
                if (currentSlide < totalSlides) {
                    captureSlide();
                } else {
                    // Reset slides to original state
                    document.querySelectorAll('.slide').forEach(s => s.style.display = '');
                    showCurrentSlide();
                    
                    // Save the PDF
                    pdf.save('AI-Pyramid-Visualization.pdf');
                    
                    // Show success message
                    const message = document.createElement('div');
                    message.style.position = 'fixed';
                    message.style.bottom = '20px';
                    message.style.right = '20px';
                    message.style.background = 'rgba(0, 128, 0, 0.8)';
                    message.style.color = 'white';
                    message.style.padding = '10px 20px';
                    message.style.borderRadius = '5px';
                    message.style.zIndex = '1000';
                    message.textContent = 'PDF successfully created!';
                    document.body.appendChild(message);
                    
                    setTimeout(() => {
                        message.remove();
                    }, 3000);
                }
            });
        }, 500);
    }
    
    // Start capture process
    captureSlide();
}

// Function to capture the 3D visualization from different angles
function capture3DVisualizationPDF() {
    // Get the renderer and scene from the global scope
    const renderer = window.renderer;
    const scene = window.scene;
    const camera = window.camera;
    
    if (!renderer || !scene || !camera) {
        alert('3D visualization not initialized. Please try again when the visualization is loaded.');
        return;
    }
    
    // Create a new jsPDF instance
    const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
    });
    
    // Array of camera positions to capture different angles
    const cameraPositions = [
        { x: 0, y: 0, z: 10 },  // Front view
        { x: 10, y: 0, z: 0 },  // Right view
        { x: -10, y: 0, z: 0 }, // Left view
        { x: 0, y: 5, z: 5 },   // Top-front view
        { x: 5, y: 5, z: 5 }    // Isometric view
    ];
    
    // Store original camera position to restore later
    const originalPosition = { 
        x: camera.position.x, 
        y: camera.position.y, 
        z: camera.position.z 
    };
    
    let currentCapture = 0;
    
    // Function to capture a single view
    function captureView() {
        // Position camera
        camera.position.set(
            cameraPositions[currentCapture].x,
            cameraPositions[currentCapture].y,
            cameraPositions[currentCapture].z
        );
        camera.lookAt(0, 0, 0);
        
        // Render the scene
        renderer.render(scene, camera);
        
        // Wait for rendering
        setTimeout(() => {
            // Capture canvas content
            const imgData = renderer.domElement.toDataURL('image/jpeg', 1.0);
            
            // Add to PDF
            if (currentCapture > 0) {
                pdf.addPage();
            }
            
            // Add image to PDF
            pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210); // A4 landscape size
            
            // Add caption
            let caption;
            switch(currentCapture) {
                case 0: caption = "Front View of AI Pyramid"; break;
                case 1: caption = "Right Side View of AI Pyramid"; break;
                case 2: caption = "Left Side View of AI Pyramid"; break;
                case 3: caption = "Top-Front View of AI Pyramid"; break;
                case 4: caption = "Isometric View of AI Pyramid"; break;
            }
            
            pdf.setFontSize(14);
            pdf.text(caption, 149, 200, { align: 'center' });
            pdf.setFontSize(10);
            pdf.text(`${currentCapture + 1}/${cameraPositions.length}`, 285, 205);
            
            // Move to next position or save if done
            currentCapture++;
            if (currentCapture < cameraPositions.length) {
                captureView();
            } else {
                // Restore original camera position
                camera.position.set(originalPosition.x, originalPosition.y, originalPosition.z);
                camera.lookAt(0, 0, 0);
                renderer.render(scene, camera);
                
                // Save the PDF
                pdf.save('AI-Pyramid-3D-Views.pdf');
                
                // Show success message
                const message = document.createElement('div');
                message.style.position = 'fixed';
                message.style.bottom = '20px';
                message.style.right = '20px';
                message.style.background = 'rgba(0, 128, 0, 0.8)';
                message.style.color = 'white';
                message.style.padding = '10px 20px';
                message.style.borderRadius = '5px';
                message.style.zIndex = '1000';
                message.textContent = 'PDF with 3D views successfully created!';
                document.body.appendChild(message);
                
                setTimeout(() => {
                    message.remove();
                }, 3000);
            }
        }, 500);
    }
    
    // Start capture process
    captureView();
}

// Function to create a comprehensive PDF with both slides and 3D views
function createComprehensivePDF() {
    // Create a new jsPDF instance
    const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
    });
    
    // Get all slides
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    
    // Get the renderer and scene from the global scope
    const renderer = window.renderer;
    const scene = window.scene;
    const camera = window.camera;
    
    if (!renderer || !scene || !camera) {
        alert('3D visualization not initialized. Please try again when the visualization is loaded.');
        return;
    }
    
    // Array of camera positions for the 3D visualization
    const cameraPositions = [
        { x: 0, y: 0, z: 10 },   // Front view
        { x: 10, y: 0, z: 0 },   // Right view
        { x: -10, y: 0, z: 0 },  // Left view
        { x: 0, y: 5, z: 5 },    // Top-front view
        { x: 5, y: 5, z: 5 }     // Isometric view
    ];
    
    // Store original camera position
    const originalPosition = { 
        x: camera.position.x, 
        y: camera.position.y, 
        z: camera.position.z 
    };
    
    let currentSlide = 0;
    let processing3D = false;
    let current3DView = 0;
    
    // Cover page
    pdf.setFontSize(30);
    pdf.text('AI Pyramid Visualization', 149, 80, { align: 'center' });
    pdf.setFontSize(16);
    pdf.text('A comprehensive exploration of AI evolution', 149, 100, { align: 'center' });
    pdf.text('From Narrow AI to Superintelligence', 149, 110, { align: 'center' });
    pdf.setFontSize(14);
    pdf.text('Generated on ' + new Date().toLocaleDateString(), 149, 130, { align: 'center' });
    pdf.text('AI Global Ventures, Inc.', 149, 140, { align: 'center' });
    
    // Function to capture slides
    function captureNextItem() {
        if (!processing3D && currentSlide < totalSlides) {
            // Capture slide
            const slide = slides[currentSlide];
            
            // Make only current slide visible
            document.querySelectorAll('.slide').forEach(s => s.style.display = 'none');
            slide.style.display = 'block';
            
            // Wait for rendering
            setTimeout(() => {
                html2canvas(slide, {
                    scale: 2,
                    logging: false,
                    useCORS: true,
                    allowTaint: true
                }).then(canvas => {
                    // Add page (except for first capture which follows cover page)
                    if (!(currentSlide === 0 && current3DView === 0)) {
                        pdf.addPage();
                    }
                    
                    // Add image to PDF
                    const imgData = canvas.toDataURL('image/jpeg', 1.0);
                    pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210);
                    
                    // Add slide number
                    pdf.setFontSize(10);
                    pdf.text(`Slide ${currentSlide + 1}/${totalSlides}`, 285, 205);
                    
                    // Move to next slide
                    currentSlide++;
                    captureNextItem();
                });
            }, 500);
        } else if (current3DView < cameraPositions.length) {
            // We're now processing 3D views
            processing3D = true;
            
            // Position camera
            camera.position.set(
                cameraPositions[current3DView].x,
                cameraPositions[current3DView].y,
                cameraPositions[current3DView].z
            );
            camera.lookAt(0, 0, 0);
            
            // Render the scene
            renderer.render(scene, camera);
            
            // Wait for rendering
            setTimeout(() => {
                // Add page
                pdf.addPage();
                
                // Capture canvas content
                const imgData = renderer.domElement.toDataURL('image/jpeg', 1.0);
                
                // Add to PDF
                pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210);
                
                // Add caption
                let caption;
                switch(current3DView) {
                    case 0: caption = "Front View of AI Pyramid"; break;
                    case 1: caption = "Right Side View of AI Pyramid"; break;
                    case 2: caption = "Left Side View of AI Pyramid"; break;
                    case 3: caption = "Top-Front View of AI Pyramid"; break;
                    case 4: caption = "Isometric View of AI Pyramid"; break;
                }
                
                pdf.setFontSize(14);
                pdf.text(caption, 149, 200, { align: 'center' });
                pdf.setFontSize(10);
                pdf.text(`3D View ${current3DView + 1}/${cameraPositions.length}`, 285, 205);
                
                // Move to next 3D view
                current3DView++;
                captureNextItem();
            }, 500);
        } else {
            // All captures done, restore original states
            
            // Reset slides visibility
            document.querySelectorAll('.slide').forEach(s => s.style.display = '');
            showCurrentSlide();
            
            // Restore camera position
            camera.position.set(originalPosition.x, originalPosition.y, originalPosition.z);
            camera.lookAt(0, 0, 0);
            renderer.render(scene, camera);
            
            // Add references page
            pdf.addPage();
            pdf.setFontSize(20);
            pdf.text('References & Resources', 149, 30, { align: 'center' });
            
            pdf.setFontSize(12);
            pdf.text('AI Pyramid Visualization Project', 20, 50);
            pdf.text('Live Demo: https://ososerious.github.io/ai-pyramid-visualization/', 30, 60);
            pdf.text('Source Code: https://github.com/OSOSerious/ai-pyramid-visualization', 30, 70);
            
            pdf.text('Technologies Used:', 20, 90);
            pdf.text('• Three.js - 3D visualization library', 30, 100);
            pdf.text('• HTML5/CSS3 - Frontend structure and styling', 30, 110);
            pdf.text('• JavaScript - Core functionality and interactivity', 30, 120);
            pdf.text('• GitHub Pages - Hosting platform', 30, 130);
            
            pdf.text('Created by AI Global Ventures, Inc.', 149, 180, { align: 'center' });
            pdf.text('© 2025 - All Rights Reserved', 149, 190, { align: 'center' });
            
            // Save the PDF
            pdf.save('AI-Pyramid-Complete-Presentation.pdf');
            
            // Show success message
            const message = document.createElement('div');
            message.style.position = 'fixed';
            message.style.bottom = '20px';
            message.style.right = '20px';
            message.style.background = 'rgba(0, 128, 0, 0.8)';
            message.style.color = 'white';
            message.style.padding = '10px 20px';
            message.style.borderRadius = '5px';
            message.style.zIndex = '1000';
            message.textContent = 'Comprehensive PDF successfully created!';
            document.body.appendChild(message);
            
            setTimeout(() => {
                message.remove();
            }, 3000);
        }
    }
    
    // Start the capture process
    captureNextItem();
}

// Add export buttons to the UI
function addPDFExportButtons() {
    const controlsContainer = document.querySelector('.controls') || document.body;
    
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'pdf-export-buttons';
    buttonContainer.style.position = 'fixed';
    buttonContainer.style.bottom = '20px';
    buttonContainer.style.right = '20px';
    buttonContainer.style.display = 'flex';
    buttonContainer.style.flexDirection = 'column';
    buttonContainer.style.gap = '10px';
    buttonContainer.style.zIndex = '1000';
    
    const slidesButton = document.createElement('button');
    slidesButton.textContent = 'Export Slides as PDF';
    slidesButton.addEventListener('click', captureSlideAsPDF);
    stylePDFButton(slidesButton);
    
    const views3DButton = document.createElement('button');
    views3DButton.textContent = 'Export 3D Views as PDF';
    views3DButton.addEventListener('click', capture3DVisualizationPDF);
    stylePDFButton(views3DButton);
    
    const comprehensiveButton = document.createElement('button');
    comprehensiveButton.textContent = 'Create Comprehensive PDF';
    comprehensiveButton.addEventListener('click', createComprehensivePDF);
    stylePDFButton(comprehensiveButton);
    
    buttonContainer.appendChild(slidesButton);
    buttonContainer.appendChild(views3DButton);
    buttonContainer.appendChild(comprehensiveButton);
    
    controlsContainer.appendChild(buttonContainer);
}

// Helper function to style PDF buttons
function stylePDFButton(button) {
    button.style.padding = '10px 15px';
    button.style.backgroundColor = '#4285f4';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.fontWeight = 'bold';
    button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
    
    button.addEventListener('mouseover', function() {
        this.style.backgroundColor = '#3367d6';
    });
    
    button.addEventListener('mouseout', function() {
        this.style.backgroundColor = '#4285f4';
    });
}

// Initialize the PDF export functionality once the page is loaded
window.addEventListener('load', function() {
    // Wait a bit to ensure Three.js and other components are fully loaded
    setTimeout(addPDFExportButtons, 2000);
});
