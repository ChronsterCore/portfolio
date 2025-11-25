document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("metricsChart");
  if (!canvas) {
    console.error("Metrics chart canvas not found!");
  } else {
    const ctx = canvas.getContext("2d");
    if (window.metricsChart instanceof Chart) {
        window.metricsChart.destroy();
    }
    window.metricsChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [
            {
              label: "Exercise",
              data: [8, 8, 3, 6, 5, 2, 8],
              borderColor: "#3b82f6",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              tension: 0.4,
              borderWidth: 3,
              pointBackgroundColor: "#3b82f6",
              pointBorderColor: "#3b82f6",
              pointRadius: 5,
              fill: false,
            },
            {
              label: "Sleep",
              data: [12, 6, 2, 12, 5, 1, 12],
              borderColor: "#1f2937",
              backgroundColor: "rgba(31, 41, 55, 0.1)",
              tension: 0.4,
              borderWidth: 3,
              pointBackgroundColor: "#1f2937",
              pointBorderColor: "#1f2937",
              pointRadius: 5,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            intersect: false,
            mode: "index",
          },
          animation: {
            duration: 1000,
            easing: "easeInOutQuart",
          },
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                usePointStyle: true,
                padding: 20,
                font: {
                  size: 12,
                  weight: "500",
                },
              },
            },
            tooltip: { 
                backgroundColor: 'rgba(0,0,0,0.7)',
                titleFont: { size: 14, weight: 'bold'},
                bodyFont: { size: 12 },
                padding: 10,
                cornerRadius: 6,
                displayColors: true,
             }
          },
          scales: {
            x: {
              type: "category",
              grid: {
                color: "rgba(0, 0, 0, 0.1)",
                drawBorder: false,
              },
              ticks: {
                font: {
                  size: 11,
                  weight: "500",
                },
              },
            },
            y: {
              type: "linear",
              min: 0,
              max: 12, 
              beginAtZero: true,
              grid: {
                color: "rgba(0, 0, 0, 0.1)",
                drawBorder: false,
              },
              ticks: {
                stepSize: 2,
                font: {
                  size: 11,
                  weight: "500",
                },
              },
            },
          },
          elements: {
            point: {
              hoverRadius: 8,
            },
          },
          onHover: (event, chartElement) => {
            if (chartElement.length > 0) {
              const index = chartElement[0].index;
              updateProgressBarsWithChartData(index); // Modified to use specific data for progress
            } else {
                updateProgressBarsWithChartData(0); // Reset to first day or average on mouse out
            }
          },
        },
      });
  }

  // Sample data for progress bars tied to chart days (Mon-Sun)
  const activityRateDataForChartDays = [25, 58, 92, 100, 67, 45, 33];
  const moodRateDataForChartDays = [70, 40, 80, 90, 60, 50, 75];
  const chartLabelsForProgress = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  function updateProgressBarsWithChartData(dayIndex) {
    const activityBar = document.getElementById("activityRateProgress");
    const moodBar = document.getElementById("moodRateProgress");
    const activityValueEl = document.getElementById("activityRateValue");
    const moodValueEl = document.getElementById("moodRateValue");
    const activityDescEl = document.getElementById("activityRateDescription");
    const moodDescEl = document.getElementById("moodRateDescription");

    if (activityBar && moodBar && activityValueEl && moodValueEl && activityDescEl && moodDescEl) {
        let currentActivityRate, currentMoodRate, currentDayLabel;

        if (dayIndex >= 0 && dayIndex < chartLabelsForProgress.length) {
            currentActivityRate = activityRateDataForChartDays[dayIndex];
            currentMoodRate = moodRateDataForChartDays[dayIndex];
            currentDayLabel = chartLabelsForProgress[dayIndex];
        } else { 
            currentActivityRate = activityRateDataForChartDays.reduce((a, b) => a + b, 0) / activityRateDataForChartDays.length;
            currentMoodRate = moodRateDataForChartDays.reduce((a, b) => a + b, 0) / moodRateDataForChartDays.length;
            currentDayLabel = "Avg";
        }
      
      activityBar.style.width = currentActivityRate.toFixed(0) + "%";
      moodBar.style.width = currentMoodRate.toFixed(0) + "%";
      activityValueEl.textContent = currentActivityRate.toFixed(0) + "%";
      moodValueEl.textContent = currentMoodRate.toFixed(0) + "%";
      activityDescEl.textContent = `Percentage for ${currentDayLabel}`;
      moodDescEl.textContent = `Percentage for ${currentDayLabel}`;
    }
  }
  updateProgressBarsWithChartData(0);


  // Mood selection functionality
  const moodBtns = document.querySelectorAll(".mood-btn");
  const lastMoodValueEl = document.getElementById("lastMoodValue");

  moodBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      moodBtns.forEach((b) => b.classList.remove("selected"));
      this.classList.add("selected");

      const moodText = this.textContent.trim().split(" ").slice(1).join(" ") || this.textContent.trim(); // Get text after emoji
      if (lastMoodValueEl) {
        lastMoodValueEl.textContent = moodText;
      }
      localStorage.setItem('currentMood', this.dataset.mood); // Save mood
      console.log("Mood selected:", this.dataset.mood, moodText);
    });
  });

  // Attention items click functionality
  document.querySelectorAll(".attention-item").forEach((item) => {
    item.addEventListener("click", function () {
      this.style.transform = "scale(0.98)";
      setTimeout(() => {
        this.style.transform = "translateX(5px)"; 
        setTimeout(() => { this.style.transform = ""; }, 150);
      }, 100);
    });
  });

  // Update current date and live time
  function updateDateTime() {
    const now = new Date();
    const dateNumberEl = document.getElementById("dateNumber"); 
    const dateTextEl = document.getElementById("dateText"); 
    
    if (dateNumberEl && dateTextEl) {
        const optionsDate = { weekday: "short", day: "numeric", month: "short" };
        const dateStr = now.toLocaleDateString("en-US", optionsDate);
        const timeStr = now.toLocaleTimeString("en-US", { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

        dateNumberEl.textContent = timeStr;
        dateTextEl.textContent = dateStr;
    }
  }
  updateDateTime();
  setInterval(updateDateTime, 1000);

  // --- NEW: Reminder Logic for Homepage ---
  const reminderSectionHomepage = document.getElementById('reminderSectionHomepage');
  let currentlyRemindingHomepageIds = new Set();

  function timeToMinutes(timeStr) { // HH:MM
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
  }

  function checkRemindersHomepage() {
      if (!reminderSectionHomepage) return;

      const upcomingActivities = JSON.parse(localStorage.getItem('upcomingActivities')) || [];
      const completedActivities = JSON.parse(localStorage.getItem('completedActivities')) || [];
      const rejectedActivities = JSON.parse(localStorage.getItem('rejectedActivities')) || [];
      
      const now = new Date();
      const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
      let newRemindersFoundHomepage = false;

      upcomingActivities.forEach(activity => {
          const activityStartTimeInMinutes = timeToMinutes(activity.startTime);
          const activityEndTimeInMinutes = timeToMinutes(activity.endTime);

          const isCompleted = completedActivities.some(a => a.id === activity.id);
          const isRejected = rejectedActivities.some(a => a.id === activity.id);

          if (currentTimeInMinutes >= activityStartTimeInMinutes &&
              currentTimeInMinutes <= activityEndTimeInMinutes &&
              !isCompleted && !isRejected &&
              !currentlyRemindingHomepageIds.has(activity.id)) {
              
              currentlyRemindingHomepageIds.add(activity.id);
              addActivityToReminderUIHomepage(activity);
              newRemindersFoundHomepage = true;

          } else if (currentTimeInMinutes > activityEndTimeInMinutes && currentlyRemindingHomepageIds.has(activity.id)) {
              removeActivityFromReminderUIHomepage(activity.id);
              currentlyRemindingHomepageIds.delete(activity.id);
              newRemindersFoundHomepage = true;
          }
      });
      
      // Show/hide reminder card on homepage
      const reminderCardHomepage = document.getElementById('reminder-card-homepage');
      if(reminderCardHomepage) {
        if (reminderSectionHomepage.children.length > 0) {
            reminderCardHomepage.style.display = 'block';
        } else {
            reminderCardHomepage.style.display = 'none';
        }
      }
  }

  function addActivityToReminderUIHomepage(activity) {
      if (!reminderSectionHomepage) return;

      const reminderItem = document.createElement('div');
      reminderItem.classList.add('reminder-item-homepage', activity.type); // Specific class for homepage
      reminderItem.dataset.id = activity.id;
      reminderItem.innerHTML = `
          <span class="name">${activity.name} (${activity.startTime} - ${activity.endTime})</span>
          <div class="reminder-actions-homepage">
              <button class="reminder-btn-homepage done">Done</button>
              <button class="reminder-btn-homepage reject">Reject</button>
          </div>
      `;
      reminderSectionHomepage.appendChild(reminderItem);

      reminderItem.querySelector('.done').addEventListener('click', () => handleActivityActionHomepage(activity.id, 'completed'));
      reminderItem.querySelector('.reject').addEventListener('click', () => handleActivityActionHomepage(activity.id, 'rejected'));
  }
  
  function removeActivityFromReminderUIHomepage(activityId) {
      const reminderItem = reminderSectionHomepage.querySelector(`.reminder-item-homepage[data-id="${activityId}"]`);
      if (reminderItem) {
          reminderItem.remove();
      }
  }

  function handleActivityActionHomepage(activityId, action) {
      let upcoming = JSON.parse(localStorage.getItem('upcomingActivities')) || [];
      let completed = JSON.parse(localStorage.getItem('completedActivities')) || [];
      let rejected = JSON.parse(localStorage.getItem('rejectedActivities')) || [];

      const activityIndex = upcoming.findIndex(a => a.id === activityId);
      if (activityIndex === -1) return;

      const activity = upcoming.splice(activityIndex, 1)[0];
      
      if (action === 'completed') {
          completed.unshift(activity);
      } else if (action === 'rejected') {
          rejected.unshift(activity);
      }

      localStorage.setItem('upcomingActivities', JSON.stringify(upcoming));
      localStorage.setItem('completedActivities', JSON.stringify(completed));
      localStorage.setItem('rejectedActivities', JSON.stringify(rejected));

      currentlyRemindingHomepageIds.delete(activityId);
      removeActivityFromReminderUIHomepage(activityId);
      
      // Update UI elements on homepage if necessary (e.g., attention card)
      const attentionItems = document.querySelectorAll('.attention-item');
      if (attentionItems.length > 0) {
          attentionItems[0].textContent = `You have ${upcoming.length} to do list items remaining!`;
      }

      checkRemindersHomepage(); // Re-check to update card visibility
  }

  // Initial check and interval for homepage reminders
  checkRemindersHomepage();
  setInterval(checkRemindersHomepage, 5000); // Check every 5 seconds

  console.log("Homepage 2 (Dashboard) JS Loaded and Combined with Reminder Logic.");
});