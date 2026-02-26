/*
 * -----------------------------------------------------------------------------
 * ML MAVERICKS - MAIN.JS (v2.0 - Multi-Page)
 * -----------------------------------------------------------------------------
 */

// --- 1. COMPONENT LOADER ---
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

// --- 2. ACTIVE NAV LINK HIGHLIGHTER ---
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

// --- 3. 3D NEURAL NETWORK ---
function initNeuralNetwork() {
    const container = document.getElementById('neural-canvas-container');
    if (!container || typeof THREE === 'undefined') return; 

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

// --- 4. 3D TILT EFFECT ---
function initTiltEffect() {
    if (typeof VanillaTilt === 'undefined') return;
    const tiltElements = document.querySelectorAll('.tilt-card, .tilt-card-project');
    if (tiltElements.length > 0) {
        VanillaTilt.init(tiltElements, { max: 15, speed: 400, glare: true, "max-glare": 0.25 });
    }
}

// --- 5. NAVBAR MOBILE MENU LOGIC ---
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
    highlightActiveNav();
}

// --- 6. MULTI-EVENT REGISTRATION LOGIC ---
function initEventsPage() {
    const eventBtns = document.querySelectorAll('.event-btn');
    if(eventBtns.length === 0) return; 

    // Containers
    const eventListContainer = document.getElementById('event-list-container');
    const eventPosterContainer = document.getElementById('event-poster-container');
    const mainPosterContainer = document.getElementById('main-poster-container');
    const formContainer = document.getElementById('form-container');
    const regClosedContainer = document.getElementById('registration-closed-container');
    const statusTitle = document.getElementById('status-title');
    const statusMessage = document.getElementById('status-message');
    const statusIcon = document.getElementById('status-icon');
    
    // UI Elements
    const backBtn = document.getElementById('back-btn');
    const dynamicPoster = document.getElementById('dynamic-event-poster');
    const eventTitle = document.getElementById('form-event-title');
    const eventDate = document.getElementById('form-event-date');
    const eventType = document.getElementById('form-event-type');
    const selectedEventId = document.getElementById('selected-event-id');
    
    // Dynamic Form Sections
    const studentFields = document.getElementById('student-fields');
    const facultyFields = document.getElementById('faculty-fields');
    const proceedBtnText = document.getElementById('proceed-btn-text');
    const proceedBtnIcon = document.getElementById('proceed-btn-icon');
    
    const posterImages = {
        'smash-karts': './images/smash-karts-poster.png',
        'dart-game': './images/DART-GAME.png',
        'act-draw-decode': './images/act-draw-decode.png',
        'neuro-debugs': './images/neuro_debugs_poster.png'
    };

    const eventPaymentDetails = {
        'smash-karts': { price: '₹79', qr: './images/sreeja-pay.jpg' }, 
        'act-draw-decode': { price: '₹49', qr: './images/sreeja-pay.jpg' }
    };

    // 1. Handle Selection & Swap Layout
    eventBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const eventId = btn.getAttribute('data-event');

            eventTitle.innerText = btn.getAttribute('data-title');
            eventDate.innerText = btn.getAttribute('data-date');
            eventType.innerText = btn.getAttribute('data-type');
            selectedEventId.value = eventId;
            dynamicPoster.src = posterImages[eventId] || '';
            // Update the Modal QR Code and Price dynamically
            if (eventPaymentDetails[eventId]) {
                document.getElementById('dynamic-price').innerText = eventPaymentDetails[eventId].price;
                document.getElementById('dynamic-qr-img').src = eventPaymentDetails[eventId].qr;
            }

            eventListContainer.classList.add('hidden');
            eventListContainer.classList.remove('block');
            mainPosterContainer.classList.add('hidden');
            mainPosterContainer.classList.remove('flex');
            
            eventPosterContainer.classList.remove('hidden');
            eventPosterContainer.classList.add('flex');

            // --- NEURO DEBUGS: Coming Soon ---
            if (eventId === 'neuro-debugs') {
                formContainer.classList.add('hidden');
                regClosedContainer.classList.remove('hidden');
                regClosedContainer.classList.add('flex');
                
                statusTitle.innerText = "Coming Soon";
                statusMessage.innerText = "Registrations for this event have not started yet. Please stay tuned for further updates.";
                statusIcon.setAttribute('data-lucide', 'calendar-clock');
                statusIcon.className = "w-20 h-20 text-brand-cyan mb-6 animate-pulse";
                lucide.createIcons();

            // --- SMASH KARTS: Registrations Closed ---
            } else if (eventId === 'smash-karts') {
                formContainer.classList.add('hidden');
                regClosedContainer.classList.remove('hidden');
                regClosedContainer.classList.add('flex');
                
                statusTitle.innerText = "Registrations Full";
                statusMessage.innerText = "Thank you for the overwhelming response! All available slots for the Smash Karts game are now booked.";
                statusIcon.setAttribute('data-lucide', 'lock'); 
                statusIcon.className = "w-20 h-20 text-brand-pink mb-6";
                lucide.createIcons();

            // --- OTHER EVENTS: Show Form ---
            } else {
                regClosedContainer.classList.add('hidden');
                regClosedContainer.classList.remove('flex');
                formContainer.classList.remove('hidden');

                // DART GAME: Faculty Only
                if (eventId === 'dart-game') {
                    studentFields.classList.add('hidden');
                    document.getElementById('rollNumber').removeAttribute('required');
                    document.getElementById('collegeName').removeAttribute('required');
                    document.getElementById('year').removeAttribute('required');
                    document.getElementById('branch').removeAttribute('required');
                    
                    facultyFields.classList.remove('hidden');
                    document.getElementById('departmentName').setAttribute('required', 'true');
                    
                    proceedBtnText.innerText = "Submit Registration";
                    proceedBtnIcon.setAttribute('data-lucide', 'check-circle');
                    lucide.createIcons();

                // TECH TAMBOLA: Students + Faculty (Requires Payment)
                } else {
                    studentFields.classList.remove('hidden');
                    document.getElementById('rollNumber').setAttribute('required', 'true');
                    document.getElementById('collegeName').setAttribute('required', 'true');
                    document.getElementById('year').setAttribute('required', 'true');
                    document.getElementById('branch').setAttribute('required', 'true');
                    
                    facultyFields.classList.add('hidden');
                    document.getElementById('departmentName').removeAttribute('required');

                    proceedBtnText.innerText = "Proceed to Payment";
                    proceedBtnIcon.setAttribute('data-lucide', 'arrow-right');
                    lucide.createIcons();
                }
            }
        });
    });

    // 2. Handle Back Button Click
    backBtn.addEventListener('click', () => {
        eventPosterContainer.classList.add('hidden');
        eventPosterContainer.classList.remove('flex');
        
        formContainer.classList.add('hidden');
        regClosedContainer.classList.add('hidden');
        regClosedContainer.classList.remove('flex');

        eventListContainer.classList.remove('hidden');
        eventListContainer.classList.add('block');
        
        mainPosterContainer.classList.remove('hidden');
        mainPosterContainer.classList.add('flex');
    });

    // ==========================================
    // SCRIPT URLS
    // ==========================================
    const eventScriptURLs = {
        'smash-karts': 'https://script.google.com/macros/s/AKfycbykH8h4VahOeqT3S-Jx3r095g9lFz8gyUvt42hy0RqiLes7k3y1r6V_SHAZHrveEDG_rA/exec',
        'dart-game': 'https://script.google.com/macros/s/AKfycbxxkn_Sg6HEnhji0xNT5H4hJr40NX6YePoI2vii7IxfJoyaP0Tmbua4B_UpvmLTDkwk/exec',
        'act-draw-decode': 'https://script.google.com/macros/s/AKfycbzFrJDYrd1pBrLW2xSsl06CVNms2-V_PNDHcJUrclKMsUe1S0jVctnZq86TSx9LKJ3J/exec'
    };

    // 3. Main Form Proceed Button
    const proceedBtn = document.getElementById('proceed-btn');
    const regForm = document.getElementById('registration-form');
    const paymentModal = document.getElementById('payment-modal');
    const directSubmitMsg = document.getElementById('direct-submit-msg');
    
    if(proceedBtn) {
        proceedBtn.addEventListener('click', async () => {
            if (!regForm.checkValidity()) {
                regForm.reportValidity();
                return;
            }

            const eventId = selectedEventId.value;

            // FACULTY DIRECT SUBMIT (NO PAYMENT)
            if (eventId === 'dart-game') {
                const scriptURL = eventScriptURLs[eventId];
                if (!scriptURL || scriptURL.includes('YOUR_GOOGLE_SCRIPT_URL')) {
                    alert('Configuration Error: Google Script URL is missing.');
                    return;
                }

                proceedBtn.disabled = true;
                proceedBtnText.innerText = "Submitting...";
                proceedBtnIcon.classList.add('hidden');
                directSubmitMsg.classList.add('hidden');

                const payload = {
                    event: eventId,
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    
                    // Specific to Dart Game
                    department: document.getElementById('departmentName').value,
                    
                    // Fill required backend fields with empty/NA data so script doesn't crash
                    rollNumber: "Faculty",
                    college: "JBIET",
                    year: "Faculty",
                    branch: "Faculty",
                    transactionId: "N/A",
                    fileName: "",
                    mimeType: "",
                    fileBase64: ""
                };

                try {
                    await fetch(scriptURL, {
                        method: 'POST',
                        mode: 'no-cors',
                        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                        body: JSON.stringify(payload)
                    });
                    
                    directSubmitMsg.innerHTML = `
                        <div class="flex flex-col items-center justify-center p-3">
                            <i data-lucide="check-circle" class="w-8 h-8 text-green-500 mb-1"></i>
                            <span class="font-bold">Registration Successful!</span>
                        </div>
                    `;
                    directSubmitMsg.className = "mt-4 text-center rounded-lg text-sm bg-green-900/60 border border-green-500 text-green-100 block";
                    lucide.createIcons();
                    
                    regForm.reset();
                    setTimeout(() => { 
                        backBtn.click();
                        directSubmitMsg.classList.add('hidden');
                    }, 3000);

                } catch (error) {
                    directSubmitMsg.innerHTML = "Error: Could not connect. Try again.";
                    directSubmitMsg.className = "mt-4 text-center p-3 rounded-lg text-sm bg-red-900/60 border border-red-500 text-red-100 block";
                } finally {
                    proceedBtn.disabled = false;
                    proceedBtnText.innerText = "Submit Registration";
                    proceedBtnIcon.classList.remove('hidden');
                }

            } else {
                // STUDENTS: OPEN PAYMENT MODAL
                paymentModal.classList.remove('hidden');
            }
        });
    }

    // Modal Close Logic
    function closePaymentModal() {
        paymentModal.classList.add('hidden');
        const msgBox = document.getElementById('modal-form-message');
        if (msgBox) msgBox.classList.add('hidden');
    }

    document.getElementById('close-modal-btn').addEventListener('click', closePaymentModal);
    const modalOverlay = paymentModal.querySelector('.fixed.inset-0.bg-black\\/80');
    if(modalOverlay) {
        modalOverlay.addEventListener('click', closePaymentModal);
    }
    
    // Copy UPI
    const copyUpiBtn = document.getElementById('copy-upi-btn');
    if (copyUpiBtn) {
        copyUpiBtn.addEventListener('click', () => {
            const upiId = document.getElementById('upi-id').innerText;
            const tempInput = document.createElement('input');
            tempInput.value = upiId;
            document.body.appendChild(tempInput);
            tempInput.select();
            try {
              document.execCommand('copy');
              copyUpiBtn.innerHTML = '<i data-lucide="check" class="w-4 h-4 text-green-500"></i>';
              setTimeout(() => {
                  copyUpiBtn.innerHTML = '<i data-lucide="copy" class="w-4 h-4"></i>';
                  lucide.createIcons();
              }, 2000);
            } catch (err) {}
            document.body.removeChild(tempInput);
            lucide.createIcons();
        });
    }

    // 4. Final Form Submission (With Payment)
    const finalSubmitForm = document.getElementById('final-submit-form');
    
    if(finalSubmitForm) {
        finalSubmitForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const eventId = selectedEventId.value;
            const scriptURL = eventScriptURLs[eventId];
            
            if (!scriptURL || scriptURL.includes('YOUR_GOOGLE_SCRIPT_URL')) {
                alert('Configuration Error: Google Script URL is missing.');
                return;
            }

            const submitBtn = document.getElementById('final-submit-btn');
            const submitText = document.getElementById('final-submit-text');
            const spinner = document.getElementById('final-submit-spinner');
            const msgBox = document.getElementById('modal-form-message');

            submitBtn.disabled = true;
            submitText.classList.add('hidden');
            spinner.classList.remove('hidden');
            msgBox.classList.add('hidden');

            const fileInput = document.getElementById('paymentScreenshot');
            const file = fileInput.files[0];
            const reader = new FileReader();
            
            reader.onload = async function() {
                const base64String = reader.result.split(',')[1];
                
                const payload = {
                    event: eventId,
                    name: document.getElementById('name').value,
                    rollNumber: document.getElementById('rollNumber').value,
                    college: document.getElementById('collegeName').value,
                    year: document.getElementById('year').value,
                    branch: document.getElementById('branch').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    transactionId: document.getElementById('transactionId').value,
                    fileName: file.name,
                    mimeType: file.type,
                    fileBase64: base64String
                };

                try {
                    await fetch(scriptURL, {
                        method: 'POST',
                        mode: 'no-cors',
                        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                        body: JSON.stringify(payload)
                    });
                    
                    msgBox.innerHTML = `
                        <div class="flex flex-col items-center justify-center py-2">
                            <i data-lucide="check-circle" class="w-10 h-10 text-green-500 mb-2"></i>
                            <span class="font-bold text-lg">Registration Successful!</span>
                            <span class="text-xs text-green-200 mt-1">Your details have been securely recorded. You may close this window.</span>
                        </div>
                    `;
                    msgBox.className = "mt-4 text-center p-3 rounded-lg text-sm bg-green-900/60 border border-green-500 text-green-100 block";
                    lucide.createIcons();
                    
                    regForm.reset();
                    finalSubmitForm.reset();
                    backBtn.click(); 

                } catch (error) {
                    msgBox.innerHTML = `
                        <div class="flex flex-col items-center justify-center py-2">
                            <i data-lucide="alert-circle" class="w-10 h-10 text-red-500 mb-2"></i>
                            <span class="font-bold text-lg">Form Not Submitted</span>
                            <span class="text-xs text-red-200 mt-1">Please check your internet connection and try again.</span>
                        </div>
                    `;
                    msgBox.className = "mt-4 text-center p-3 rounded-lg text-sm bg-red-900/60 border border-red-500 text-red-100 block";
                    lucide.createIcons();
                } finally {
                    submitBtn.disabled = false;
                    submitText.classList.remove('hidden');
                    spinner.classList.add('hidden');
                }
            };
            
            reader.readAsDataURL(file);
        });
    }
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async () => {
    await loadComponents();
    attachNavbarLogic(); 
    lucide.createIcons();
    initNeuralNetwork();   
    initTiltEffect();      
    initEventsPage();      
});
