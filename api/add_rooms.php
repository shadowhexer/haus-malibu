<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Import database.php to continue the connection
require_once 'database.php';
if (!$conn) {
    die("Database connection failed!");
}

function uploadImage($base64_image, $conn) {

    // Validate base64 image data
    if (empty($base64_image)) {
        throw new \Exception('Empty image data');
    }

    // Extract mime type from base64 string
    if (preg_match('/^data:(image\/\w+);base64,/', $base64_image, $matches)) {
        $mime = $matches[1];
    } else {
        throw new \Exception('Invalid image format');
    }

    $allowed = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
    if (!in_array($mime, $allowed)) {
        throw new \Exception('Disallowed image type');
    }
    
    $imageData = preg_replace('#^data:image/\w+;base64,#i', '', $base64_image);

    // Decode base64 data
    $image_data = base64_decode($imageData);
    
    if ($image_data === false) {
        throw new \Exception('Base64 decode failed');
    }

    $extMap = [
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/gif' => 'gif',
        'image/webp' => 'webp'
    ];
    $extension = $extMap[$mime] ?? 'bin';
    
    // Create unique filename
    $target_dir = "images/";
    if (!file_exists($target_dir)) {
        mkdir($target_dir, 0777, true);
    }
    $filename = uniqid() . '.' . $extension;
    $target_file = $target_dir . $filename;
    
    // Save the file
    if (!file_put_contents($target_file, $image_data)) {
        throw new \Exception('Failed to save image');
    }

    // Generate the full URL for the image
    $file_url = dirname($_SERVER['PHP_SELF']) . '/' . $target_file;

    return $file_url;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $data = json_decode(file_get_contents("php://input"), true);
    if ($data === null) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid JSON data']);
    }
    if (!isset($data['image'])) {
        throw new \Exception('No image data provided');
    }
    
    $url = uploadImage($data['image'], $conn);

    $stmt = $conn->prepare("INSERT INTO `rooms` (`name`, `type`, `number_of_beds`, `bed_capacity`, `bed_size`, `price`, `description`, `image`) 
                            VALUES (:name, :type, :beds, :capacity, :size, :price, :description, :image);");

    $stmt->bindParam(':name', $data['room-name'], PDO::PARAM_STR);
    $stmt->bindParam(':type', $data['room-type'], PDO::PARAM_STR);
    $stmt->bindParam(':beds', $data['beds'], PDO::PARAM_INT);
    $stmt->bindParam(':capacity', $data['capacity'], PDO::PARAM_INT);
    $stmt->bindParam(':size', $data['bed-size'], PDO::PARAM_STR);
    $stmt->bindParam(':price', $data['price'], PDO::PARAM_STR);
    $stmt->bindParam(':description', $data['desc'], PDO::PARAM_STR);
    $stmt->bindParam(':image', $url, PDO::PARAM_STR);

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