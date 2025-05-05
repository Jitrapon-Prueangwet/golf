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

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
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
        });
    });

    // Result Handling
    function handleResult(isHit) {
        // Check if user is logged in
        const session = supabase.auth.getSession ? supabase.auth.getSession() : null;
        if (session && session.user === null) {
            alert('You must be logged in to track stats.');
            return;
        }
        const targetDistance = parseInt(targetInput.value);
        const numberOfBalls = parseInt(ballsInput.value);
        
        if (!targetDistance || targetDistance <= 0) {
            alert('Please enter a valid target distance');
            return;
        }

        if (!numberOfBalls || numberOfBalls <= 0) {
            alert('Please enter a valid number of balls');
            return;
        }

        totalAttempts += numberOfBalls;
        if (isHit) {
            successfulHits += numberOfBalls;
        }

        // Update UI
        updateProgress();
        updateStats();
    }

    // Update Progress Bar
    function updateProgress() {
        const successRate = totalAttempts > 0 ? (successfulHits / totalAttempts) * 100 : 0;
        progressFill.style.width = `${successRate}%`;
        successRateText.textContent = `${Math.round(successRate)}%`;
    }

    // Update Statistics
    function updateStats() {
        totalAttemptsText.textContent = totalAttempts;
        successfulHitsText.textContent = successfulHits;
        // Update balls hit info
        const percent = totalAttempts > 0 ? Math.round((successfulHits / totalAttempts) * 100) : 0;
        ballsHitInfo.textContent = `Balls Hit: ${successfulHits} / ${totalAttempts} (${percent}%)`;
        // Update actual hits info below number of balls
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

    ballsInput.addEventListener('input', (e) => {
        const value = e.target.value;
        if (value < 1) {
            e.target.value = 1;
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
        userStatus.style.display = 'flex';
        userEmail.textContent = email;
    }
    function hideUser() {
        userStatus.style.display = 'none';
        userEmail.textContent = '';
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
        if (user && user.email) {
            showUser(user.email);
            enableStatTracking(true);
        } else {
            hideUser();
            enableStatTracking(false);
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
});