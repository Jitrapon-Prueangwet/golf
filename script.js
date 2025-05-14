document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const clubButtons = document.querySelectorAll('.club-btn');
    const targetInput = document.getElementById('target');
    const ballsInput = document.getElementById('balls');
    const hitButton = document.querySelector('.hit');
    const missButton = document.querySelector('.miss');
    const progressFill = document.querySelector('.progress-fill');
    const successRateText = document.getElementById('success-rate');
    const totalAttemptsText = document.getElementById('total-attempts');
    const successfulHitsText = document.getElementById('successful-hits');
    const ballsHitInfo = document.getElementById('balls-hit-info');
    const actualHitsInfo = document.getElementById('actual-hits-info');
    const resetBtn = document.getElementById('reset-btn');
    const payBtn = document.getElementById('pay-btn');
    const ironBtn = document.getElementById('iron-btn');
    const ironDropdown = document.getElementById('iron-dropdown');
    const driverBtn = document.getElementById('driver-btn');
    const driverDropdown = document.getElementById('driver-dropdown');
    const celebrateModal = document.getElementById('celebrate-modal');
    const closeCelebrate = document.getElementById('close-celebrate');
    const setGoalModal = document.getElementById('set-goal-modal');
    const setGoalOkBtn = document.getElementById('set-goal-ok-btn');
    const setGoalMessage = document.getElementById('set-goal-message');
    const setGoalConfettiCanvas = document.getElementById('set-goal-confetti-canvas');
    const targetLabel = document.getElementById('target-label');
    const targetUnit = document.getElementById('target-unit');
    const nightModeToggle = document.getElementById('night-mode-toggle');
    const moonIcon = document.querySelector('.moon-icon');
    const sunIcon = document.querySelector('.sun-icon');

    // State
    let currentClub = 'iron';
    let totalAttempts = 0;
    let successfulHits = 0;

    // Supabase client initialization
    const SUPABASE_URL = 'https://xnnhtdvvjyqsoxyqwzhe.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhubmh0ZHZ2anlxc294eXF3emhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0MTg2MjUsImV4cCI6MjA2MTk5NDYyNX0.qzTeP_dBbGETQKyf7tt4XBvGrZaWAYP38q0VLsS1jZc';
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Hamburger and modal logic
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobile-nav');
    const signupBtn = document.getElementById('signup-btn');
    const signupModal = document.getElementById('signup-modal');
    const closeSignup = document.getElementById('close-signup');
    const signupForm = document.getElementById('signup-form');
    const signupMessage = document.getElementById('signup-message');

    // Login and session management
    const loginBtn = document.getElementById('login-btn');
    const loginModal = document.getElementById('login-modal');
    const closeLogin = document.getElementById('close-login');
    const loginForm = document.getElementById('login-form');
    const loginMessage = document.getElementById('login-message');
    const userStatus = document.getElementById('user-status');
    const userEmail = document.getElementById('user-email');
    const logoutBtn = document.getElementById('logout-btn');
    const mainContent = document.querySelector('main');

    // Subscription landing modal logic
    const openSubscribeLandingBtn = document.getElementById('open-subscribe-landing');
    const subscribeLandingModal = document.getElementById('subscribe-landing-modal');
    const closeSubscribeLanding = document.getElementById('close-subscribe-landing');
    const subscribeMonthlyBtn = document.getElementById('subscribe-monthly-btn');
    const subscribeLifetimeBtn = document.getElementById('subscribe-lifetime-btn');

    const navBackdrop = document.getElementById('nav-backdrop');
    document.querySelectorAll('.mobile-nav button').forEach(btn => {
        btn.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            if (navBackdrop) navBackdrop.style.display = 'none';
        });
    });
    if (navBackdrop) {
        navBackdrop.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            navBackdrop.style.display = 'none';
        });
    }
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
            if (navBackdrop) navBackdrop.style.display = mobileNav.classList.contains('active') ? 'block' : 'none';
        });
    }

    if (signupBtn) {
        signupBtn.addEventListener('click', () => {
            signupModal.style.display = 'flex';
            mobileNav.classList.remove('active');
        });
    }
    if (closeSignup) {
        closeSignup.addEventListener('click', () => {
            signupModal.style.display = 'none';
            signupMessage.textContent = '';
        });
    }
    window.onclick = function(event) {
        if (event.target === signupModal) {
            signupModal.style.display = 'none';
            signupMessage.textContent = '';
        }
    };

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            signupMessage.textContent = 'Signing up...';
            try {
                if (!supabase) throw new Error('Supabase client not initialized.');
                const { user, error } = await supabase.auth.signUp({ email, password });
                if (error) {
                    signupMessage.textContent = error.message;
                } else {
                    signupMessage.textContent = 'Sign up successful! Please check your email to confirm.';
                    signupForm.reset();
                }
            } catch (err) {
                signupMessage.textContent = err.message;
            }
        });
    }

    // Club Selection
    clubButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            clubButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            // Update current club
            currentClub = button.dataset.club;
            // Show/hide iron and driver dropdowns
            if (button === ironBtn) {
                ironDropdown.style.display = 'inline-block';
                driverDropdown.style.display = 'none';
            } else if (button === driverBtn) {
                driverDropdown.style.display = 'inline-block';
                ironDropdown.style.display = 'none';
            } else {
                ironDropdown.style.display = 'none';
                driverDropdown.style.display = 'none';
            }
            // Update target label and unit dropdown
            if (button.dataset.club === 'putt') {
                if (targetLabel) targetLabel.textContent = 'Target Distance';
                if (targetUnit) {
                    targetUnit.innerHTML = '<option value="feet">feet</option><option value="meters">meters</option>';
                    targetUnit.value = 'feet';
                }
            } else {
                if (targetLabel) targetLabel.textContent = 'Target Distance (yards):';
                if (targetUnit) {
                    targetUnit.innerHTML = '<option value="yards">yards</option>';
                    targetUnit.value = 'yards';
                }
            }
        });
    });

    // When a specific iron is selected, update currentClub
    if (ironDropdown) {
        ironDropdown.addEventListener('change', function() {
            currentClub = this.value;
        });
    }

    // When a specific driver/wood is selected, update currentClub
    if (driverDropdown) {
        driverDropdown.addEventListener('change', function() {
            currentClub = this.value;
        });
    }

    // Result Handling
    async function handleResult(isHit) {
        // Check if user is logged in
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            alert('You must be logged in to track stats.');
            return;
        }
        const targetDistance = parseInt(targetInput.value);
        const targetBalls = parseInt(ballsInput.value) || 1;
        // Prevent counting more than the target
        if (successfulHits + (isHit ? 1 : 0) > targetBalls || totalAttempts >= targetBalls) {
            return;
        }
        if (!targetDistance || targetDistance <= 0) {
            alert('Please enter a valid target distance');
            return;
        }
        // Only count 1 ball per click
        totalAttempts += 1;
        if (isHit) {
            successfulHits += 1;
        }
        // Only insert when session is complete
        if (totalAttempts === targetBalls) {
            const ballsMissed = totalAttempts - successfulHits;
            const successRate = (successfulHits / totalAttempts) * 100;
            const currentTimestamp = new Date().toISOString();
            await supabase.from('practice_sessions').insert([
                {
                    user_id: user.id,
                    date: currentTimestamp,
                    club: currentClub,
                    target_distance: targetDistance,
                    target_balls: targetBalls,
                    balls_hit: successfulHits,
                    balls_missed: ballsMissed,
                    success_rate: successRate
                }
            ]);
            // Show set-goal modal with appropriate message when totalAttempts reaches targetBalls
            if (setGoalModal && setGoalMessage) {
                const percent = (successfulHits / targetBalls) * 100;
                if (percent >= 80) {
                    setGoalMessage.innerHTML = '<h2 style="color: var(--hermes-orange); font-size:2rem;">🎉 Congratulations! 🎉</h2><p style="font-size:1.2rem;">You hit ' + successfulHits + ' out of ' + targetBalls + ' balls! (' + Math.round(percent) + '%)</p>';
                    if (setGoalConfettiCanvas) {
                        setGoalConfettiCanvas.style.display = 'block';
                        launchSetGoalConfetti();
                    }
                } else {
                    setGoalMessage.innerHTML = '<h2 style="color: var(--hermes-orange); font-size:2rem;">Keep Trying!</h2><p style="font-size:1.2rem;">You hit ' + successfulHits + ' out of ' + targetBalls + ' balls. (' + Math.round(percent) + '%)<br>You will get there! Set another goal and keep practicing!</p>';
                    if (setGoalConfettiCanvas) setGoalConfettiCanvas.style.display = 'none';
                }
                setGoalModal.style.display = 'flex';
            }
            // Update Balls Hit for this session
            actualHitsInfo.textContent = `Balls Hit: ${successfulHits}`;
            // Reset for next session
            totalAttempts = 0;
            successfulHits = 0;
            targetInput.value = '';
            ballsInput.value = 1;
            updateProgress();
            updateStats();
        } else {
            // Just update UI for each hit/miss
            updateProgress();
            updateStats();
            actualHitsInfo.textContent = `Balls Hit: ${successfulHits}`;
        }
        // Show celebrate modal if target reached
        if (successfulHits === targetBalls && celebrateModal) {
            celebrateModal.style.display = 'flex';
            launchConfetti();
        }
    }

    // Update Progress Bar
    function updateProgress() {
        const targetBalls = parseInt(ballsInput.value) || 1;
        const percent = successfulHits > 0 ? (successfulHits / targetBalls) * 100 : 0;
        progressFill.style.width = `${Math.min(percent, 100)}%`;
        successRateText.textContent = `${Math.round(percent)}%`;
    }

    // Update Statistics
    async function fetchAllTimeStats(club) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { totalAttempts: 0, successfulHits: 0 };
        }
        const { data, error } = await supabase
            .from('practice_sessions')
            .select('total_attempts, successful_hits')
            .eq('club_type', club)
            .eq('user_id', user.id);
        if (error) {
            console.error('Error fetching stats:', error);
            return { totalAttempts: 0, successfulHits: 0 };
        }
        let totalAttempts = 0;
        let successfulHits = 0;
        data.forEach(row => {
            totalAttempts += row.total_attempts || 0;
            successfulHits += row.successful_hits || 0;
        });
        return { totalAttempts, successfulHits };
    }

    async function updateStats() {
        // Update the Balls Hit display to show only the current session's stats
        const targetBalls = parseInt(ballsInput.value) || 1;
        const percent = totalAttempts > 0 ? Math.round((successfulHits / totalAttempts) * 100) : 0;
        ballsHitInfo.textContent = `Balls Hit: ${successfulHits} / ${totalAttempts} (${percent}%)`;
        // All-time stats remain in the boxes below
        const club = currentClub;
        const { totalAttempts: allTimeAttempts, successfulHits: allTimeHits } = await fetchAllTimeStats(club);
        totalAttemptsText.textContent = allTimeAttempts;
        successfulHitsText.textContent = allTimeHits;
        actualHitsInfo.textContent = `Balls Hit: ${successfulHits}`;
    }

    // Event Listeners
    hitButton.addEventListener('click', () => handleResult(true));
    missButton.addEventListener('click', () => handleResult(false));

    // Input Validation
    targetInput.addEventListener('input', (e) => {
        const value = e.target.value;
        if (value < 0) {
            e.target.value = 0;
        }
    });

    // Reset functionality
    resetBtn.addEventListener('click', () => {
        totalAttempts = 0;
        successfulHits = 0;
        targetInput.value = '';
        ballsInput.value = 1;
        updateProgress();
        updateStats();
        actualHitsInfo.textContent = 'Balls Hit: 0';
    });

    // Helper: Show/hide elements
    function showUser(email) {
        if (userStatus) userStatus.style.display = 'flex';
        if (userEmail) userEmail.textContent = email;
    }
    function hideUser() {
        if (userStatus) userStatus.style.display = 'none';
        if (userEmail) userEmail.textContent = '';
    }

    // Open/close login modal
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            loginModal.style.display = 'flex';
            mobileNav.classList.remove('active');
        });
    }
    if (closeLogin) {
        closeLogin.addEventListener('click', () => {
            loginModal.style.display = 'none';
            loginMessage.textContent = '';
        });
    }
    window.addEventListener('click', function(event) {
        if (event.target === loginModal) {
            loginModal.style.display = 'none';
            loginMessage.textContent = '';
        }
    });

    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            loginMessage.textContent = 'Logging in...';
            try {
                const { data, error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) {
                    loginMessage.textContent = error.message;
                } else {
                    loginMessage.textContent = 'Login successful!';
                    loginForm.reset();
                    loginModal.style.display = 'none';
                    setAuthUI();
                }
            } catch (err) {
                loginMessage.textContent = err.message;
            }
        });
    }

    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await supabase.auth.signOut();
            setAuthUI();
        });
    }

    // Auth state and UI
    async function setAuthUI() {
        const { data: { user } } = await supabase.auth.getUser();
        const subscribeBtn = document.getElementById('open-subscribe-landing');
        if (user && user.email) {
            showUser(user.email);
            enableStatTracking(true);
            // Hide Sign Up and Log In, show user-status and subscription
            if (signupBtn) signupBtn.style.display = 'none';
            if (loginBtn) loginBtn.style.display = 'none';
            if (userStatus) userStatus.style.display = 'flex';
            if (subscribeBtn) subscribeBtn.style.display = '';
        } else {
            hideUser();
            enableStatTracking(false);
            // Show Sign Up and Log In, hide user-status and subscription
            if (signupBtn) signupBtn.style.display = '';
            if (loginBtn) loginBtn.style.display = '';
            if (userStatus) userStatus.style.display = 'none';
            if (subscribeBtn) subscribeBtn.style.display = 'none';
        }
    }

    // Restrict stat tracking to logged-in users
    function enableStatTracking(enabled) {
        // No longer restrict UI, just control stat tracking in handleResult
    }

    // Listen for auth state changes
    supabase.auth.onAuthStateChange((_event, _session) => {
        setAuthUI();
    });

    // On load, set UI
    setAuthUI();

    // Pay button logic
    if (payBtn) {
        payBtn.addEventListener('click', async () => {
            // Get the logged-in user's email from Supabase
            const { data: { user } } = await supabase.auth.getUser();
            if (!user || !user.email) {
                alert('Please log in to subscribe.');
                return;
            }
            try {
                const response = await fetch('http://localhost:4242/create-checkout-session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: user.email }),
                });
                const data = await response.json();
                if (data.url) {
                    window.location.href = data.url; // Redirect to Stripe Checkout
                } else {
                    alert('Error creating checkout session.');
                }
            } catch (err) {
                alert('Error connecting to payment server.');
            }
        });
    }

    if (openSubscribeLandingBtn) {
        openSubscribeLandingBtn.addEventListener('click', () => {
            subscribeLandingModal.style.display = 'flex';
            mobileNav.classList.remove('active');
        });
    }
    if (closeSubscribeLanding) {
        closeSubscribeLanding.addEventListener('click', () => {
            subscribeLandingModal.style.display = 'none';
        });
    }
    window.addEventListener('click', function(event) {
        if (event.target === subscribeLandingModal) {
            subscribeLandingModal.style.display = 'none';
        }
    });

    async function handleSubscribe(type) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || !user.email) {
            alert('Please log in to subscribe.');
            return;
        }
        try {
            const response = await fetch('http://localhost:4242/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email, type }),
            });
            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert('Error creating checkout session.');
            }
        } catch (err) {
            alert('Error connecting to payment server.');
        }
    }

    if (subscribeMonthlyBtn) {
        subscribeMonthlyBtn.addEventListener('click', function() {
            window.location.href = 'https://buy.stripe.com/9AQ4jze6qglG9nW7ss';
        });
    }
    if (subscribeLifetimeBtn) {
        subscribeLifetimeBtn.addEventListener('click', () => handleSubscribe('lifetime'));
    }

    // Close celebrate modal
    if (closeCelebrate && celebrateModal) {
        closeCelebrate.addEventListener('click', function() {
            celebrateModal.style.display = 'none';
        });
    }
    window.addEventListener('click', function(event) {
        if (event.target === celebrateModal) {
            celebrateModal.style.display = 'none';
        }
    });

    // Confetti animation
    function launchConfetti() {
        const canvas = document.getElementById('confetti-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let W = canvas.width = canvas.offsetWidth;
        let H = canvas.height = canvas.offsetHeight;
        let confetti = [];
        const confettiCount = 120;
        const colors = ['#FF4E00', '#FF7A33', '#CC3E00', '#FFD700', '#00CFFF', '#FF69B4'];
        for (let i = 0; i < confettiCount; i++) {
            confetti.push({
                x: Math.random() * W,
                y: Math.random() * H - H,
                r: Math.random() * 6 + 4,
                d: Math.random() * confettiCount,
                color: colors[Math.floor(Math.random() * colors.length)],
                tilt: Math.floor(Math.random() * 10) - 10,
                tiltAngleIncremental: (Math.random() * 0.07) + .05,
                tiltAngle: 0
            });
        }
        let angle = 0;
        let tiltAngle = 0;
        let animationFrame;
        function draw() {
            ctx.clearRect(0, 0, W, H);
            for (let i = 0; i < confettiCount; i++) {
                let c = confetti[i];
                ctx.beginPath();
                ctx.lineWidth = c.r;
                ctx.strokeStyle = c.color;
                ctx.moveTo(c.x + c.tilt + (c.r / 3), c.y);
                ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r);
                ctx.stroke();
            }
            update();
        }
        function update() {
            angle += 0.01;
            tiltAngle += 0.1;
            for (let i = 0; i < confettiCount; i++) {
                let c = confetti[i];
                c.y += (Math.cos(angle + c.d) + 1 + c.r / 2) / 2;
                c.x += Math.sin(angle);
                c.tiltAngle += c.tiltAngleIncremental;
                c.tilt = Math.sin(c.tiltAngle - (i / 3)) * 15;
                if (c.y > H) {
                    c.x = Math.random() * W;
                    c.y = -10;
                }
            }
        }
        function loop() {
            draw();
            animationFrame = requestAnimationFrame(loop);
        }
        loop();
        // Stop after 3 seconds
        setTimeout(() => {
            cancelAnimationFrame(animationFrame);
            ctx.clearRect(0, 0, W, H);
            // After confetti, show set-goal modal and reset page
            if (setGoalModal) setGoalModal.style.display = 'flex';
            // Reset page to default
            totalAttempts = 0;
            successfulHits = 0;
            targetInput.value = '';
            ballsInput.value = 1;
            updateProgress();
            updateStats();
            actualHitsInfo.textContent = 'Balls Hit: 0';
        }, 3000);
        // Also clear on modal close
        function clearConfetti() {
            cancelAnimationFrame(animationFrame);
            ctx.clearRect(0, 0, W, H);
        }
        celebrateModal.addEventListener('click', clearConfetti, { once: true });
        if (closeCelebrate) closeCelebrate.addEventListener('click', clearConfetti, { once: true });
    }

    if (setGoalOkBtn && setGoalModal) {
        setGoalOkBtn.addEventListener('click', function() {
            setGoalModal.style.display = 'none';
        });
    }

    // Confetti for set-goal modal
    function launchSetGoalConfetti() {
        const canvas = setGoalConfettiCanvas;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let W = canvas.width = canvas.offsetWidth;
        let H = canvas.height = canvas.offsetHeight;
        let confetti = [];
        const confettiCount = 100;
        const colors = ['#FF4E00', '#FF7A33', '#CC3E00', '#FFD700', '#00CFFF', '#FF69B4'];
        for (let i = 0; i < confettiCount; i++) {
            confetti.push({
                x: Math.random() * W,
                y: Math.random() * H - H,
                r: Math.random() * 6 + 4,
                d: Math.random() * confettiCount,
                color: colors[Math.floor(Math.random() * colors.length)],
                tilt: Math.floor(Math.random() * 10) - 10,
                tiltAngleIncremental: (Math.random() * 0.07) + .05,
                tiltAngle: 0
            });
        }
        let angle = 0;
        let tiltAngle = 0;
        let animationFrame;
        function draw() {
            ctx.clearRect(0, 0, W, H);
            for (let i = 0; i < confettiCount; i++) {
                let c = confetti[i];
                ctx.beginPath();
                ctx.lineWidth = c.r;
                ctx.strokeStyle = c.color;
                ctx.moveTo(c.x + c.tilt + (c.r / 3), c.y);
                ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r);
                ctx.stroke();
            }
            update();
        }
        function update() {
            angle += 0.01;
            tiltAngle += 0.1;
            for (let i = 0; i < confettiCount; i++) {
                let c = confetti[i];
                c.y += (Math.cos(angle + c.d) + 1 + c.r / 2) / 2;
                c.x += Math.sin(angle);
                c.tiltAngle += c.tiltAngleIncremental;
                c.tilt = Math.sin(c.tiltAngle - (i / 3)) * 15;
                if (c.y > H) {
                    c.x = Math.random() * W;
                    c.y = -10;
                }
            }
        }
        function loop() {
            draw();
            animationFrame = requestAnimationFrame(loop);
        }
        loop();
        // Stop after 3 seconds
        setTimeout(() => {
            cancelAnimationFrame(animationFrame);
            ctx.clearRect(0, 0, W, H);
            canvas.style.display = 'none';
        }, 3000);
    }

    // Night mode functionality
    function initNightMode() {
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        if (isDarkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
            moonIcon.style.display = 'none';
            sunIcon.style.display = 'inline';
        }
    }

    if (nightModeToggle) {
        nightModeToggle.addEventListener('click', () => {
            const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
            if (isDarkMode) {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('darkMode', 'false');
                moonIcon.style.display = 'inline';
                sunIcon.style.display = 'none';
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('darkMode', 'true');
                moonIcon.style.display = 'none';
                sunIcon.style.display = 'inline';
            }
        });
    }

    // Initialize night mode
    initNightMode();

    const subscribeBtn = document.getElementById('open-subscribe-landing');
    if (subscribeBtn) subscribeBtn.style.display = 'none';
});