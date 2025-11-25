document.addEventListener('DOMContentLoaded', () => {
    // Mobile Nav, Notifications, Footer animations are handled by base.js

    // --- Activity Page Specific Elements ---
    const addActivityForm = document.getElementById('addActivityForm');
    const activityNameInput = document.getElementById('activityName');
    const activityTypeSelect = document.getElementById('activityType');
    const activityStartInput = document.getElementById('activityStart');
    const activityEndInput = document.getElementById('activityEnd');
    const upcomingActivitiesList = document.getElementById('upcomingActivitiesList');
    const completedActivitiesList = document.getElementById('completedActivitiesList');
    const rejectedActivitiesList = document.getElementById('rejectedActivitiesList'); // New
    const moodOptions = document.querySelectorAll('.mood-option');
    const reminderSection = document.getElementById('reminderSection'); // New

    let upcomingActivities = [];
    let completedActivities = [];
    let rejectedActivities = [];
    let currentlyRemindingActivityIds = new Set();


    function loadActivitiesFromStorage() {
        upcomingActivities = JSON.parse(localStorage.getItem('upcomingActivities')) || [];
        completedActivities = JSON.parse(localStorage.getItem('completedActivities')) || [];
        rejectedActivities = JSON.parse(localStorage.getItem('rejectedActivities')) || [];
    }

    function saveActivitiesToStorage() {
        localStorage.setItem('upcomingActivities', JSON.stringify(upcomingActivities));
        localStorage.setItem('completedActivities', JSON.stringify(completedActivities));
        localStorage.setItem('rejectedActivities', JSON.stringify(rejectedActivities));
    }

    function renderActivities() {
        if (upcomingActivitiesList) {
            upcomingActivitiesList.innerHTML = '';
            upcomingActivities.forEach(activity => {
                if (!currentlyRemindingActivityIds.has(activity.id)) { // Don't show in upcoming if it's in reminder
                    const li = document.createElement('li');
                    li.classList.add('activity-item', activity.type);
                    li.innerHTML = `<span class="name">${activity.name}</span><span class="time">${activity.startTime} - ${activity.endTime}</span>`;
                    upcomingActivitiesList.appendChild(li);
                }
            });
        }
        if (completedActivitiesList) {
            completedActivitiesList.innerHTML = '';
            completedActivities.forEach(activity => {
                const li = document.createElement('li');
                li.classList.add('activity-item', activity.type);
                li.innerHTML = `<span class="name">${activity.name}</span><span class="status">✓ Done</span>`;
                completedActivitiesList.appendChild(li);
            });
        }
        if (rejectedActivitiesList) {
            rejectedActivitiesList.innerHTML = '';
            rejectedActivities.forEach(activity => {
                const li = document.createElement('li');
                li.classList.add('activity-item', activity.type, 'rejected'); // Added 'rejected' class for styling
                li.innerHTML = `<span class="name">${activity.name}</span><span class="status">✗ Rejected</span>`;
                rejectedActivitiesList.appendChild(li);
            });
        }
        checkReminders(); // Check reminders after every render to update UI
    }

    function timeToMinutes(timeStr) { // HH:MM
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    }

    function checkReminders() {
        if (!reminderSection) return;
        const now = new Date();
        const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();

        let newRemindersFound = false;
        upcomingActivities.forEach(activity => {
            const activityStartTimeInMinutes = timeToMinutes(activity.startTime);
            const activityEndTimeInMinutes = timeToMinutes(activity.endTime);

            if (currentTimeInMinutes >= activityStartTimeInMinutes && 
                currentTimeInMinutes <= activityEndTimeInMinutes && // Only remind if current time is within activity duration
                !currentlyRemindingActivityIds.has(activity.id) &&
                !completedActivities.find(a => a.id === activity.id) &&
                !rejectedActivities.find(a => a.id === activity.id)) {
                
                currentlyRemindingActivityIds.add(activity.id);
                addActivityToReminderUI(activity);
                newRemindersFound = true;
            } else if (currentTimeInMinutes > activityEndTimeInMinutes && currentlyRemindingActivityIds.has(activity.id)) {
                // Activity end time passed, remove from reminder if not actioned
                removeActivityFromReminderUI(activity.id);
                currentlyRemindingActivityIds.delete(activity.id);
                // Optionally, move to a "missed" state or just remove from upcoming
                 const index = upcomingActivities.findIndex(a => a.id === activity.id);
                 if (index > -1) {
                     // For now, just remove from upcoming if missed.
                     // A "missed" list could be added similarly to rejected.
                     // upcomingActivities.splice(index, 1);
                     // console.log(`Activity "${activity.name}" missed and removed from upcoming.`);
                     // saveActivitiesToStorage(); // Save changes
                 }
                newRemindersFound = true; // To trigger re-render of upcoming list
            }
        });
        
        if (newRemindersFound) {
            // Re-render upcoming list to remove items now in reminder
            if (upcomingActivitiesList) {
                upcomingActivitiesList.innerHTML = '';
                upcomingActivities.forEach(activity => {
                    if (!currentlyRemindingActivityIds.has(activity.id)) {
                        const li = document.createElement('li');
                        li.classList.add('activity-item', activity.type);
                        li.innerHTML = `<span class="name">${activity.name}</span><span class="time">${activity.startTime} - ${activity.endTime}</span>`;
                        upcomingActivitiesList.appendChild(li);
                    }
                });
            }
        }

        // Show/hide reminder section card
        const reminderCard = document.getElementById('reminder-panel-card');
        if (reminderCard) {
            if (reminderSection.children.length > 0) {
                reminderCard.style.display = 'block';
            } else {
                reminderCard.style.display = 'none';
            }
        }
    }

    function addActivityToReminderUI(activity) {
        if (!reminderSection) return;

        const reminderItem = document.createElement('div');
        reminderItem.classList.add('reminder-item', activity.type);
        reminderItem.dataset.id = activity.id;
        reminderItem.innerHTML = `
            <span class="name">${activity.name} (${activity.startTime} - ${activity.endTime})</span>
            <div class="reminder-actions">
                <button class="reminder-btn done">Done</button>
                <button class="reminder-btn reject">Reject</button>
            </div>
        `;
        reminderSection.appendChild(reminderItem);

        reminderItem.querySelector('.done').addEventListener('click', () => handleActivityAction(activity.id, 'completed'));
        reminderItem.querySelector('.reject').addEventListener('click', () => handleActivityAction(activity.id, 'rejected'));
    }
    
    function removeActivityFromReminderUI(activityId) {
        const reminderItem = reminderSection.querySelector(`.reminder-item[data-id="${activityId}"]`);
        if (reminderItem) {
            reminderItem.remove();
        }
    }

    function handleActivityAction(activityId, action) {
        const activityIndex = upcomingActivities.findIndex(a => a.id === activityId);
        if (activityIndex === -1) return;

        const activity = upcomingActivities.splice(activityIndex, 1)[0];
        
        if (action === 'completed') {
            completedActivities.unshift(activity);
        } else if (action === 'rejected') {
            rejectedActivities.unshift(activity);
        }

        currentlyRemindingActivityIds.delete(activityId);
        removeActivityFromReminderUI(activityId);
        saveActivitiesToStorage();
        renderActivities();
    }


    if (addActivityForm) {
        addActivityForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const newActivity = {
                id: Date.now(),
                name: activityNameInput.value,
                type: activityTypeSelect.value,
                startTime: activityStartInput.value,
                endTime: activityEndInput.value
            };
            if (newActivity.name && newActivity.type && newActivity.startTime && newActivity.endTime) {
                if (timeToMinutes(newActivity.startTime) >= timeToMinutes(newActivity.endTime)) {
                    alert("End time must be after start time.");
                    return;
                }
                upcomingActivities.unshift(newActivity);
                saveActivitiesToStorage();
                renderActivities();
                addActivityForm.reset();
                if(activityStartInput) activityStartInput.value = "00:00";
                if(activityEndInput) activityEndInput.value = "00:00";
                if(activityTypeSelect) activityTypeSelect.value = "";
            } else {
                alert("Please fill in all fields.");
            }
        });
    }

    if (moodOptions.length > 0) {
        moodOptions.forEach(option => {
            option.addEventListener('click', function() {
                moodOptions.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                console.log("Mood selected:", this.dataset.mood);
                localStorage.setItem('currentMood', this.dataset.mood); // Save mood
            });
        });
    }
    
    loadActivitiesFromStorage();
    renderActivities(); // Initial render
    checkReminders(); // Initial check
    setInterval(checkReminders, 5000); // Check every 5 seconds

    console.log("ActiFlow Activity Page JS Loaded and Updated");
});