<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Import database.php to continue the connection
require_once 'database.php';
if (!$conn) {
    die("Database connection failed!");
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST["room-name"];
    $type = $_POST["room-type"];
    $beds = $_POST["beds"];
    $capacity = $_POST["capacity"];
    $size = $_POST["bed-size"];
    $price = $_POST["price"];

    $stmt = $conn->prepare("DELETE FROM `rooms` WHERE `name` = :name AND `type` = :type AND `number_of_beds` = :beds 
                           AND `bed_capacity` = :capacity AND `bed_size` = :size AND `price` = :price");

    $deleteStmt = $conn->prepare("DELETE FROM `occupied` WHERE `room_id` = (SELECT `id` FROM `rooms` WHERE `name` = :name AND `type` = :type AND `number_of_beds` = :beds 
                           AND `bed_capacity` = :capacity AND `bed_size` = :size AND `price` = :price)");

    $stmt->bindParam(':name', $name, PDO::PARAM_STR);
    $stmt->bindParam(':type', $type, PDO::PARAM_STR);
    $stmt->bindParam(':beds', $beds, PDO::PARAM_INT);
    $stmt->bindParam(':capacity', $capacity, PDO::PARAM_INT);
    $stmt->bindParam(':size', $size, PDO::PARAM_STR);
    $stmt->bindParam(':price', $price, PDO::PARAM_STR);

    try {
        if ($stmt->execute() && $deleteStmt->execute()) {
            echo json_encode([
                'status' => 'success',
                'message' => 'Successfully deleted a room!'
            ]);
        } else {
            $error = $stmt->errorInfo();
            echo json_encode([
                'status' => 'error',
                'message' => 'Error deleting a room: ' . implode(', ', $error)
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