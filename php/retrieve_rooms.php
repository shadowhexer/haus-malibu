<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Import database.php to continue the connection
require_once 'database.php';
if (!$conn) {
    die("<script>alert('Database connection failed!');</script>");
}

try {
    $stmt = $conn->prepare("SELECT * FROM rooms");
    $status = $conn->query("SELECT r.* FROM rooms r WHERE EXISTS (SELECT 1 FROM occupied o WHERE o.room_id = r.id)")->rowCount();
    $stmt->execute();
    $rooms = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($rooms) {
        $response = [
            'rooms' => $rooms,
            'status' => ($status == 0) ? 0 : 1
        ];
        echo json_encode($response);
    } else {
        echo json_encode(['rooms' => [], 'status' => 0]); // No rooms found
    }
} catch (PDOException $e) {
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
$conn = null;

?>