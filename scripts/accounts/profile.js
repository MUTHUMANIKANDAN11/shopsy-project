import { getUserProfile, updateUserProfile } from '../utils/api.js';

document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('profile-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const addressInput = document.getElementById('address');
    const messageContainer = document.getElementById('message-container');
    const editButton = document.getElementById('edit-button');
    const saveButton = document.getElementById('save-button');

    const fields = [nameInput, phoneInput, addressInput];

    const setEditMode = (isEditing) => {
        fields.forEach(field => field.disabled = !isEditing);
        editButton.classList.toggle('d-none', isEditing);
        saveButton.classList.toggle('d-none', !isEditing);
    };

    // Load user profile
    try {
        const user = await getUserProfile();
        nameInput.value = user.name;
        emailInput.value = user.email;
        phoneInput.value = user.phone;
        addressInput.value = user.address || '';
    } catch (error) {
        messageContainer.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
    }

    // Handle edit button click
    editButton.addEventListener('click', () => {
        setEditMode(true);
    });

    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        messageContainer.innerHTML = '';
        const updatedData = {
            name: nameInput.value,
            phone: phoneInput.value,
            address: addressInput.value
        };

        try {
            const response = await updateUserProfile(updatedData);
            messageContainer.innerHTML = `<div class="alert alert-success">${response.message}</div>`;
            setEditMode(false);
        } catch (error) {
            messageContainer.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
        }
    });
}); 