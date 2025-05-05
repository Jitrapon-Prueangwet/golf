// Initialize Supabase client
const supabaseUrl = 'https://xnnhtdvvjyqsoxyqwzhe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhubmh0ZHZ2anlxc294eXF3emhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0MTg2MjUsImV4cCI6MjA2MTk5NDYyNX0.qzTeP_dBbGETQKyf7tt4XBvGrZaWAYP38q0VLsS1jZc';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// DOM Elements
const clubButtons = document.querySelectorAll('.club-btn');
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');
const userStatus = document.getElementById('user-status');
const userEmail = document.getElementById('user-email');
const logoutBtn = document.getElementById('logout-btn');
const ironBtn = document.getElementById('iron-btn');
const ironDropdown = document.getElementById('iron-dropdown');
const driverBtn = document.getElementById('driver-btn');
const driverDropdown = document.getElementById('driver-dropdown');

// Chart instances
let overallChart, sessionsChart, progressChart;

// Initialize charts
function initializeCharts() {
    // Overall Performance Chart (Pie Chart)
    const overallCtx = document.getElementById('overall-chart').getContext('2d');
    overallChart = new Chart(overallCtx, {
        type: 'pie',
        data: {
            labels: ['Successful', 'Missed'],
            datasets: [{
                data: [0, 0],
                backgroundColor: ['#4CAF50', '#f44336']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // Recent Sessions Chart (Line Chart)
    const sessionsCtx = document.getElementById('sessions-chart').getContext('2d');
    sessionsChart = new Chart(sessionsCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Success Rate',
                data: [],
                borderColor: '#4CAF50',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });

    // Progress Over Time Chart (Line Chart)
    const progressCtx = document.getElementById('progress-chart').getContext('2d');
    progressChart = new Chart(progressCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Average Distance',
                data: [],
                borderColor: '#2196F3',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Fetch and update statistics
async function updateStatistics(clubType) {
    try {
        const { data: stats, error } = await supabase
            .from('practice_sessions')
            .select('*')
            .eq('club_type', clubType)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Calculate overall statistics
        const totalAttempts = stats.length;
        const successfulHits = stats.filter(s => s.success).length;
        const successRate = totalAttempts > 0 ? (successfulHits / totalAttempts * 100).toFixed(1) : 0;
        const avgDistance = totalAttempts > 0 
            ? (stats.reduce((sum, s) => sum + s.distance, 0) / totalAttempts).toFixed(1)
            : 0;
        const totalBalls = stats.reduce((sum, s) => sum + (s.total_attempts || 0), 0);

        // Update overall chart
        overallChart.data.datasets[0].data = [successfulHits, totalAttempts - successfulHits];
        overallChart.update();

        // Update recent sessions chart
        const recentSessions = stats.slice(0, 10).reverse();
        sessionsChart.data.labels = recentSessions.map(s => new Date(s.created_at).toLocaleDateString());
        sessionsChart.data.datasets[0].data = recentSessions.map(s => 
            (s.successful_hits / s.total_attempts * 100).toFixed(1)
        );
        sessionsChart.update();

        // Update progress chart
        const monthlyStats = calculateMonthlyStats(stats);
        progressChart.data.labels = monthlyStats.map(s => s.month);
        progressChart.data.datasets[0].data = monthlyStats.map(s => s.avgDistance);
        progressChart.update();

        // Update stat values
        document.getElementById('total-attempts').textContent = totalAttempts;
        document.getElementById('successful-hits').textContent = successfulHits;
        document.getElementById('success-rate').textContent = `${successRate}%`;
        document.getElementById('avg-distance').textContent = `${avgDistance} yards`;
        document.getElementById('balls-hit').textContent = totalBalls;

    } catch (error) {
        console.error('Error fetching statistics:', error);
    }
}

// Calculate monthly statistics
function calculateMonthlyStats(stats) {
    const monthlyData = {};
    
    stats.forEach(stat => {
        const date = new Date(stat.created_at);
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
        
        if (!monthlyData[monthYear]) {
            monthlyData[monthYear] = {
                totalDistance: 0,
                count: 0
            };
        }
        
        monthlyData[monthYear].totalDistance += stat.distance;
        monthlyData[monthYear].count++;
    });

    return Object.entries(monthlyData)
        .map(([month, data]) => ({
            month,
            avgDistance: (data.totalDistance / data.count).toFixed(1)
        }))
        .sort((a, b) => {
            const [aMonth, aYear] = a.month.split('/');
            const [bMonth, bYear] = b.month.split('/');
            return new Date(aYear, aMonth - 1) - new Date(bYear, bMonth - 1);
        });
}

// Event Listeners
clubButtons.forEach(button => {
    button.addEventListener('click', () => {
        clubButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        // Show/hide dropdowns
        if (button === ironBtn) {
            ironDropdown.style.display = 'inline-block';
            driverDropdown.style.display = 'none';
            updateStatistics(ironDropdown.value);
        } else if (button === driverBtn) {
            driverDropdown.style.display = 'inline-block';
            ironDropdown.style.display = 'none';
            updateStatistics(driverDropdown.value);
        } else {
            ironDropdown.style.display = 'none';
            driverDropdown.style.display = 'none';
            updateStatistics('putt');
        }
    });
});

// Dropdown change listeners
if (ironDropdown) {
    ironDropdown.addEventListener('change', function() {
        updateStatistics(this.value);
    });
}
if (driverDropdown) {
    driverDropdown.addEventListener('change', function() {
        updateStatistics(this.value);
    });
}

hamburger.addEventListener('click', () => {
    mobileNav.classList.toggle('active');
});

// Check authentication status
async function checkAuth() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (user) {
        userStatus.style.display = 'flex';
        userEmail.textContent = user.email;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeCharts();
    checkAuth();
    // Show iron dropdown by default
    if (ironDropdown && driverDropdown) {
        ironDropdown.style.display = 'inline-block';
        driverDropdown.style.display = 'none';
    }
    updateStatistics(ironDropdown ? ironDropdown.value : 'iron'); // Start with first iron
}); 