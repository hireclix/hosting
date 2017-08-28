<?php 
/* ------------------------------------------------------------------ */


$to      = "email@domain.com";              // add your email address
$subject = "Message from contact form";     // the subject of emails


/* ------------------------------------------------------------------ */

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $name    = check_input($_POST['name']);
    $email   = check_input($_POST['email']);
    $phone   = check_input($_POST['phone']);
    $message = check_input($_POST['message']);
    $human   = check_input($_POST['human']);

    if (empty($human)) {
        $headers  = "From: " . $to . "\r\n";
        $headers .= "Reply-To: ". $email . "\r\n";
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";

        $body = "<html><body>";
        $body .= "<h1>" . $subject . "</h1>";
        $body .= "<p><strong>Name: </strong>" . $name . "</p>";
        $body .= "<p><strong>E-mail: </strong>" . $email . "</p>";
        $body .= "<p><strong>Phone: </strong>" . $phone . "</p>";        
        $body .= "<p>" . strip_tags($message) . "</p>";
        $body .= "</body></html>";

        if (!empty($to) && !empty($subject) && !empty($name) && !empty($email) && !empty($phone) && filter_var($email, FILTER_VALIDATE_EMAIL) && !empty($message)) {
            mail($to, $subject, $body, $headers);
            echo("success");
        }
    } else { echo("success"); }
}

function check_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    $data = strip_tags($data);
    return $data;
}
?>