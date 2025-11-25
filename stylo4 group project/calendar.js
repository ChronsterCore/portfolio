document.addEventListener('DOMContentLoaded', () => {
    // --- TIME ---
    // const timeDisplay = document.getElementById('time-display');
    // function updateTime() {
    //     const now = new Date();
    //     timeDisplay.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    // }
    // updateTime();
    // setInterval(updateTime, 1000 * 60);

    // --- DOM Elements ---
    const monthYearEl = document.getElementById('current-month-year');
    const datesGridEl = document.getElementById('dates-grid');
    const prevMonthBtn = document.getElementById('prev-month-btn');
    const nextMonthBtn = document.getElementById('next-month-btn');
    const vibeDateDisplay = document.getElementById('vibe-date-display');
    const eventsListEl = document.getElementById('events-list');
    const createOutfitBtn = document.getElementById('create-outfit-btn');
    
    // Modal Elements
    const outfitModal = document.getElementById('outfit-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const outfitItemsGrid = document.getElementById('outfit-items-grid');
    const saveOutfitBtn = document.getElementById('save-outfit-btn');

    // --- State ---
    let currentDate = new Date();
    let selectedDateString = null;

    // --- Load Data ---
    // Load events from localStorage or use initial dummy data
    let events = JSON.parse(localStorage.getItem('styloEvents')) || {
        "2024-03-01": [{ name: "David's birthday", time: "Night" }],
        "2024-03-04": [{ name: "Meeting", time: "Evening" }],
        "2024-03-09": [{ name: "Dinner", time: "Night" }],
        "2024-03-20": [{ name: "Presentation", time: "Morning" }],
        "2024-03-26": [{ name: "Project Deadline", time: "All Day" }],
        "2024-04-11": [{ name: "Team Lunch", time: "Afternoon" }],
    };
    const wardrobe = JSON.parse(localStorage.getItem('styloWardrobe')) || [];


    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        monthYearEl.textContent = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
        datesGridEl.innerHTML = '';
        
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < firstDayOfMonth; i++) {
            datesGridEl.innerHTML += `<div class="date-cell empty"></div>`;
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dateCell = document.createElement('div');
            dateCell.className = 'date-cell';
            dateCell.textContent = day;
            const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            dateCell.dataset.date = dateString;

            const today = new Date();
            if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dateCell.classList.add('today');
            }

            if (events[dateString]) {
                dateCell.classList.add('has-event');
            }
            
            datesGridEl.appendChild(dateCell);
        }

        document.querySelectorAll('.date-cell:not(.empty)').forEach(cell => {
            cell.addEventListener('click', () => {
                document.querySelectorAll('.date-cell.selected').forEach(c => c.classList.remove('selected'));
                cell.classList.add('selected');
                updateEventView(cell.dataset.date);
            });
        });

        const todayCell = document.querySelector('.date-cell.today');
        if (todayCell) {
            todayCell.click();
        } else {
            document.querySelector('.date-cell:not(.empty)')?.click();
        }
    };

    const updateEventView = (dateString) => {
        selectedDateString = dateString;
        const selectedDate = new Date(dateString.replace(/-/g, '/'));

        vibeDateDisplay.innerHTML = `
            <span class="day-name">${selectedDate.toLocaleDateString('default', { weekday: 'short' })}</span>
            <span class="day-number">${String(selectedDate.getDate()).padStart(2, '0')}</span>
        `;

        eventsListEl.innerHTML = '';
        const dailyEvents = events[dateString];

        if (dailyEvents && dailyEvents.length > 0) {
            dailyEvents.forEach(event => {
                const eventItem = document.createElement('div');
                eventItem.className = 'event-item';
                eventItem.innerHTML = `
                    <div class="event-details">
                        <p class="event-name">${event.name}</p>
                        <p class="event-time">${event.time || ''}</p>
                    </div>
                    <button class="view-outfit-btn">View outfit</button>
                `;
                
                // If the event has an outfit, show thumbnails
                if(event.outfit && event.outfit.length > 0) {
                    const outfitContainer = document.createElement('div');
                    outfitContainer.className = 'outfit-thumbnails';
                    event.outfit.forEach(itemId => {
                        const clothingItem = wardrobe.find(c => c.id === itemId);
                        if(clothingItem) {
                            outfitContainer.innerHTML += `<img src="${clothingItem.image}" alt="outfit piece">`;
                        }
                    });
                    eventItem.querySelector('.event-details').appendChild(outfitContainer);
                }
                
                eventsListEl.appendChild(eventItem);
            });
        } else {
            eventsListEl.innerHTML = `<p class="no-events">No events scheduled for this day.</p>`;
        }
    };
    
    // --- Modal Logic ---
    const openOutfitModal = () => {
        if (!selectedDateString) {
            alert("Please select a date first!");
            return;
        }
        outfitItemsGrid.innerHTML = ''; // Clear previous items
        if (wardrobe.length > 0) {
            wardrobe.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'outfit-item';
                itemDiv.dataset.id = item.id;
                itemDiv.innerHTML = `<img src="${item.image}" alt="clothing item">`;
                itemDiv.addEventListener('click', () => {
                    itemDiv.classList.toggle('selected');
                });
                outfitItemsGrid.appendChild(itemDiv);
            });
        } else {
            outfitItemsGrid.innerHTML = `<p class="no-events">Your wardrobe is empty. Upload clothes to create an outfit.</p>`;
        }
        outfitModal.classList.remove('hidden');
    };

    const closeOutfitModal = () => {
        outfitModal.classList.add('hidden');
    };

    const saveOutfit = () => {
        const selectedItems = outfitItemsGrid.querySelectorAll('.outfit-item.selected');
        const selectedIds = Array.from(selectedItems).map(item => item.dataset.id);

        if (selectedIds.length === 0) {
            alert("Please select at least one item for the outfit.");
            return;
        }

        const newOutfitEvent = {
            name: "New Outfit",
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
            outfit: selectedIds
        };

        // Add to events object
        if (events[selectedDateString]) {
            events[selectedDateString].push(newOutfitEvent);
        } else {
            events[selectedDateString] = [newOutfitEvent];
        }

        // Save to localStorage
        localStorage.setItem('styloEvents', JSON.stringify(events));

        closeOutfitModal();
        renderCalendar(); // Re-render to show the new event dot
    };
    
    // --- Event Listeners ---
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    createOutfitBtn.addEventListener('click', openOutfitModal);
    modalCloseBtn.addEventListener('click', closeOutfitModal);
    saveOutfitBtn.addEventListener('click', saveOutfit);
    
    // --- Initial Render ---
    renderCalendar();
});