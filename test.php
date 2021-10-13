<?
if (isset($_POST['type']) and  isset($_POST['phone'])  ) {

    $type =  htmlspecialchars(strip_tags(trim($_POST['type'])));
    $phone =  htmlspecialchars(strip_tags(trim($_POST['phone'])));

    if (get_magic_quotes_gpc()) {
        $type = stripcslashes($type);
        $phone = stripcslashes($phone);
    }

    $arResponse['from-post'] = $_POST;


    $to      = 'anar.n.agaev@gmail.com';
    $subject = 'Результаты отправки данных Квиза';
    $message = 'Результаты отправки данных тестового задания:' . "\r\n";
    $message .= 'тип: ' . $type . "\r\n";
    $message .= 'телефон: ' . $phone . "\r\n\n";
    $message .= 'Задание выполнил: Агаев Анар';
    $headers = 'From: anar.n.agaev@gmail.com' . "\r\n" .
        'Reply-To: anar.n.agaev@gmail.com' . "\r\n" .
        'X-Mailer: PHP/' . phpversion();

    $send_res = mail($to, $subject, $message, $headers);


    $arResponse['send-result'] = $send_res;


    $JSON__DATA = defined('JSON_UNESCAPED_UNICODE')
        ? json_encode($arResponse, JSON_UNESCAPED_UNICODE)
        : json_encode($arResponse);
    echo $JSON__DATA;
}