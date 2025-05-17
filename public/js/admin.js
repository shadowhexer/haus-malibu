let booking = [], news = [];

function checkBooking(event) {
    const form = document.getElementById('book_form');
    const formData = new FormData(form);

    fetch('/api/retrieve_booking', {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === "error") {
                alert("Error: " + data.message);
                return;
            }
            if (data.result.status === 0) data.result.status = 'Pending';
            else if (data.result.status === 1) data.result.status = 'Accepted';
            else if (data.result.status === 2) data.result.status = 'Declined';
            booking = data.result
            displayBookings();
        })
        .catch(err => {
            console.log('Error: ' + err.message);
        })
        .finally(() => {
            document.getElementById("book-id").value = '';
        });
}

function displayBookings() {
    const list = document.getElementById("bookingList");
    list.innerHTML = '';

    let color = booking.status === "Accepted" ? "green" :
        booking.status === "Declined" ? "red" : "orange";
    list.innerHTML += `
        <li class="booking-item" data-id="${booking.book_id}">
          <div>
            <strong>Book ID:</strong> ${booking.book_id}<br>
            <strong>Room:</strong> ${booking.room_name}<br>
            <strong>Name:</strong> ${booking.first_name} ${booking.last_name}<br>
            <strong>Check-in:</strong> ${booking.check_in}<br>
            <strong>Check-out:</strong> ${booking.check_out}<br>
            <strong>Booking Time:</strong> ${booking.date}<br>
            <strong>Status:</strong> <span id="status-${booking.status}" style="color: ${color}; font-weight: bold;">${booking.status}</span>
          </div>
          ${booking.status === "Pending" ? `
          <div class="booking-actions">
            <button class="accept-btn" onclick="modifyBooking('${booking.book_id}', '1')">Accept</button>
            <button class="decline-btn" onclick="modifyBooking('${booking.book_id}', '2')">Decline</button>
          </div>
          ` : ''}
        </li>`;
};


function modifyBooking(id, bookStatus) {

    fetch('/api/modify_booking', {
        method: 'POST',
        body: JSON.stringify({ book_id: id, status: bookStatus }),
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            window.location.href = 'admin.html'
        })
        .catch(err => {
            console.log('Error: ' + err.message);
        })
}

function addRoom() {
    const form = document.getElementById('room-form');
    const formData = new FormData(form);

    fetch('api/add_rooms', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            alert(data.message);
        } else {
            alert("Error: " + data.message);
        }
    })
    .catch(err => {
        console.log(err.message);
    })
    .finally(() => {
        document.getElementById("room-name").value = '';
        document.getElementById("room-type").value = '';
        document.getElementById("beds").value = '';
        document.getElementById("capacity").value = '';
        document.getElementById("bed-size").value = '';
        document.getElementById("price").value = '';
        document.getElementById("desc").value = '';
    });

    //   if (name && desc && image) {
    //     const reader = new FileReader();
    //     reader.onload = () => {
    //       rooms.push({ id: Date.now(), name, desc, image: reader.result });
    //       displayRooms();
    //     };
    //     reader.readAsDataURL(image);
    //   }
}

function deleteRoom() {
    const form = document.getElementById('delete-form');
    const formData = new FormData(form);

    fetch('api/delete_rooms', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            alert(data.message);
        } else {
            alert("Error: " + data.message);
        }
    })
    .catch(err => {
        console.log(err.message);
    })
    .finally(() => {
        document.getElementById("room-name").value = '';
        document.getElementById("room-type").value = '';
        document.getElementById("beds").value = '';
        document.getElementById("capacity").value = '';
        document.getElementById("bed-size").value = '';
        document.getElementById("price").value = '';
    });
}

function addNews() {

    const form = document.getElementById('news-form');
    const formData = new FormData(form);
    const formObject = Object.fromEntries(formData.entries());

    let img;

    const imageInput = document.getElementById('image');
    
    if (imageInput && imageInput.files.length > 0) {
        const reader = new FileReader();
        reader.onloadend = (event) => {
            console.log({ image: event.target.result });
            formObject.image = event.target.result;
        };
        reader.readAsDataURL(imageInput.files[0]);
    }

    fetch('api/news?action=add-news', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formObject)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            alert(data.message);
            window.location.href = 'admin.html';
        } else {
            alert("Error: " + data.message);
        }
    })
    .catch(err => {
        console.log(err.message);
    })
    .finally(() => {
        document.getElementById('title').style.display = '';
        document.getElementById('content').style.display = '';
        document.getElementById('image').style.display = '';
        document.getElementById('image-alt').style.display = '';
    })
}

// function displayNews() {
//     const list = document.getElementById("newsList");
//     list.innerHTML = '';
//     news.forEach(n => {
//         list.innerHTML += `
//         <li class="news-item">
//           <div>
//             <strong>${n.title}</strong><br>
//             ${n.content}<br>
//             <img src="${n.image}" alt="News image">
//           </div>
//           <div class="news-actions">
//             <button class="edit-btn">Edit</button>
//             <button class="delete-btn">Delete</button>
//           </div>
//         </li>`;
//     });
// }