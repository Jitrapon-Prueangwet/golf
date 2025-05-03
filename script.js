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

    // State
    let currentClub = 'iron';
    let totalAttempts = 0;
    let successfulHits = 0;

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
}); 