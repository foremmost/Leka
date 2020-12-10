<?php session_start();
 ?><!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="icon" type="image/png" href="img/favicon.png">
    <title data-word="1">G-Engine - Переводы</title>
    <link rel="stylesheet" property="stylesheet" href="css/main.css"/>
  </head>
  <body>
    <core>
      <core-body class="core-in">
        <core-menu></core-menu>
        <core-head></core-head>
        <core-content>
          <div class="page-head">
            <!--h1.page-title(data-word='15')-->
            <!--.page-action-->
            <!--	button.btn(data-click-action="Languager:showForm")-->
            <!--		span(data-word='13')
            //button.btn.active
            	span Назад
            -->
          </div>
          <div class="page-body"></div>
          <!--.page-form
          .page-form-left
          	.page-search
          		.page-inpt
          			input(type='text' placeholder='Поиск')
          			button.page-btn
          				+img('search.svg')
          	ul.page-list
          		-for(let i=0;i < 5;i++)
          			li
          				button(type='button') Аuthorization
          			li
          				button(type='button') Login
          			li
          				button(type='button') Password
          			li
          				button(type='button') Wrong login
          	.page-pagination
          		button.page-btn
          			+img('prev.svg')
          		strong 1
          		input(type='text' pattern='[0-9]' value='1')
          		strong 10
          		button.page-btn
          			+img('next.svg')
          .page-form-right
          	h2.page-subtitle Добавление фразы
          	form.page-form-body
          		.page-text
          			span Фраза
          			textarea()
          		.page-inpt
          			span Тип
          			select
          				option(value='sys') Системная
          				option(value='site') Сайт
          		.page-do
          			button.btn.btn-large Сохранить
          -->
          <!--.page-filter
          .lang-select
          	.page-inpt
          		span Выбор языка
          		select
          			//option Выберите язык
          			option(value='ru') Русский
          .page-search
          	.page-inpt
          		input(type='text' placeholder='Поиск')
          		button.page-btn
          			+img('search.svg')
          -->
          <!--table.page-table
          thead
          	th
          		input(type='checkbox' id='allElems')
          		label(for='allElems')
          	th ID
          	th Фраза
          	th Перевод
          	th Тип
          	th #
          tbody
          	tr
          		td
          			input(type='checkbox' id='1')
          			label(for='1')
          		td 1
          		td Authorization
          		td
          			textarea.inpt
          		td sys
          		td
          			.page-table-actions
          				button.page-btn
          					+img('plus.svg')
          -->
        </core-content>
      </core-body>
      <core-foot></core-foot>
    </core>
    <script src="front/boot.js" type="module"></script>
  </body>
</html>