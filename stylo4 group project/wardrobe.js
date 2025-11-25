document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const wardrobeGrid = document.getElementById('wardrobe-grid');
    const noItemsMsg = document.getElementById('no-items-msg');
    const filterButtonsContainer = document.getElementById('filter-buttons-container');
    const categoryTitle = document.getElementById('category-title');
    const searchInput = document.getElementById('wardrobe-search-input');

    // Load wardrobe data from localStorage
    const wardrobe = JSON.parse(localStorage.getItem('styloWardrobe')) || [];

    // State variables
    let currentFilterTag = 'All';
    let currentSearchTerm = '';

    /**
     * Renders the wardrobe items based on current filters and search term.
     */
    function renderWardrobe() {
        wardrobeGrid.innerHTML = ''; // Clear the grid first
        categoryTitle.textContent = currentFilterTag;

        let filteredItems = wardrobe;

        // 1. Apply Tag Filtering first
        if (currentFilterTag !== 'All') {
            const lowerCaseFilter = currentFilterTag.toLowerCase();
            filteredItems = filteredItems.filter(item => {
                const inTypes = item.types && item.types.some(t => t.toLowerCase() === lowerCaseFilter);
                const inColors = item.colors && item.colors.some(c => c.toLowerCase() === lowerCaseFilter);
                const inEvent = item.event && item.event.toLowerCase() === lowerCaseFilter;
                return inTypes || inColors || inEvent;
            });
        }

        // 2. Apply Search Filtering on the result of the tag filter
        if (currentSearchTerm !== '') {
            const lowerCaseSearchTerm = currentSearchTerm.toLowerCase();
            filteredItems = filteredItems.filter(item => {
                const matchesType = item.types && item.types.some(t => t.toLowerCase().includes(lowerCaseSearchTerm));
                const matchesColor = item.colors && item.colors.some(c => c.toLowerCase().includes(lowerCaseSearchTerm));
                const matchesEvent = item.event && item.event.toLowerCase().includes(lowerCaseSearchTerm);
                return matchesType || matchesColor || matchesEvent;
            });
        }

        // 3. Display the final filtered items
        if (filteredItems.length > 0) {
            wardrobeGrid.classList.remove('hidden');
            noItemsMsg.classList.add('hidden');

            filteredItems.forEach(item => {
                const itemCard = document.createElement('div');
                itemCard.className = 'wardrobe-item-card';
                const altText = `Clothing item: ${Array.isArray(item.types) ? item.types.join(', ') : 'Unknown'}`;
                itemCard.innerHTML = `<img src="${item.image}" alt="${altText}">`;
                wardrobeGrid.appendChild(itemCard);
            });
        } else {
            wardrobeGrid.classList.add('hidden');
            noItemsMsg.classList.remove('hidden');
            if (wardrobe.length > 0) {
                noItemsMsg.textContent = `No items found matching your criteria.`;
            } else {
                noItemsMsg.textContent = "Your wardrobe is empty. Go to the upload page to add some clothes!";
            }
        }
    }

    /**
     * Sets up the filter buttons based on all available tags from the wardrobe.
     */
    function setupFilters() {
        if (wardrobe.length === 0) {
            document.querySelector('.search-bar-container').style.display = 'none';
            document.querySelector('.filter-controls').style.display = 'none';
            return;
        }

        const allTags = new Set();
        wardrobe.forEach(item => {
            if (item.types && Array.isArray(item.types)) item.types.forEach(type => allTags.add(type));
            if (item.colors && Array.isArray(item.colors)) item.colors.forEach(color => allTags.add(color));
            if (item.event && item.event.trim() !== '') allTags.add(item.event);
        });
        
        filterButtonsContainer.innerHTML = '';
        
        const allButton = document.createElement('button');
        allButton.className = 'filter-btn active';
        allButton.dataset.filter = 'All';
        allButton.textContent = 'All';
        filterButtonsContainer.appendChild(allButton);

        Array.from(allTags).sort().forEach(tag => {
            const button = document.createElement('button');
            button.className = 'filter-btn';
            button.dataset.filter = tag;
            button.textContent = tag;
            filterButtonsContainer.appendChild(button);
        });
    }

    /**
     * Attaches event listeners.
     */
    function attachListeners() {
        // Listener for filter buttons
        filterButtonsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                currentFilterTag = e.target.dataset.filter;
                filterButtonsContainer.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                renderWardrobe();
            }
        });

        // Listener for search input
        searchInput.addEventListener('input', (e) => {
            currentSearchTerm = e.target.value.trim();
            renderWardrobe();
        });
    }

    // --- Initial Execution ---
    setupFilters();
    attachListeners();
    renderWardrobe(); // Initial render
});