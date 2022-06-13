<?php
// var_dump($_FILES);//crea un arreglo asociativo donde se crea toda la informacion del archivo que se sube

if(isset($_FILES["file"])){ 
  // echo "Respuesta desde el servidor isset";
  //se crean variables php para almacenar los datos del archivo
  $name = $_FILES["file"]["name"];
  $file = $_FILES["file"]["tmp_name"];
  $error = $_FILES["file"]["error"];
  $destination = "../archivos/$name";
  $upload = move_uploaded_file($file, $destination); //devuelve boolean
  
  if($upload){
    $res = array(
      "err" => false,
      "status" => http_response_code(200),
      "statusText" => "Archivo $name subido con éxito",
      "files" => $_FILES["file"]
    );
  }else{
    $res = array(
      "err" => true,
      "status" => http_response_code(400),
      "statusText" => "Errorsuco al subir el archivo $name",
      "files" => $_FILES["file"]
    );
  }

  echo json_encode($res);
}