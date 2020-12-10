<?php session_start();
 ?><!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="icon" type="image/png" href="img/favicon.png">
    <title data-word="1">G-Engine - </title>
    <link rel="stylesheet" property="stylesheet" href="css/main.css"/>
  </head>
  <body>
    <core><?php if(isset($_SESSION['group_id'])) {
  include_once 'system.php';
}else{
  include_once 'author.php';
} ?>
      <core-foot></core-foot>
    </core>
    <script src="front/boot.js" type="module"></script>
  </body>
</html>