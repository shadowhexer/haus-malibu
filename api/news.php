<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Import database.php to continue the connection
require_once 'database.php';
if (!$conn) {
    die("Database connection failed!");
}
header('Content-Type: application/json');


function addNews($data, $conn) {
    $stmt = $conn->prepare("INSERT INTO news (`title`, `content`, `image`, `image_alt`) VALUES (:title, :content, :image, :image_alt)");

    $stmt->bindParam(':title', $data['title'], PDO::PARAM_STR);
    $stmt->bindParam(':content', $data['content'], PDO::PARAM_STR);
    $stmt->bindParam(':image', $data['image']['name'], PDO::PARAM_STR);
    $stmt->bindParam(':image_alt', $data['image-alt'], PDO::PARAM_STR);

    return $stmt->execute();
}

function getNews($conn) {
    $stmt = $conn->query("SELECT * FROM news");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

$action = $_GET['action'] ?? $_POST['action'] ?? 'get-news';

switch ($action) {
    case 'add-news':
        $data = json_decode(file_get_contents("php://input"), true);
        if ($data === null) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Invalid JSON data']);
            break;
        }
        $result = addNews($data, $conn);
        if ($result) {
            echo json_encode(['status' => 'success', 'message' => 'News uploaded successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Failed to add news']);
        }
        break;

    case 'get-news':
        $news = getNews($conn);
        if ($news) {
            echo json_encode(['status' => 'success', 'news' => $news]);
        } else {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'No news found']);
        }
        break;

    default:
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
        break;
}
$conn = null; // Close the connection

?>