let loginData = JSON.parse(localStorage.getItem("adminData"));

fetch(`http://localhost:8080/safar/reservation/all?key=${loginData.aid}`)
  .then(response => response.json())
  .then(data => {
    console.log(data);
    
    data.forEach(element => {
        document.querySelector(".UserData").innerHTML += `
        <tr>
            <td class="column1">${element.reservationID}</td>
            <td class="column2">${element.source}</td>
            <td class="column3">${element.destination}</td>
            <td class="column3">${element.status}</td>
            <td class="column4">${element.journeyDate}</td>
            <td class="column5">${element.bookingDate}</td> <!-- Updated for booking date -->
            <td class="column6">${element.totalSeats}</td> <!-- Updated for total seats -->
            <td class="column7">₹${element.totalFare}</td> <!-- Updated for total fare -->
            <td class="column8">
                <i class="fi fi-rs-trash" onclick="deleteReservation(${element.reservationID})"></i>
            </td>
        </tr>
        `;
    });
  })
  .catch(error => {
    console.log('Error:', error);
  });

// Function to delete reservation (to be defined based on your backend logic)
function deleteReservation(reservationID) {
    // Add your delete logic here, e.g., make a DELETE request to your API
    fetch(`http://localhost:8080/safar/reservation/delete/${reservationID}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        // Refresh the reservation list after deletion
        location.reload();
    })
    .catch(error => {
        console.error('Error deleting reservation:', error);
    });
}
