<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Import database.php to continue the connection
require_once 'database.php';
if (!$conn) {
    die("<script>alert('Database connection failed!');</script>");
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Kuhaa ang tanan input values
    $firstname = $_POST["first_name"];
    $lastname = $_POST["last_name"];
    $email = $_POST["email"];
    $contact = $_POST["phone"];
    $address = $_POST["address"];
    $city = $_POST["city"];
    $country = $_POST["country"];
    $special_requests = $_POST["special_requests"];

    $id = bin2hex(random_bytes(10 / 2));

    $stmt = $conn->prepare("INSERT INTO `bookings` (`book_id`, `first_name`, `last_name`, `email`, `contact`, `address`, `city`, `country`, `special_requests`) 
                            VALUES (:id, :firstname, :lastname, :email, :contact, :address, :city, :country, :special_requests)");

    $stmt->bindParam(':id', $id, PDO::PARAM_STR);
    $stmt->bindParam(':firstname', $firstname);
    $stmt->bindParam(':lastname', $lastname);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':contact', $contact);
    $stmt->bindParam(':address', $address);
    $stmt->bindParam(':city', $city);
    $stmt->bindParam(':country', $country);
    $stmt->bindParam(':special_requests', $special_requests);

    try {
        if ($stmt->execute()) {
            echo "<script>alert('Booking submitted!'); window.location.href='rooms.html';</script>";
        } else {
            $error = $stmt->errorInfo();
            echo "<script>alert('Error submiting booking.');</script>";
        }
    } catch (PDOException $e) {
        echo "<script>alert('Database error: $e'); window.location.href='rooms.html';</script>";
    }
}

$conn = null;
?>
