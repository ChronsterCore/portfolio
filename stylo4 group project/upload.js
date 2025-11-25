document.addEventListener('DOMContentLoaded', () => {

    const imageInput = document.getElementById('image-input');
    const imagePreview = document.getElementById('image-preview');
    const uploadPlaceholder = document.getElementById('upload-placeholder');
    const uploadForm = document.getElementById('upload-form');

    // Tag input elements
    const typeInput = document.getElementById('type-input');
    const colorInput = document.getElementById('color-input');
    const typeTagsContainer = document.getElementById('type-tags-container');
    const colorTagsContainer = document.getElementById('color-tags-container');
    
    // Data arrays
    let clothingTypes = [];
    let clothingColors = [];
    let imageDataUrl = null;

    // --- Image Preview ---
    imageInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imageDataUrl = e.target.result; // Save the image data
                imagePreview.src = imageDataUrl;
                imagePreview.classList.remove('hidden');
                uploadPlaceholder.classList.add('hidden');
            };
            reader.readAsDataURL(file);
        }
    });

    // --- Tagging Logic ---
    const createTag = (text, container, dataArray) => {
        if (text && !dataArray.includes(text)) {
            dataArray.push(text); // Add to data array

            const tag = document.createElement('div');
            tag.className = 'tag';
            tag.innerHTML = `
                <span>${text}</span>
                <button type="button" class="remove-tag">×</button>
            `;
            
            // Remove tag event
            tag.querySelector('.remove-tag').addEventListener('click', () => {
                const index = dataArray.indexOf(text);
                if (index > -1) {
                    dataArray.splice(index, 1);
                }
                container.removeChild(tag);
            });

            container.appendChild(tag);
        }
    };

    // Event listeners for creating tags on Enter key
    typeInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && typeInput.value.trim() !== '') {
            e.preventDefault();
            createTag(typeInput.value.trim(), typeTagsContainer, clothingTypes);
            typeInput.value = '';
        }
    });
    
    colorInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && colorInput.value.trim() !== '') {
            e.preventDefault();
            createTag(colorInput.value.trim(), colorTagsContainer, clothingColors);
            colorInput.value = '';
        }
    });

    // --- Form Submission ---
    uploadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validation
        if (!imageDataUrl) {
            alert('Please select an image to upload.');
            return;
        }
        if (clothingTypes.length === 0) {
            alert('Please add at least one clothing type tag.');
            return;
        }
        if (clothingColors.length === 0) {
            alert('Please add at least one color tag.');
            return;
        }

        // Get existing wardrobe from localStorage or initialize empty array
        const wardrobe = JSON.parse(localStorage.getItem('styloWardrobe')) || [];
        
        // Create new clothing item object
        const newClothingItem = {
            id: `item-${Date.now()}`,
            image: imageDataUrl,
            types: clothingTypes,
            colors: clothingColors,
            event: document.getElementById('event-input').value.trim()
        };
        
        // Add new item to wardrobe and save back to localStorage
        wardrobe.push(newClothingItem);
        localStorage.setItem('styloWardrobe', JSON.stringify(wardrobe));
        
        alert('Clothing item uploaded successfully!');
        
        // Redirect to the wardrobe page to see the new item
        window.location.href = 'wardrobe.html';
    });

    // --- Initial Tags (from mockup) ---
    createTag('Dress', typeTagsContainer, clothingTypes);
    createTag('Blue', colorTagsContainer, clothingColors);
    createTag('Red', colorTagsContainer, clothingColors);
    createTag('Yellow', colorTagsContainer, clothingColors);
});