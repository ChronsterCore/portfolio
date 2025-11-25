document.addEventListener('DOMContentLoaded', () => {
    // Mobile Nav, Notifications, Footer animations are handled by base.js

    const canvasCtx = document.getElementById('metricsChart');
    if (!canvasCtx) {
        console.error("Metrics chart canvas not found!");
        return;
    }
    const ctx = canvasCtx.getContext('2d');

    // Sample data for Activity Rate and Mood Rate (corresponds to days Mon-Sun)
    // Ensure these arrays have the same length as chartData.labels
    const activityRateData = [25, 58, 92, 100, 67, 45, 33]; 
    const moodRateData = [70, 40, 80, 90, 60, 50, 75];

    const chartData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Exercise (hours)',
                data: [1.5, 2, 0.5, 1, 2.5, 0, 1.5], // Example: hours
                borderColor: '#3b82f6', // Blue
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
                borderWidth: 2.5,
                fill: true,
            },
            {
                label: 'Sleep (hours)',
                data: [7, 6.5, 8, 5, 7.5, 9, 6], // Example: hours
                borderColor: '#1f2937', // Dark Gray
                backgroundColor: 'rgba(31, 41, 55, 0.1)',
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
                borderWidth: 2.5,
                fill: true,
            }
        ]
    };

    const config = {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: { size: 12 }
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += context.parsed.y + ' hrs';
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    // max: 24, // Max hours in a day - or let Chart.js auto-scale
                    grid: { display: true, color: 'rgba(0,0,0,0.05)' },
                    title: { display: true, text: 'Hours', font: {size: 12} },
                    ticks: { font: {size: 10} }
                },
                x: {
                    grid: { display: false }, // Cleaner look by hiding x-axis grid lines
                    title: { display: true, text: 'Day of the Week', font: {size: 12} },
                    ticks: { font: {size: 10} }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index',
            },
            onHover: (event, chartElements) => { // Corrected 'chartElement' to 'chartElements'
                if (chartElements.length > 0) {
                    const index = chartElements[0].index;
                    updateProgressBars(index);
                } else {
                    // Optionally, reset to average or default when not hovering
                    // updateProgressBars(-1); // -1 could signify a reset state
                }
            }
        }
    };
    
    if (window.actiFlowMetricsChart instanceof Chart) {
        window.actiFlowMetricsChart.destroy();
    }
    window.actiFlowMetricsChart = new Chart(ctx, config);

    function updateProgressBars(dayIndex) {
        const activityBar = document.getElementById("activityRateProgress");
        const moodBar = document.getElementById("moodRateProgress");
        const activityValueEl = document.getElementById("activityRateValue");
        const moodValueEl = document.getElementById("moodRateValue");
        const activityDescEl = document.getElementById("activityRateDescription");
        const moodDescEl = document.getElementById("moodRateDescription");

        if (!activityBar || !moodBar || !activityValueEl || !moodValueEl || !activityDescEl || !moodDescEl) {
            console.warn("Progress bar elements not found for update.");
            return;
        }

        let activityPercent, moodPercent, dayLabel;

        if (dayIndex >= 0 && dayIndex < chartData.labels.length) {
            activityPercent = activityRateData[dayIndex];
            moodPercent = moodRateData[dayIndex];
            dayLabel = chartData.labels[dayIndex];
        } else { // Default or reset state (e.g., show average)
            activityPercent = activityRateData.reduce((a,b) => a+b,0) / activityRateData.length || 0;
            moodPercent = moodRateData.reduce((a,b) => a+b,0) / moodRateData.length || 0;
            dayLabel = "Avg";
        }
        
        activityBar.style.width = activityPercent.toFixed(0) + "%";
        moodBar.style.width = moodPercent.toFixed(0) + "%";
        activityValueEl.textContent = activityPercent.toFixed(0) + "%";
        moodValueEl.textContent = moodPercent.toFixed(0) + "%";
        activityDescEl.textContent = `Activity for ${dayLabel}`;
        moodDescEl.textContent = `Mood for ${dayLabel}`;
    }
    
    // Initial update of progress bars (e.g., show average or first day)
    updateProgressBars(0); // Show data for 'Mon' initially or -1 for average

    const recommendationButton = document.querySelector('.recommendation-btn');
    if (recommendationButton) {
        recommendationButton.addEventListener('click', function() {
            window.location.href = 'recommendation_page.html';
        });
    }
    console.log("Statistic Page JS Loaded");
});