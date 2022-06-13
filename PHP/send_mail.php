<?php
  if(isset($_POST)){
    error_reporting(0);
    $name = $_POST["nombre"];//Los nombres que se les dio a los formularios en el HTML
    $email = $_POST["email"];
    $subject = $_POST["asunto"];
    $comments = $_POST["comentarios"];

    $domain = $_SERVER["HTTP_HOST"]; //Obtiene el dominio el cual se ejecuta la página
    $to = "j@gmail.com";
    $subject = "Contacto desde el formulario del sitio $domain: $subject";
    $message = "
    <p>
      Datos enviados desde el formulario del sitio <b>$domain</b>
    </p>
    <ul>
      <li>Nombre: <b>$name</b></li>
      <li>Email: <b>$email</b></li>
      <li>Asunto: $subject</li>
      <li>Comentarios: $comments</li>
    </ul>
    ";
    $headers = "MIME-Version: 1.0\r\n"."Content-type: text/html; charset=utf8\r\n"."From: Envío Automático no responder <no-repply@$domain>";

    $send_mail = mail($to, $subject, $message, $headers);

    if($send_mail){
      $res = [
        "err" => false,
        "message" => "Tus datos han sido enviados"
      ];
    }else{
            $res = [
        "err" => true,
        "message" => "Error al enviar los datos, intenta nuevamente"
      ];
    }
    header("Access-Control-Allow-Origin: *");//* Puede recibir peticiones de cualquier lado
    // header("Access-Control-Allow-Origin: https://jonmircha.com");//* Puede recibir peticiones solo de jonmircha.com

    header("Content-type: application/json");
    echo json_encode($res);
    exit;
  }