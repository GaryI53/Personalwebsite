<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';
require 'config.php';


$mail = new PHPMailer(true);

$mail->SMTPDebug = 2; // or 3 for super verbose
$mail->Debugoutput = 'html'; // makes it readable in browser


try {
    // Server settings
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = MAIL_USERNAME;
    $mail->Password   = MAIL_PASSWORD;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;
    

    // Recipients
    $mail->setFrom('garyisherwood1991@gmail.com', 'Gary Isherwood');
    $mail->addAddress('garyisherwood1991@gmail.com', 'Gary Isherwood'); // Send to yourself

    // Optional: Reply-To from the form submitter
    if (!empty($_POST['email'])) {
        $mail->addReplyTo($_POST['email'], $_POST['name'] ?? '');
    }

    // Content
    $mail->isHTML(true);
    $mail->Subject = 'Message from portfolio';
    $mail->Body    =
        'Name: ' . htmlspecialchars($_POST['name'] ?? '') . '<br>' .
        'Company: ' . htmlspecialchars($_POST['company'] ?? '') . '<br>' .
        'Email: ' . htmlspecialchars($_POST['email'] ?? '') . '<br>' .
        'Enquiry: ' . nl2br(htmlspecialchars($_POST['enquiry'] ?? ''));

    $mail->send();
    header('Location: https://gisherwood.com/thanks.html');
    exit;
} catch (Exception $e) {
    echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
}
?>
