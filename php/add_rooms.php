<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Import database.php to continue the connection
require_once 'database.php';
if (!$conn) {
    die("<script>alert('Database connection failed!');</script>");
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST["room-name"];
    $type = $_POST["room-type"];
    $beds = $_POST["beds"];
    $capacity = $_POST["capacity"];
    $size = $_POST["bed-size"];
    $price = $_POST["price"];
    $description = $_POST["desc"];

    $stmt = $conn->prepare("INSERT INTO `rooms` (`name`, `type`, `number_of_beds`, `bed_capacity`, `bed_size`, `price`, `description`) 
                            VALUES (:name, :type, :beds, :capacity, :size, :price, :description)");

    $stmt->bindParam(':name', $name, PDO::PARAM_STR);
    $stmt->bindParam(':type', $type, PDO::PARAM_STR);
    $stmt->bindParam(':beds', $beds, PDO::PARAM_INT);
    $stmt->bindParam(':capacity', $capacity, PDO::PARAM_INT);
    $stmt->bindParam(':size', $size, PDO::PARAM_STR);
    $stmt->bindParam(':price', $price, PDO::PARAM_STR);
    $stmt->bindParam(':description', $description, PDO::PARAM_STR);

    try {
        if ($stmt->execute()) {
            echo json_encode([
                'status' => 'success',
                'message' => 'Successfully added a room!'
            ]);
        } else {
            $error = $stmt->errorInfo();
            echo json_encode([
                'status' => 'error',
                'message' => 'Error adding a room: ' . implode(', ', $error)
            ]);
        }
    } catch (PDOException $e) {
        echo json_encode(['message' => 'Database Error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['message' => 'Invalid request or missing data']);
}

$conn = null;

?>