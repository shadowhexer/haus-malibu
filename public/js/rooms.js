let rooms = [];

function displayRooms() {
    fetch('/api/retrieve_rooms')
        .then(response => response.json())
        .then(data => {
            rooms = data.rooms; // Access the rooms array from the response
            console.log(rooms); // Log the rooms array to check its contents
            renderRooms(); // Move the rendering here to ensure data is loaded
        })
        .catch(err => {
            console.log('Error: ' + err.message);
        });
}

function renderRooms() {
    const list = document.getElementById("room-list");
    list.innerHTML = '';
    rooms.forEach(room => { // Changed 'r' to 'room' for clarity
        list.innerHTML += `
        <section class="booking-form">
        <div class="card mb-3">
            <div class="row g-0">
                <div class="col-md-4">
                    <img src="images/bedroom.jpeg" class="img-fluid" alt="...">
                </div>
                <div class="col-md-8">
                    <div class="card-body" style="display: flex; flex-direction: column; justify-content: space-between;">
                        <section class="description" style="display: flex; align-items: flex-start; justify-content: space-between; margin-left: 10px;">
                            <div style="flex-grow: 1; margin-right: 20px;">
                                <div>
                                    <p class="room-title" style="font-size: 20px; font-weight: bolder; color: #4CAF50;">${room.name}</p>
                                    <hr>
                                </div>
                                <p class="card-text" style="font-size: 12px; font-weight: lighter; color: gray;">
                                    Type: ${room.type} <br>
                                    Bed: ${room.number_of_beds} <br>
                                    Occupancy: ${room.bed_capacity} <br>
                                    Size: ${room.bed_size} sqm<br>
                                </p>
                            </div>
                            <div style="flex-grow: 1;">
                                <p class="card-text" style="font-size: 15px; font-weight: bold; color: gray; margin-left: 10px;">Room Amenities</p>
                                <p class="card-text" style="font-size: 12px; font-weight: lighter; color: gray; columns: 2; -webkit-columns: 2; -moz-columns: 2; margin-left: 10px;">
                                    ${room.description} <br>
                                </p>
                            </div>
                        </section>
                        <hr style="margin-left: 10px;">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-left: 10px;">
                            <div style="text-align: left;">
                                <strong style="font-size: 1.5rem; margin-bottom: -10px;">₱ ${room.price} <span style="font-size: 12px; font-weight: lighter; color: gray">/ night</span></strong>
                            </div>
                            ${room.status === 1 ? `
                            <p style="color: red; text-decoration: line-through; align: start">Not Available</p>
                            <button style="margin-top: 0; visibility: hidden;">BOOK NOW</button>` 
                            : 
                            `<p style="color: #45a049;">Available</p>
                            <button type="button" onClick="window.location.href='guestinfo.html?id=${room.id}'" style="margin-top: 0;">BOOK NOW</button>`}
                        </div>
                        <div class="amenities" style="justify-content: flex-start; margin-left: 10px;">
                            <i class="fas fa-wifi"></i>
                            <i class="fas fa-coffee"></i>
                            <i class="fas fa-car"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>`;
    });
}

// Add this line to automatically run displayRooms when the page loads
document.addEventListener('DOMContentLoaded', displayRooms);
