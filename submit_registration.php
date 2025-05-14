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
    $fullname = $_POST["fullname"];
    $email = $_POST["email"];
    $password = $_POST["password"];
    $gender = $_POST["gender"];
    $birthday = $_POST["birthday"];
    $address = $_POST["address"];
    $contact = $_POST["contact"];

    // Check if email or name already exists
    $checkExist = $conn->prepare("SELECT * FROM `credentials` WHERE email = :email");
    $checkExist->bindParam(':email', $email);

    if ($checkExist->execute()) {
        if ($checkExist->rowCount() > 0) {
            // Optional: get more specific if you want
            $row = $checkExist->fetch(PDO::FETCH_ASSOC);
            if ($row['email'] === $email) {
                echo "<script>alert('Email already exists!'); window.location.href='sign-in.html';</script>";
            } 
            exit;
        }
    } else {
        echo "<script>alert('Error checking credentials.'); window.location.href='sign-in.html';</script>";
        exit;
    }

    // File upload handling
    if (isset($_FILES["attachment"]) && $_FILES["attachment"]["error"] == 0) {
        $uploadDir = "uploads/";

        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $fileName = basename($_FILES["attachment"]["name"]);
        $targetFile = $uploadDir . time() . "_" . preg_replace("/[^A-Za-z0-9_.]/", "", $fileName); // Avoid overwrites and sanitize
        $fileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));

        // Allowed file types
        $allowedTypes = ["pdf", "doc", "docx", "jpg", "jpeg", "png"];
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($finfo, $_FILES["attachment"]["tmp_name"]);
        finfo_close($finfo);

        $allowedMimeTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "image/jpg",
            "image/jpg"
        ];

        if (!in_array($fileType, $allowedTypes) || !in_array($mimeType, $allowedMimeTypes)) {
            die("<script>alert('Sorry, only PDF, DOC, DOCX, JPG, & JPEG files are allowed.');</script>");
        }

        if (move_uploaded_file($_FILES["attachment"]["tmp_name"], $targetFile)) {
            // Hash the password
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);

            // Prepare and bind (with attachment_path now included)
            $stmt = $conn->prepare("INSERT INTO `credentials` (`fullname`, `email`, `password`, `gender`, `birthday`, `address`, `contact`, `attachment_path`) 
                                    VALUES (:fullname, :email, :password, :gender, :birthday, :address, :contact, :attachment_path)");

            $stmt->bindParam(':fullname', $fullname);
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':password', $hashed_password);
            $stmt->bindParam(':gender', $gender);
            $stmt->bindParam(':birthday', $birthday);
            $stmt->bindParam(':address', $address);
            $stmt->bindParam(':contact', $contact);
            $stmt->bindParam(':attachment_path', $targetFile);

            try {
                if ($stmt->execute()) {
                    echo "<script>alert('Account created!'); window.location.href='login.html';</script>";
                } else {
                    $error = $stmt->errorInfo();
                    echo "<script>alert('Error creating account.');</script>";
                }
            } catch (PDOException $e) {
                echo "<script>alert('Database error.'); window.location.href='sign-in.html';</script>";
            }
        } else {
            echo "<script>alert('Failed to upload file.'); window.location.href='sign-in.html';</script>";
        }
    } else {
        $errorCode = $_FILES["attachment"]["error"];
        echo "<script>alert('No file uploaded or there was an error.'); window.location.href='sign-in.html';</script>";
    }    
}

$conn = null;
?>
