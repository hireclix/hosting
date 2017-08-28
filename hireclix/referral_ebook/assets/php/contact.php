<?php 
/* ------------------------------------------------------------------ */


$to      = "email@domain.com";              // add your email address


/* ------------------------------------------------------------------ */

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $name    = check_input($_POST['name2']);
    $email   = check_input($_POST['email2']);
    $subject   = check_input($_POST['subject2']);
    $message = check_input($_POST['message2']);
    $human   = check_input($_POST['human2']);

    if (empty($human)) {
        $headers  = "From: " . $to . "\r\n";
        $headers .= "Reply-To: ". $email . "\r\n";
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";

        $body = "<html><body>";
        $body .= "<h1>" . $subject . "</h1>";
        $body .= "<p><strong>Name: </strong>" . $name . "</p>";
        $body .= "<p><strong>E-mail: </strong>" . $email . "</p>";
        $body .= "<p>" . strip_tags($message) . "</p>";
        $body .= "</body></html>";

        if (!empty($to) && !empty($subject) && !empty($name) && !empty($email) && filter_var($email, FILTER_VALIDATE_EMAIL) && !empty($message)) {
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