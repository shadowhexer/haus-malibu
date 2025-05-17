let rooms = [];

function displayRooms() {
    fetch(window.location.origin + '/haus-malibu/api/retrieve_rooms.php')
        .then(response => response.json())
        .then(data => {
            rooms = data.rooms; // Access the rooms array from the response
            renderRooms(); // Move the rendering here to ensure data is loaded
        })
        .catch(err => {
            console.log('Error: ' + err.message);
        });
}

function renderRooms() {
    const list = document.getElementById("room-list");
    list.innerHTML = '';


    rooms.forEach(room => {

        const section1 = document.createElement('section');
        section1.className = 'booking-form';

        const div1 = document.createElement('div');
        div1.className = 'card mb-3';

        const div2 = document.createElement('div');
        div2.className = 'row g-0';

        const div3 = document.createElement('div');
        div3.className = 'col-md-4';

        const img = document.createElement('img');
        img.src = room.image;
        img.className = 'img-fluid';
        img.alt = '...';
        div3.appendChild(img);
        div2.appendChild(div3);

        const div4 = document.createElement('div');
        div4.className = 'col-md-8';

        const div5 = document.createElement('div');
        div5.className = 'card-body';
        div5.style.display = 'flex';
        div5.style.flexDirection = 'column';
        div5.style.justifyContent = 'space-between';

        const section2 = document.createElement('section');
        section2.className = 'description';
        section2.style.display = 'flex';
        section2.style.alignItems = 'flex-start';
        section2.style.justifyContent = 'space-between';
        section2.style.marginLeft = '10px';

        const div6 = document.createElement('div');
        div6.style.flexGrow = '1';
        div6.style.marginRight = '20px';

        const div7 = document.createElement('div');
        const roomTitle = document.createElement('p');
        roomTitle.className = 'room-title';
        roomTitle.style.fontSize = '20px';
        roomTitle.style.fontWeight = 'bolder';
        roomTitle.style.color = '#4CAF50';
        roomTitle.textContent = room.name;
        div7.appendChild(roomTitle);

        const hr1 = document.createElement('hr');
        div7.appendChild(hr1);
        div6.appendChild(div7);

        const roomDetails = document.createElement('p');
        roomDetails.className = 'card-text';
        roomDetails.style.fontSize = '12px';
        roomDetails.style.fontWeight = 'lighter';
        roomDetails.style.color = 'gray';
        roomDetails.innerHTML = `
            Type: ${room.type} <br>
            Bed: ${room.number_of_beds} <br>
            Occupancy: ${room.bed_capacity} <br>
            Size: ${room.bed_size} sqm<br>
        `;
        div6.appendChild(roomDetails);
        section2.appendChild(div6);

        const div8 = document.createElement('div');
        div8.style.flexGrow = '1';

        const roomAmenitiesTitle = document.createElement('p');
        roomAmenitiesTitle.className = 'card-text';
        roomAmenitiesTitle.style.fontSize = '15px';
        roomAmenitiesTitle.style.fontWeight = 'bold';
        roomAmenitiesTitle.style.color = 'gray';
        roomAmenitiesTitle.style.marginLeft = '10px';
        roomAmenitiesTitle.textContent = 'Room Amenities';
        div8.appendChild(roomAmenitiesTitle);

        const roomAmenities = document.createElement('p');
        roomAmenities.className = 'card-text';
        roomAmenities.style.fontSize = '12px';
        roomAmenities.style.fontWeight = 'lighter';
        roomAmenities.style.color = 'gray';
        roomAmenities.style.columns = '2';
        roomAmenities.style.webkitColumns = '2';
        roomAmenities.style.mozColumns = '2';
        roomAmenities.style.marginLeft = '10px';
        roomAmenities.innerHTML = `
            ${room.description} <br>
        `;
        div8.appendChild(roomAmenities);
        section2.appendChild(div8);
        div5.appendChild(section2);

        const hr2 = document.createElement('hr');
        hr2.style.marginLeft = '10px';
        div5.appendChild(hr2);

        const div9 = document.createElement('div');
        div9.style.display = 'flex';
        div9.style.alignItems = 'center';
        div9.style.justifyContent = 'space-between';
        div9.style.marginLeft = '10px';

        const div10 = document.createElement('div');
        div10.style.textAlign = 'left';

        const price = document.createElement('strong');
        price.style.fontSize = '1.5rem';
        price.style.marginBottom = '-10px';
        price.innerHTML = `₱ ${room.price} <span style="font-size: 12px; font-weight: lighter; color: gray">/ night</span>`;
        div10.appendChild(price);
        div9.appendChild(div10);
        if (room.status === 1) {
            const unavailableText = document.createElement('p');
            unavailableText.style.color = 'red';
            unavailableText.style.textDecoration = 'line-through';
            unavailableText.style.align = 'start';
            unavailableText.textContent = 'Not Available';
            div9.appendChild(unavailableText);

            const hiddenButton = document.createElement('button');
            hiddenButton.style.marginTop = '0';
            hiddenButton.style.visibility = 'hidden';
            hiddenButton.textContent = 'BOOK NOW';

            div9.appendChild(hiddenButton);
        } else {
            const availableText = document.createElement('p');
            availableText.style.color = '#45a049';
            availableText.textContent = 'Available';
            div9.appendChild(availableText);

            const bookButton = document.createElement('button');
            bookButton.type = 'button';
            bookButton.textContent = 'BOOK NOW';
            bookButton.style.marginTop = '0';
            bookButton.onclick = () => {
                window.location.href = `guestinfo.html?id=${room.id}`;
            };
            div9.appendChild(bookButton);
        }

        div5.appendChild(div9);
        const amenities = document.createElement('div');
        amenities.className = 'amenities';
        amenities.style.justifyContent = 'flex-start';
        amenities.style.marginLeft = '10px';
        amenities.innerHTML = `
            <i class="fas fa-wifi"></i>
            <i class="fas fa-coffee"></i>
            <i class="fas fa-car"></i>
        `;
        div5.appendChild(amenities);
        div4.appendChild(div5);
        div2.appendChild(div4);
        div1.appendChild(div2);
        section1.appendChild(div1);
        list.appendChild(section1);


/* Equivalent code using template literals */

    //     list.innerHTML += `
    //     <section class="booking-form">
    //     <div class="card mb-3">
    //         <div class="row g-0">
    //             <div class="col-md-4">
    //                 <img src="${room.image}" class="img-fluid" alt="...">
    //             </div>
    //             <div class="col-md-8">
    //                 <div class="card-body" style="display: flex; flex-direction: column; justify-content: space-between;">
    //                     <section class="description" style="display: flex; align-items: flex-start; justify-content: space-between; margin-left: 10px;">
    //                         <div style="flex-grow: 1; margin-right: 20px;">
    //                             <div>
    //                                 <p class="room-title" style="font-size: 20px; font-weight: bolder; color: #4CAF50;">${room.name}</p>
    //                                 <hr>
    //                             </div>
    //                             <p class="card-text" style="font-size: 12px; font-weight: lighter; color: gray;">
    //                                 Type: ${room.type} <br>
    //                                 Bed: ${room.number_of_beds} <br>
    //                                 Occupancy: ${room.bed_capacity} <br>
    //                                 Size: ${room.bed_size} sqm<br>
    //                             </p>
    //                         </div>
    //                         <div style="flex-grow: 1;">
    //                             <p class="card-text" style="font-size: 15px; font-weight: bold; color: gray; margin-left: 10px;">Room Amenities</p>
    //                             <p class="card-text" style="font-size: 12px; font-weight: lighter; color: gray; columns: 2; -webkit-columns: 2; -moz-columns: 2; margin-left: 10px;">
    //                                 ${room.description} <br>
    //                             </p>
    //                         </div>
    //                     </section>
    //                     <hr style="margin-left: 10px;">
    //                     <div style="display: flex; align-items: center; justify-content: space-between; margin-left: 10px;">
    //                         <div style="text-align: left;">
    //                             <strong style="font-size: 1.5rem; margin-bottom: -10px;">₱ ${room.price} <span style="font-size: 12px; font-weight: lighter; color: gray">/ night</span></strong>
    //                         </div>
    //                         ${room.status === 1 ? `
    //                         <p style="color: red; text-decoration: line-through; align: start">Not Available</p>
    //                         <button style="margin-top: 0; visibility: hidden;">BOOK NOW</button>` 
    //                         : 
    //                         `<p style="color: #45a049;">Available</p>
    //                         <button type="button" onClick="window.location.href='guestinfo.html?id=${room.id}'" style="margin-top: 0;">BOOK NOW</button>`}
    //                     </div>
    //                     <div class="amenities" style="justify-content: flex-start; margin-left: 10px;">
    //                         <i class="fas fa-wifi"></i>
    //                         <i class="fas fa-coffee"></i>
    //                         <i class="fas fa-car"></i>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // </section>`;
    });
}

// Add this line to automatically run displayRooms when the page loads
document.addEventListener('DOMContentLoaded', displayRooms);
