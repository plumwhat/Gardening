let clients = JSON.parse(localStorage.getItem('clients')) || [];
let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
let currentDate = new Date();

function saveClients() {
    localStorage.setItem('clients', JSON.stringify(clients));
}

function saveAppointments() {
    localStorage.setItem('appointments', JSON.stringify(appointments));
}

function addClient() {
    const name = document.getElementById('clientName').value;
    const address = document.getElementById('clientAddress').value;
    const contact = document.getElementById('clientContact').value;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': address }, function(results, status) {
        if (status === 'OK' && results[0]) {
            const validatedAddress = results[0].formatted_address;
            clients.push({ id: Date.now(), name, address: validatedAddress, contact });
            saveClients();
            updateClientOptions();
            displayClientList();
        } else {
            alert('Address validation failed. Using entered address.');
            clients.push({ id: Date.now(), name, address, contact });
            saveClients();
            updateClientOptions();
            displayClientList();
        }
    });
}

function addAppointment() {
    const clientID = parseInt(document.getElementById('appointmentClient').value);
    const date = document.getElementById('appointmentDate').value;
    const time = document.getElementById('appointmentTime').value;
    const duration = parseInt(document.getElementById('appointmentDuration').value);
    const description = document.getElementById('appointmentDescription').value;
    appointments.push({ id: Date.now(), clientID, date, time, duration, description });
    saveAppointments();
    displayAppointments();
    displayCalendar();
}

function updateClientOptions() {
    const select = document.getElementById('appointmentClient');
    select.innerHTML = '';
    clients.forEach(client => {
        const option = document.createElement('option');
        option.value = client.id;
        option.textContent = client.name;
        select.appendChild(option);
    });
}

function displayAppointments() {
    const list = document.getElementById('appointmentList');
    list.innerHTML = '';
    const searchName = document.getElementById('searchName').value.toLowerCase();
    appointments.forEach(appointment => {
        const client = clients.find(c => c.id === appointment.clientID);
        if (client && client.name.toLowerCase().includes(searchName)) {
            const appointmentDiv = document.createElement('div');
            appointmentDiv.innerHTML = `
                <strong>${client.name}</strong>: ${appointment.date} ${appointment.time} - ${appointment.duration} min - ${appointment.description}
                <button onclick="deleteAppointment(${appointment.id})">Delete</button>
            `;
            list.appendChild(appointmentDiv);
        }
    });
}

function deleteAppointment(id) {
    appointments = appointments.filter(a => a.id !== id);
    saveAppointments();
    displayAppointments();
    displayCalendar();
}

function displayCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    calendarGrid.innerHTML = '';
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    document.getElementById('calendarMonth').textContent = monthNames[currentDate.getMonth()] + ' ' + currentDate.getFullYear();

    let dayCounter = 1;
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 7; j++) {
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('calendarDay');
            if (i === 0 && j < firstDay) {
                dayDiv.textContent = '';
            } else if (dayCounter <= daysInMonth) {
                dayDiv.textContent = dayCounter;
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayCounter);
                const appointmentsForDay = appointments.filter(appointment => {
                    const appointmentDate = new Date(appointment.date);
                    return appointmentDate.getDate() === date.getDate() &&
                        appointmentDate.getMonth() === date.getMonth() &&
                        appointmentDate.getFullYear() === date.getFullYear();
                });
                if (appointmentsForDay.length > 0) {
                    dayDiv.classList.add('hasAppointments');
                    appointmentsForDay.forEach(appointment => {
                        const client = clients.find(c => c.id === appointment.clientID);
                        if (client) {
                            dayDiv.innerHTML += `<br>${client.name} ${appointment.time} ${appointment.duration}min`;
                        }
                    });
                }
                dayCounter++;
            }
            calendarGrid.appendChild(dayDiv);
        }
        if (dayCounter > daysInMonth) break;
    }
}

function prevMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    displayCalendar();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    displayCalendar();
}

function displayClientList() {
    const clientList = document.getElementById('clientList');
    clientList.innerHTML = '';
    clients.forEach(client => {
        const clientDiv = document.createElement('div');
        clientDiv.innerHTML = `
            ${client.name} - ${client.address} - ${client.contact}
            <button onclick="updateClient(${client.id})">Update</button>
            <button onclick="deleteClient(${client.id})">Delete</button>
        `;
        clientList.appendChild(clientDiv);
    });
}

function updateClient(id) {
    const client = clients.find(c => c.id === id);
    if (client) {
        const name = prompt("Enter new name:", client.name);
        const address = prompt("Enter new address:", client.address);
        const contact = prompt("Enter new contact:", client.contact);
        if (name && address && contact) {
            client.name = name;
            client.address = address;
            client.contact = contact;
            saveClients();
            updateClientOptions();
            displayClientList();
        }
    }
}

function deleteClient(id) {
    clients = clients.filter(c => c.id !== id);
    saveClients();
    updateClientOptions();
    displayClientList();
}

updateClientOptions();
displayAppointments();
displayCalendar();
displayClientList();
