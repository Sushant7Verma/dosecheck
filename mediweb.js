document.addEventListener("DOMContentLoaded", () => {
    const medicineTable = document.getElementById("medicineList");
    const addMedicineBtn = document.getElementById("addMedicineBtn");
    const medicineModal = document.getElementById("medicineModal");
    const closeModal = document.querySelector(".close");
    const medicineForm = document.getElementById("medicineForm");
    const medicineNameInput = document.getElementById("medicineName");
    const medicineTimeHourInput = document.getElementById("medicineTimeHour");
    const medicineTimeMinuteInput = document.getElementById("medicineTimeMinute");

    // Preloaded medicines
    let medicines = [
        { name: "CAP NINTENA 150MG", hour: 8, minute: 0, taken: false },
        { name: "CAP NINTENA 150MG", hour: 20, minute: 0, taken: false },
        { name: "SEROFLO INHALER", hour: 8, minute: 0, taken: false },
        { name: "SEROFLO INHALER", hour: 20, minute: 0, taken: false },
        { name: "TAB MOFGEN 500MG", hour: 8, minute: 0, taken: false },
        { name: "TAB MOFGEN 500MG", hour: 20, minute: 0, taken: false },
        { name: "TAB LIMCEE 500MG", hour: 8, minute: 0, taken: false },
        { name: "LIQ TOSSEX NEW", hour: null, minute: null, taken: false },
        { name: "CAP BENZ 100MG", hour: null, minute: null, taken: false },
    ];

    // Request notification permission
    async function requestNotificationPermission() {
        if (!("Notification" in window)) {
            alert("This browser does not support notifications.");
            return;
        }

        if (Notification.permission === "default") {
            await Notification.requestPermission();
        }
    }

    // Render medicines in the table
    function renderMedicines() {
        medicineTable.innerHTML = "";
        medicines.forEach((med, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${med.name}</td>
                <td>${med.hour !== null ? `${String(med.hour).padStart(2, '0')}:${String(med.minute).padStart(2, '0')}` : 'PRN/SOS'}</td>
                <td>${med.taken ? "Taken" : "Not Taken"}</td>
                <td><button onclick="editMedicine(${index})">Edit</button> 
                    <button onclick="deleteMedicine(${index})">Delete</button> 
                    <button onclick="toggleTaken(${index})">${med.taken ? "Untick" : "Tick"}</button></td>`;
            medicineTable.appendChild(row);
        });
    }

    // Add or edit a medicine
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
            renderMedicines();
            closeModal.click();
        }
    }

    // Edit a medicine
    window.editMedicine = function (index) {
        const med = medicines[index];
        medicineNameInput.value = med.name;
        medicineTimeHourInput.value = med.hour;
        medicineTimeMinuteInput.value = med.minute;
        medicineForm.dataset.editIndex = index.toString();
        document.getElementById("modalTitle").textContent = "Edit Medicine";
        medicineModal.style.display = "block";
    };

    // Delete a medicine
    window.deleteMedicine = function (index) {
        medicines.splice(index, 1);
        renderMedicines();
    };

    // Toggle status of a medicine
    window.toggleTaken = function (index) {
        medicines[index].taken = !medicines[index].taken;
        renderMedicines();
    };

    // Check for notifications at scheduled times
    setInterval(() => {
        const now = new Date();
        medicines.forEach((med) => {
            if (
                med.hour !== null &&
                med.minute !== null &&
                now.getHours() === med.hour &&
                now.getMinutes() === med.minute &&
                !med.taken
            ) {
                new Notification(`Reminder`, {
                    body: `It's time to take ${med.name}.`,
                    icon: "/icon.png",
                });
            }
        });
        
        // Reset status at 2 AM
        if (now.getHours() === 2 && now.getMinutes() === 0) {
            medicines.forEach((med) => (med.taken = false));
            renderMedicines();
        }
    }, 60000);

    addMedicineBtn.addEventListener("click", () => {
        document.getElementById("modalTitle").textContent = "Add Medicine";
        delete medicineForm.dataset.editIndex;
        medicineForm.reset();
        medicineModal.style.display = "block";
    });

    closeModal.addEventListener("click", () => (medicineModal.style.display = "none"));
    
    medicineForm.addEventListener("submit", saveMedicine);

    requestNotificationPermission();
    
    renderMedicines();
});
