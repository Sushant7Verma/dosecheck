document.addEventListener("DOMContentLoaded", () => {
    const medicineTable = document.getElementById("medicineList");
    const addMedicineBtn = document.getElementById("addMedicineBtn");
    const medicineModal = document.getElementById("medicineModal");
    const closeModal = document.querySelector(".close");
    const medicineForm = document.getElementById("medicineForm");
    const medicineNameInput = document.getElementById("medicineName");
    const medicineTimeHourInput = document.getElementById("medicineTimeHour");
    const medicineTimeMinuteInput = document.getElementById("medicineTimeMinute");

    // Preloaded medicines from the provided list with default time set to 12:00
    let medicines = JSON.parse(localStorage.getItem("medicines")) || [
        { name: "CAP NINTENA 150MG", hour: 12, minute: 0, taken: false },
        { name: "SEROFLO INHALER", hour: 12, minute: 0, taken: false },
        { name: "TAB MOFGEN 500MG", hour: 12, minute: 0, taken: false },
        { name: "TAB LIMCEE 500MG", hour: 12, minute: 0, taken: false },
        { name: "LIQ TOSSEX NEW 100ML", hour: 12, minute: 0, taken: false },
        { name: "CAP BENZ 100MG", hour: 12, minute: 0, taken: false },
    ];

    // Render medicines in the table
    function renderMedicines() {
        medicineTable.innerHTML = "";
        medicines.forEach((med, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${med.name}</td>
                <td>${String(med.hour).padStart(2, "0")}:${String(med.minute).padStart(2, "0")}</td>
                <td>${med.taken ? "Taken" : "Not Taken"}</td>
                <td>
                    <button onclick="editMedicine(${index})">Edit</button> 
                    <button onclick="deleteMedicine(${index})">Delete</button> 
                    <button onclick="toggleTaken(${index})">${med.taken ? "Untick" : "Tick"}</button>
                </td>`;
            medicineTable.appendChild(row);
        });
    }

    // Add or Edit Medicine
    function saveMedicine(event) {
        event.preventDefault();
        const name = medicineNameInput.value.trim();
        const hour = parseInt(medicineTimeHourInput.value);
        const minute = parseInt(medicineTimeMinuteInput.value);
        if (name && hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
            if (medicineForm.dataset.editIndex) {
                // Edit existing medicine
                const index = parseInt(medicineForm.dataset.editIndex);
                medicines[index] = { name, hour, minute, taken: false };
                delete medicineForm.dataset.editIndex;
            } else {
                // Add new medicine
                medicines.push({ name, hour, minute, taken: false });
            }
            localStorage.setItem("medicines", JSON.stringify(medicines));
            renderMedicines();
            closeModal.click();
        }
    }

    // Edit Medicine
    window.editMedicine = function (index) {
        const med = medicines[index];
        medicineNameInput.value = med.name;
        medicineTimeHourInput.value = med.hour;
        medicineTimeMinuteInput.value = med.minute;
        medicineForm.dataset.editIndex = index.toString();
        document.getElementById("modalTitle").textContent = "Edit Medicine";
        medicineModal.style.display = "block";
    };

    // Delete Medicine
    window.deleteMedicine = function (index) {
        medicines.splice(index, 1);
        localStorage.setItem("medicines", JSON.stringify(medicines));
        renderMedicines();
    };

    // Toggle Taken Status
    window.toggleTaken = function (index) {
        medicines[index].taken = !medicines[index].taken;
        localStorage.setItem("medicines", JSON.stringify(medicines));
        renderMedicines();
    };

    // Reset Taken Status at 2 AM
    function resetTakenStatus() {
        const now = new Date();
        if (now.getHours() === 1 && now.getMinutes() === 40) {
            medicines.forEach((med) => (med.taken = false));
            localStorage.setItem("medicines", JSON.stringify(medicines));
            renderMedicines();
        }
    }

    // Push Notifications
    function sendNotifications() {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        medicines.forEach((med) => {
            if (currentHour === med.hour && currentMinute === med.minute) {
                alert(`Reminder to take your medicine "${med.name}" at ${String(currentHour).padStart(2, "0")}:${String(currentMinute).padStart(2, "0")}.`);
            }
        });
    }

    // Event Listeners
    addMedicineBtn.addEventListener("click", () => {
        document.getElementById("modalTitle").textContent = "Add Medicine";
        delete medicineForm.dataset.editIndex;
        medicineForm.reset();
        // Default values for new entries
        medicineTimeHourInput.value = 12; // Default hour
        medicineTimeMinuteInput.value = 0; // Default minute
        medicineModal.style.display = "block";
    });

    closeModal.addEventListener("click", () => (medicineModal.style.display = "none"));

    window.onclick = function (event) {
        if (event.target === medicineModal) medicineModal.style.display = "none";
    };

    medicineForm.addEventListener("submit", saveMedicine);

    // Initialize App
    renderMedicines();

    // Periodically check for notifications and reset status
    setInterval(() => {
        sendNotifications();
        resetTakenStatus();
    }, 60000); // Check every minute
});
