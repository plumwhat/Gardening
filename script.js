let clients = JSON.parse(localStorage.getItem('clients')) || [];
let appointments = JSON.parse(localStorage.getItem('appointments')) || [];

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
    clients.push({ id: Date.now(), name, address, contact });
    saveClients();
    updateClientOptions();
    displayClientList();
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
    appointments.forEach(appointment => {
        const client = clients.find(c => c.id === appointment.clientID);
        if (client) {
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
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('calendarDay');
        dayDiv.textContent = i;
        const appointmentsForDay = appointments.filter(appointment => {
            const appointmentDate = new Date(appointment.date);
            return appointmentDate.getDate() === i && appointmentDate.getMonth() === today.getMonth() && appointmentDate.getFullYear() === today.getFullYear();
        });
        if (appointmentsForDay.length > 0) {
            appointmentsForDay.forEach(appointment => {
                const client = clients.find(c => c.id === appointment.clientID);
                if(client){
                    dayDiv.innerHTML += `<br>${client.name} ${appointment.time} ${appointment.duration}min`;
                }
            })
        }
        calendarGrid.appendChild(dayDiv);
    }
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