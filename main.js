/*
 * -----------------------------------------------------------------------------
 * ML MAVERICKS - MAIN.JS (v2.0 - Multi-Page)
 * -----------------------------------------------------------------------------
 * This file contains all JavaScript for the website:
 * 1. Component Loader (Navbar/Footer)
 * 2. Active Nav Link Highlighter
 * 3. 3D Neural Network (Homepage Hero)
 * 4. 3D Tilt Effect (Homepage & Showcase Cards)
 * 5. Payment Modal & Form Submission (Events Page)
 * -----------------------------------------------------------------------------
 */

// ---
// 1. COMPONENT LOADER
// ---
// This function fetches and injects reusable HTML (navbar.html, footer.html)
async function loadComponents() {
    const elements = document.querySelectorAll('[data-include]');
    for (const el of elements) {
        const file = el.getAttribute('data-include');
        try {
            const response = await fetch(file);
            if (!response.ok) throw new Error(`File not found: ${file}`);
            const html = await response.text();
            el.innerHTML = html;
        } catch (err) {
            console.error(err);
            el.innerHTML = `<p class="text-red-500 text-center">Error loading ${file}</p>`;
        }
    }
}

// ---
// 2. ACTIVE NAV LINK HIGHLIGHTER
// ---
// This highlights the nav link for the current page
function highlightActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll(`[data-nav-id]`);
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('data-nav-id');
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
}

// ---
// 3. 3D NEURAL NETWORK (Homepage Hero)
// ---
// We only run this if we're on the homepage (index.html)
function initNeuralNetwork() {
    const container = document.getElementById('neural-canvas-container');
    if (!container || typeof THREE === 'undefined') return; // Exit if not homepage or three.js not loaded

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const numPoints = 150;
    const points = new Float32Array(numPoints * 3);
    const particlesData = [];
    
    for (let i = 0; i < numPoints; i++) {
        const x = (Math.random() - 0.5) * 15;
        const y = (Math.random() - 0.5) * 15;
        const z = (Math.random() - 0.5) * 15;
        points[i * 3] = x;
        points[i * 3 + 1] = y;
        points[i * 3 + 2] = z;
        particlesData.push({
            velocity: new THREE.Vector3((Math.random() - 0.5) * 0.01, (Math.random() - 0.5) * 0.01, (Math.random() - 0.5) * 0.01)
        });
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(points, 3));
    const material = new THREE.PointsMaterial({ color: 0x00FFFF, size: 0.05, transparent: true, opacity: 0.7 });
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xFF0055, transparent: true, opacity: 0.05 });
    const linesGeometry = new THREE.BufferGeometry();
    const linesMesh = new THREE.LineSegments(linesGeometry, lineMaterial);
    scene.add(linesMesh);

    camera.position.z = 5;

    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - window.innerWidth / 2) * 0.001;
        mouseY = (event.clientY - window.innerHeight / 2) * 0.001;
    });

    function animate() {
        requestAnimationFrame(animate);
        const positions = particles.geometry.attributes.position.array;
        const linePositions = [];
        
        for (let i = 0; i < numPoints; i++) {
            const i3 = i * 3;
            positions[i3] += particlesData[i].velocity.x;
            positions[i3 + 1] += particlesData[i].velocity.y;
            positions[i3 + 2] += particlesData[i].velocity.z;

            if (positions[i3] > 7.5 || positions[i3] < -7.5) particlesData[i].velocity.x *= -1;
            if (positions[i3 + 1] > 7.5 || positions[i3 + 1] < -7.5) particlesData[i].velocity.y *= -1;
            if (positions[i3 + 2] > 7.5 || positions[i3 + 2] < -7.5) particlesData[i].velocity.z *= -1;

            for (let j = i + 1; j < numPoints; j++) {
                const j3 = j * 3;
                const dx = positions[i3] - positions[j3];
                const dy = positions[i3 + 1] - positions[j3 + 1];
                const dz = positions[i3 + 2] - positions[j3 + 2];
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                if (dist < 1.2) {
                    linePositions.push(positions[i3], positions[i3 + 1], positions[i3 + 2]);
                    linePositions.push(positions[j3], positions[j3 + 1], positions[j3 + 2]);
                }
            }
        }
        
        linesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        particles.geometry.attributes.position.needsUpdate = true;

        camera.position.x += (mouseX - camera.position.x) * 0.03;
        camera.position.y += (-mouseY - camera.position.y) * 0.03;
        camera.lookAt(scene.position);
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

// ---
// 4. 3D TILT EFFECT (Homepage & Showcase Cards)
// ---
function initTiltEffect() {
    if (typeof VanillaTilt === 'undefined') return;

    const tiltElements = document.querySelectorAll('.tilt-card, .tilt-card-project');
    if (tiltElements.length > 0) {
        VanillaTilt.init(tiltElements, {
            max: 15,
            speed: 400,
            glare: true,
            "max-glare": 0.25
        });
    }
}

// ---
// 5. NAVBAR MOBILE MENU LOGIC
// ---
function attachNavbarLogic() {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    if (btn && menu) {
        btn.addEventListener('click', () => {
            menu.classList.toggle('hidden');
            const icon = btn.querySelector('i');
            if (menu.classList.contains('hidden')) {
                icon.setAttribute('data-lucide', 'menu');
            } else {
                icon.setAttribute('data-lucide', 'x');
            }
            lucide.createIcons();
        });
    }
    // Also highlight the active nav link
    highlightActiveNav();
}

// ---
// 6. PAYMENT MODAL & FORM SUBMISSION (Events Page)
// ---
// 

// ==========================================
// NEW EVENT FORM LOGIC (WITH LIMIT CHECK)
// ==========================================
function initEventForm() {
    const registrationForm = document.getElementById('registration-form');
    if (!registrationForm) return; 

    // ------------------------------------------------------
    // PASTE YOUR NEW GOOGLE SCRIPT URL HERE:
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzdeJORA7i2S1ss2GdsDYiU88YyyTBLQfz7jOiTGVXKrb44nhUgQ7VAsD3YfVwpOhY/exec"; 
    // ------------------------------------------------------
    const MAX_PARTICIPANTS = 5;

    // DOM Elements
    const loadingState = document.getElementById('loading-state');
    const formContainer = document.getElementById('form-container');
    const closedMessage = document.getElementById('closed-message');
    const spotCountSpan = document.getElementById('spot-count');
    
    // Modal Elements
    const modal = document.getElementById('payment-modal');
    const modalOverlay = document.querySelector('.modal-overlay');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalFormMessage = document.getElementById('modal-form-message');
    const transactionForm = document.getElementById('transaction-form');
    const screenshotInput = document.getElementById('paymentScreenshot');
    const submitBtn = document.getElementById('submit-registration-btn');
    const copyUpiBtn = document.getElementById('copy-upi-btn');
    
    let registrationData = {};

    // --- 1. CHECK COUNT ON LOAD ---
    fetch(SCRIPT_URL + "?action=getCount")
        .then(response => response.json())
        .then(data => {
            const count = data.count;
            // Update UI
            if(loadingState) loadingState.classList.add('hidden');

            if (count >= MAX_PARTICIPANTS) {
                // LIMIT REACHED
                if(closedMessage) closedMessage.classList.remove('hidden');
                if(typeof lucide !== 'undefined') lucide.createIcons();
            } else {
                // SPOTS AVAILABLE
                if(formContainer) formContainer.classList.remove('hidden');
                if(spotCountSpan) spotCountSpan.innerText = count;
            }
        })
        .catch(error => {
            console.error('Error fetching count:', error);
            // Fallback: show form if error occurs
            if(loadingState) loadingState.classList.add('hidden');
            if(formContainer) formContainer.classList.remove('hidden');
        });


    // --- 2. FORM HANDLERS (Same as before) ---
    registrationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(registrationForm);
        registrationData = Object.fromEntries(formData.entries());
        openModal();
    });

    transactionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const file = screenshotInput.files[0];

        if (!file) {
            showModalMessage('Please upload a screenshot.', 'error');
            return;
        }
        if (file.size > 5 * 1024 * 1024) { 
            showModalMessage('File too large (Max 5MB).', 'error');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loader"></span> Submitting...';
        modalFormMessage.classList.add('hidden');

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            registrationData.fileData = reader.result;
            registrationData.fileName = file.name;
            registrationData.fileType = file.type;
            sendDataToGoogleScript(registrationData);
        };
    });
    
    function sendDataToGoogleScript(data) {
        fetch(SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        .then(response => {
          showModalMessage('Registration Successful! Refreshing...', 'success');
          registrationForm.reset();
          transactionForm.reset();
          setTimeout(() => {
              closeModal();
              location.reload(); // Reload to update the count
          }, 2000);
        })
        .catch(error => {
          showModalMessage('Error occurred. Please try again.', 'error');
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Submit Registration';
        });
    }

    function openModal() { if (modal) modal.classList.remove('hidden'); }
    function closeModal() { 
        if (modal) {
            modal.classList.add('hidden');
            transactionForm.reset();
            modalFormMessage.classList.add('hidden');
        }
    }
    
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

    // Copy UPI Logic
    if (copyUpiBtn) {
        copyUpiBtn.addEventListener('click', () => {
            const upiId = document.getElementById('upi-id').innerText;
            navigator.clipboard.writeText(upiId);
            copyUpiBtn.innerHTML = '<i data-lucide="check" class="w-4 h-4 text-green-500"></i>';
            setTimeout(() => {
                copyUpiBtn.innerHTML = '<i data-lucide="copy" class="w-4 h-4"></i>';
                if(typeof lucide !== 'undefined') lucide.createIcons();
            }, 2000);
            if(typeof lucide !== 'undefined') lucide.createIcons();
        });
    }

    function showModalMessage(message, type = 'success') {
        const messageEl = modalFormMessage;
        messageEl.innerText = message;
        messageEl.className = 'p-3 rounded-lg text-sm mt-4 text-center ' + 
            (type === 'success' ? 'bg-green-800 text-green-200' : 'bg-red-800 text-red-200');
        messageEl.classList.remove('hidden');
    }
}


/*
 * -----------------------------------------------------------------------------
 * INITIALIZATION
 * -----------------------------------------------------------------------------
 * Run all our functions when the page loads.
 */
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Load Navbar/Footer first
    await loadComponents();
    
    // 2. Attach logic to the newly loaded Navbar
    attachNavbarLogic(); 
    
    // 3. Render all icons
    lucide.createIcons();
    
    // 4. Initialize page-specific scripts
    initNeuralNetwork();   // Will only run on index.html
    initTiltEffect();      // Will run on index.html and showcase.html
    initEventForm();       // Will only run on events.html
});