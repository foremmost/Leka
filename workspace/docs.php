<?php session_start();
 ?><!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="icon" type="image/png" href="img/favicon.png">
    <title data-word="1">G-Engine - Документация</title>
    <link rel="stylesheet" property="stylesheet" href="css/main.css"/>
  </head>
  <body>
    <core>
      <div class="docs">
        <h1 class="page-title">Документация G-Engine v0.1</h1>
        <div class="docs-module">
          <h2 class="docs-title">Общее описание системы</h2>
          <hr>
          <div class="docs-module-body">
            <div class="docs-module-left">
              <h4><a href="#">Структура папок</a></h4>
              <h4><a href="#">Основные компоненты</a></h4>
              <h4><a href="#">Общее описание</a></h4>
            </div>
            <div class="docs-module-right">
              <div class="docs-module-event">
                <div class="docs-module-event-desc">
                  <h3 class="docs-module-event-title">Общее описание</h3>
                  <hr>
                  <p>
                    Система базируется на паттерне проектирования MVC<br> и PubSub вместо Observer
                    Есть главный загрузочный файл boot.js - он подлючается к index.php
                    
                  </p>
                </div>
              </div>
              <div class="docs-module-event">
                <div class="docs-module-event-desc">
                  <h3 class="docs-module-event-title">Структура папок</h3>
                  <hr>
                  <p>Ядро системы находится в папке /workspace/</p>
                  <hr>
                  <h4>Папка workspace <br></h4>
                  <p>
                    /css - Стили системы<br>
                    /img - Иконки системы<br>
                    /front - Компоненты и библиотеки системы
                  </p>
                  <hr>
                  <h4>Папка front <br></h4>
                  <p>
                    /components - JS Компоненты системы<br>
                    /core - PHP ядро системы<br>
                    /libs - Библиотеки JS<br>
                    /boot.js - Инициализация системы
                  </p>
                </div>
              </div>
              <div class="docs-module-event">
                <div class="docs-module-event-desc">
                  <h3 class="docs-module-event-title">Основные компопенты</h3>
                  <hr>
                  <h4> /workspace/front/main</h4>
                  <hr>
                  <p>
                    /Module.js - Сборочный файл для подключения вида контроллера и данных в компонент<br>
                    /Ctrl.js - Контроллер компонента<br>
                    /View.js - Вид компонента<br>
                    /Model.js - Данные компонента<br>
                  </p>
                  <hr>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="docs-module">
          <h2 class="docs-title">Модуль родитель</h2>
          <hr>
          <div class="docs-module-body">
            <div class="docs-module-left">
              <h4><a href="#">Модуль</a></h4>
              <h4><a href="#">Вид</a></h4>
              <h4><a href="#">Контроллер</a></h4>
              <h4><a href="#">Модель</a></h4>
            </div>
            <div class="docs-module-right">
              <div class="docs-module-event">
                <h3 class="docs-module-event-title">Модуль</h3>
                <div class="docs-module-event-desc">
                  <h4>Свойства</h4>
                  <h4>Методы</h4>
                  <ul>
                    <li><strong>remove</strong><span> - Удаление данных после отключения модуля</span></li>
                    <li><strong>init</strong><span> - Инициализация модуля</span></li>
                  </ul>
                </div>
              </div>
              <div class="docs-module-event">
                <h3 class="docs-module-event-title">Вид</h3>
                <div class="docs-module-event-desc">
                  <h4>События триггера:</h4>
                  <ul></ul>
                  <h4>Свойства</h4>
                  <ul>
                    <li><strong>this.actions</strong><span>- Объект со поля которого это название действие, а значение массив действий н-р<code>this.actions['click'] = ['prevPage','goPage','nextPage'];</code></span></li>
                  </ul>
                  <h4>Методы</h4>
                  <ul>
                    <li><strong>triggerWithEvent(eventData,currentAction)</strong><span> - Обработка события, которое не имеет возможности всплытия<br>
    <i>eventData</i> - Объект с 2умя полями item и event<br>
    <i>item</i> - Элемент на котором было совершено действие<br>
    <i>event</i> - Информация о событии
</span></li>
                    <li><strong>init</strong><span> - Инициализация модуля</span></li>
                    <li><strong>clearBody(cont) *</strong><span> - Очистка контейнера page-body на странице</span></li>
                    <li><strong>clearCont(cont)</strong><span> - Очистка любого контейнера<br>
      <i>cont</i> - Контейнер который надо очистить
    </span></li>
                    <li><strong>getDataAttr(elem,dataName)</strong><span> - <br>
        <i>elem</i>  - HTML элемент с которого надо считать атрибут<br>
        <i>dataName</i> - Название атрибута, которое надо считать
    </span></li>
                    <li><strong>makeId</strong><span> - Создание уникального идентификатора</span></li>
                    <li><strong>createEl(elemName,className,params)</strong><span> - </span></li>
                    <li><strong>createTpl(tpl,tplName="")</strong><span> - Создание шаблона по определённому объекту<br>
      <i>tpl</i> - Шаблон пример: <br>
      <code>
           <b>let tpl = {</b>
              <b data-tab="1">el: document.createDocumentFragment(),</b>
              <b>childes:[</b>
                <b>{</b>
                  <b>el: _.createEl('DIV','test',{"data-id":1})</b>
                <b>}</b>
              <b>]</b>
           <b>}</b>
      </code>
    <i>tplName</i> - уникальное имя шаблона
    </span></li>
                    <li><strong>setDataAttr(elem,dataName,dataValue="")</strong><span> -
        Присвоение атрибута HTML элементу<br>
        <i>elem</i>  - HTML  элемент, которому надо присвоить новый data атрибут<br>
        <i>dataName</i> - Название data атрибута<br>
        <i>dataValue</i> - Значение data атрибута, по умолчанию пустая строка
    </span></li>
                    <li><strong>updateEl(elem,className,params)</strong><span> -
        Обновление уже существующего HTML элемента<br>
        <i>elem</i>  - HTML  элемент, у которого надо поменять контент и атрибуты<br>
        <i>className</i> - Новое значение свойства class<br>
        <i>params</i> - Различные атрибуты, которые надо добавить элементу
    </span></li>
                    <li><strong>loadPagination(paginationData)</strong><span> -
        Заполнение пагинации на странице<br>
        <i>paginationData</i> - Объект с 2-умя полями<br>
        cnt  - какую страницу надо отобразить<br>
        tableClass  - для какой таблицы отобразить пагинацию<br>
        perPage - количество элементов на странице
    </span></li>
                    <li><strong>tableRowsTpl(itemsData)</strong><span> -
        Заполнение контента таблицы<br>
        <i>itemsData</i> - Объект с 2-умя и более полями<br>
        page  - какую страницу надо отобразить<br>
        [items]  - строки которые надо отрисовать<br>
        tableClass  - для какой таблицы отрисовать строки<br>
        type  - Тип отрисовки строк
          main='Общий вид',search = 'Строки поиска',filter = 'Отфильтрованные строки'<br>
    </span></li>
                    <li><strong>tableTpl(pageData = {})</strong><span> -
        Шаблон таблицы
    </span></li>
                    <li><strong>tableRowTpl</strong><span> -
        Шаблон строки таблицы
    </span></li>
                    <li><strong>formTpl</strong><span> - Шаблон формы</span></li>
                    <li><strong>paginationTpl(paginationData,pages)</strong><span> -
        Шаблон пагинации<br>
        <i>paginationData</i> - Объект с 1-им полем<br>
        pages = число страниц, по отработанному запросу
    </span></li>
                  </ul>
                </div>
              </div>
              <div class="docs-module-event">
                <h3 class="docs-module-event-title">Контроллер</h3>
                <div class="docs-module-event-desc">
                  <h4>События триггера:</h4>
                  <ul></ul>
                  <h4>Свойства</h4>
                  <ul>
                    <li><strong>this.actions</strong><span>- Объект со поля которого это название действие, а значение массив действий н-р<code>this.actions['click'] = ['prevPage','goPage','nextPage'];</code></span></li>
                    <li><strong>this.container</strong><span>- Ссылка на главный HTML контейнер системы (&lt;core>&lt;/core>)</span></li>
                    <li><strong>this.view</strong><span>- Ссылка на вид текущего компонента</span></li>
                    <li><strong>this.model</strong><span>- Ссылка на модель текущего компонента</span></li>
                  </ul>
                  <h4>Методы</h4>
                  <ul>
                    <li><strong>triggerWithEvent(eventData,currentAction)</strong><span> - Обработка события, которое не имеет возможности всплытия<br>
                            <i>eventData</i> - Объект с 2умя полями item и event<br>
                            <i>item</i> - Элемент на котором было совершено действие<br>
                            <i>event</i> - Информация о событии
                        </span></li>
                    <li><strong>clickHandler</strong><span> - Обработчик кликов<br>
     <i>e</i> - Объект события
</span></li>
                    <li><strong>focusOutHandler</strong><span> - Обработчик потери фокуса<br>
         <i>e</i> - Объект события
    </span></li>
                    <li><strong>changeHandler</strong><span> - Обработчик смены значение в элементах формы<br>
    <i>e</i> - Объект события</span></li>
                    <li><strong>inputHandler</strong><span> - Обработчик ввода данных<br>
    <i>e</i> - Объект события
                                    </span></li>
                    <li><strong>keyUpHandler</strong><span> - Обработчик отпускания клавишы после нажатия<br>
    <i>e</i> - Объект события
                                    </span></li>
                    <li><strong>submitHandler</strong><span> - Обработчик отправки формы<br>
    <i>e</i> - Объект события
                                    </span></li>
                    <li><strong>scrollHandler</strong><span> - Обработчик прокрутки элемента<br>
    <i>e</i> - Объект события
                                    </span></li>
                    <li><strong>overHandler</strong><span> - Обработчик наведения на элемент<br>
                                         <i>e</i> - Объект события
                                    </span></li>
                    <li><strong>outHandler</strong><span> - Обработчик ухода мышы с элемента<br>
    <i>e</i> - Объект события
                                    </span></li>
                    <li><strong>handle</strong><span> - Собирает все обработчики в одну функцию  </span></li>
                  </ul>
                </div>
              </div>
              <div class="docs-module-event">
                <h3 class="docs-module-event-title">Модель</h3>
                <div class="docs-module-event-desc">
                  <h4>События триггера:</h4>
                  <ul></ul>
                  <h4>Свойства</h4>
                  <ul>
                    <li><strong>this.xhr</strong><span>- Объект для работы с AJAX запросами</span></li>
                    <li><strong>this.dirPath</strong><span>- Путь до папки компонентов</span></li>
                  </ul>
                  <h4>Методы</h4>
                  <ul>
                    <li><strong>handler(data,method = "GET")</strong><span> - Общий обработчик всех обращений к бд<br>
    <i>data</i> - Объект с 3умя обязательными полями componentName и method<br>
    componentName - Указывает имя модуля к которому обращаться в базе<br>
    method - Имя файл обработки текущего действия
    <i>method</i> - Тип запроса к серверу GET,POST,JSON<br>
                                                </span></li>
                    <li><strong>fileUpload(path,fileName,file)</strong><span> -Загрузка файла на сервер<br>
         <i>path</i> - Путь куда загружать
         <i>fileName</i> - Имя файла, которое будет на сервере
         <i>file</i> - Файл, который надо загрузить
    </span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="docs-module">
          <h2 class="docs-title">Модуль User</h2>
          <hr>
          <div class="docs-module-body">
            <div class="docs-module-left">
              <h4><a href="#">Модуль</a></h4>
              <h4><a href="#">Вид</a></h4>
              <h4><a href="#">Контроллер</a></h4>
              <h4><a href="#">Модель</a></h4>
            </div>
            <div class="docs-module-right">
              <div class="docs-module-event">
                <h3 class="docs-module-event-title">Модуль</h3>
                <div class="docs-module-event-desc">
                  <h4>Свойства</h4>
                </div>
              </div>
              <div class="docs-module-event">
                <h3 class="docs-module-event-title">Вид</h3>
                <div class="docs-module-event-desc">
                  <h4>События подписки:</h4>
                  <ul>
                    <li><strong>User: showMoreInfo</strong><span></span></li>
                    <li><strong>User: loadTableBody</strong><span></span></li>
                    <li><strong>User: loadName</strong><span></span></li>
                    <li><strong>User: showForm</strong><span></span></li>
                    <li><strong>User: backToTable</strong><span></span></li>
                  </ul>
                  <h4>События триггера:
                    <ul>
                      <li><strong>User: getName</strong><span></span></li>
                      <li><strong>Languager: loadTranslate</strong><span></span></li>
                      <li><strong>User: getRows</strong></li>
                    </ul>
                  </h4>
                  <h4>Свойства</h4>
                  <ul>
                    <li><strong>modulePage</strong><span>- Родная страница модуля</span></li>
                    <li><strong>moreShowed</strong><span>- Показан / скрыт профиль пользователя</span></li>
                    <li><strong>componentName</strong><span>- Название компонента</span></li>
                  </ul>
                  <h4>Методы</h4>
                  <ul>
                    <li><strong>showMoreInfo -</strong><span>Показывает профиль пользователя</span></li>
                    <li><strong>loadName -</strong><span>Загружает имя пользователя из БД</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="docs-module">
          <h2 class="docs-title">Модуль Logs</h2>
          <hr>
          <div class="docs-module-body">
            <div class="docs-module-left">
              <h4><a href="#log-module">Модуль</a></h4>
              <h4><a href="#log-view">Вид</a></h4>
              <h4><a href="#log-ctrl">Контроллер</a></h4>
              <h4><a href="#log-model">Модель</a></h4>
            </div>
            <div class="docs-module-right">
              <div class="docs-module-event">
                <h3 class="docs-module-event-title" id="log-module">Модуль</h3>
                <div class="docs-module-event-desc">
                  <h4>События подписки:</h4>
                  <ul>
                    <li><strong>Model: getSetting</strong><span></span></li>
                  </ul>
                  <h4>Свойства:</h4>
                  <ul>
                    <li><strong>componentName</strong><span>- Название модуля</span></li>
                  </ul>
                </div>
              </div>
              <div class="docs-module-event">
                <h3 class="docs-module-event-title" id="log-view">Вид</h3>
                <div class="docs-module-event-desc">
                  <h4>События подписки:</h4>
                  <ul>
                    <li><strong>View: showPopup</strong><span></span></li>
                    <li><strong>View: pauseToLog</strong><span></span></li>
                    <li><strong>View: continueToLog</strong><span></span></li>
                    <li><strong>View: closeLog</strong><span></span></li>
                    <li><strong>View: closeLogByBtn</strong><span></span></li>
                    <li><strong>View: loadTableBody</strong><span></span></li>
                    <li><strong>View: loadTablePagination</strong><span></span></li>
                  </ul>
                  <h4>События триггера:</h4>
                  <ul>
                    <li><strong>View: closeLog</strong></li>
                    <li><strong>View: continueToLog</strong></li>
                  </ul>
                  <h4>Свойства:</h4>
                  <ul>
                    <li><strong>modulePage</strong><span> - Родная страница модуля</span></li>
                    <li><strong>componentName</strong><span> - Название модуля</span></li>
                    <li><strong>top</strong><span></span></li>
                    <li><strong>offsetTop</strong><span></span></li>
                    <li><strong>times</strong><span></span></li>
                    <li><strong>negativeOffset</strong><span></span></li>
                    <li><strong>timeToAnim</strong><span> - Время анимации</span></li>
                  </ul>
                  <h4>Методы:</h4>
                  <ul>
                    <li><strong>doOffset</strong><span> - Сдвигает поп-ап окна вниз</span></li>
                    <li><strong>closePopup</strong><span> - Закрывает и удаляет поп-ап окно</span></li>
                    <li><strong>pauseToLog</strong><span> - Останавливает удаление поп-ап окон при наведении на окно</span></li>
                    <li><strong>continueToLog</strong><span> - Запускает удаление поп-ап окон по времени при уберании курсора с окна</span></li>
                    <li><strong>hasPrevPopup</strong><span> - Проверяет есть ли предыдущий поп-ап</span></li>
                    <li><strong>getPrevPopup</strong><span> - Возвращает предыдущий поп-ап</span></li>
                    <li><strong>closeByButton</strong><span> - Запускает удаление поп-ап окна по кнопке</span></li>
                    <li><strong>beginToClose</strong><span> - Запускает удаление поп-ап окна</span></li>
                    <li><strong>showPopup</strong><span> - Управляет методами вида</span></li>
                  </ul>
                </div>
              </div>
              <div class="docs-module-event">
                <h3 class="docs-module-event-title" id="log-ctrl">Контроллер</h3>
                <div class="docs-module-event-desc">
                  <h4>События подписки:</h4>
                  <ul>
                    <li><strong>Ctrl: showLog</strong><span></span></li>
                    <li><strong>Ctrl: getRows</strong><span></span></li>
                    <li><strong>Ctrl: deleteLog</strong><span></span></li>
                    <li><strong>Ctrl: getPagesCnt</strong><span></span></li>
                  </ul>
                  <h4>События триггера:</h4>
                  <ul>
                    <li><strong>View: showPopup</strong><span>- Добавляет доп данные к логу( звук, статус, временную метку</span></li>
                    <li><strong>Model: saveLog</strong><span>- Сохраняет лог в базу</span></li>
                  </ul>
                  <h4>Свойства:</h4>
                  <ul>
                    <li><strong>componentName</strong><span> - Название модуля</span></li>
                  </ul>
                  <h4>Методы:</h4>
                  <ul>
                    <li><strong>showLog</strong><span> - Добавляет доп данные к логу( звук, статус, временную метку)</span></li>
                    <li><strong>getPagesCnt</strong><span></span></li>
                  </ul>
                </div>
              </div>
              <div class="docs-module-event">
                <h3 class="docs-module-event-title" id="log-model">Модель</h3>
                <div class="docs-module-event-desc">
                  <h4>События подписки:</h4>
                  <ul>
                    <li><strong>Model: saveLog</strong><span></span></li>
                    <li><strong>Settings: sendSetting</strong><span></span></li>
                  </ul>
                  <h4>События триггера:</h4>
                  <ul>
                    <li><strong>Model: setSetting</strong><span></span></li>
                  </ul>
                  <h4>Свойства:</h4>
                  <ul>
                    <li><strong>componentName</strong><span> - Название модуля</span></li>
                  </ul>
                  <h4>Методы:</h4>
                  <ul>
                    <li><strong>acceptSettings</strong><span> - Принимает настройки, если они есть или заливает на сервер, если их нет</span></li>
                    <li><strong>saveLog</strong><span> - Сохраняет логи на сервере</span></li>
                    <li><strong>getTableItems</strong><span> - Запрашивает сохраненные в local Storage логи</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <core-foot></core-foot>
    </core>
    <script src="front/boot.js" type="module"></script>
  </body>
</html>