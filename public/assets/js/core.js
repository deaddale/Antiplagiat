(function(){
	
    // Отключение правой кнопки мыши : начало
    var message=""; 
    function clickIE() {
        if (document.all) {
            (message);
            return false;
        }
    }

    function clickNS(e) {
        if (document.layers||(document.getElementById&&!document.all)) { 
            if (e.which==2||e.which==3) {
                (message);
                return false;
            }
        }
    }

    if (document.layers) {
        document.captureEvents(Event.MOUSEDOWN);
        document.onmousedown=clickNS;
    } else {
        document.onmouseup=clickNS;
        document.oncontextmenu=clickIE;
    }
    // Отключение правой кнопки мыши : конец

    // Отключение контекстного меню, перетаскивания, выбора объекта, вызова контекстного меню, копирования документа, нажатия клавиш Ctrl+U, Ctrl+C, Ctrl+A
    function returnFalse() { return false }

    document.oncontextmenu = new Function("return false");
    document.ondragstart   = returnFalse; 
    document.onselectstart = returnFalse; 
    document.ontextmenu    = returnFalse; 
    document.oncopy        = returnFalse;
    document.onkeypress    = catchControlKeys;

    // Отлавливает и выключает сочетания горячих клавиш
    function catchControlKeys(event){
        var code=event.keyCode ? event.keyCode : event.which ? event.which : null;
        if (event.ctrlKey){
            // Ctrl + U
            if (code == 117) return false;
            if (code == 85) return false;
            // Ctrl + C
            if (code == 99) return false;
            if (code == 67) return false;
            // Ctrl + A
            if (code == 97) return false;
            if (code == 65) return false;

            if (code == 91) return false;
        }
    }
    
    // Вспомогательная функция установки обработчика события
    function addHandler(event, handler){
        if (document.attachEvent) {
            document.attachEvent('on' + event, handler);
        }
        else if (document.addEventListener) {
            document.addEventListener(event, handler, false);
        }
    }
     
    // Вспомогательная функция принудительного снятия выделения
    function killSelection(){
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
        }
        else if (document.selection && document.selection.clear) {
          document.selection.clear();
        }
    }
     
    // Функция обработчика нажатия клавиш
    function noSelectionEvent(event) {
        var event = event || window.event;
     
        // При нажатии на Ctrl + A и Ctrl + U убрать выделение
        // и подавить всплытие события
        var key = event.keyCode || event.which;
        if (event.ctrlKey && (key == 65 || key == 85)) {
            killSelection();
            if (event.preventDefault) { event.preventDefault(); }
            else { event.returnValue = false; }
            return false;
        }
    }
         
    // Установить обработчики клавиатуры
    addHandler('keydown', noSelectionEvent);
    addHandler('keyup', noSelectionEvent);

    // Предотвращаем выбор
    function preventSelection(element){
        var preventSelection = false;

        function addHandler(element, event, handler){
            if (element.attachEvent) 
                element.attachEvent('on' + event, handler);
            else 
                if (element.addEventListener) 
                    element.addEventListener(event, handler, false);
        }
        function removeSelection(){
            if (window.getSelection) { window.getSelection().removeAllRanges(); }
            else if (document.selection && document.selection.clear)
            document.selection.clear();
        }

        // Отслеживаем и убиваем событие Ctrl + A
        function killCtrlA(event){
            var event = event || window.event;
            var sender = event.target || event.srcElement;

            if (sender.tagName.match(/INPUT|TEXTAREA/i))
            return;

            var key = event.keyCode || event.which;
            if (event.ctrlKey && key == 65) { // или 65 можно заменить на 'A'.charCodeAt(0)
            removeSelection();

            if (event.preventDefault) 
                event.preventDefault();
            else
                event.returnValue = false;
            }
        }

        // Не даем выделять текст мышкой
        addHandler(element, 'mousemove', function(){
            if(preventSelection)
                removeSelection();
        });
        addHandler(element, 'mousedown', function(event){
            var event = event || window.event;
            var sender = event.target || event.srcElement;
            preventSelection = !sender.tagName.match(/INPUT|TEXTAREA/i);
        });

        /*
        Останавливаем dblclick
        Если вешать функцию не на событие dblclick, можно избежать
        временное выделение текста в некоторых браузерах
        */
        addHandler(element, 'mouseup', function(){
            if (preventSelection)
                removeSelection();
            preventSelection = false;
        });

        /*
        Останавливаем Ctrl + A
        Скорей всего это и не надо, к тому же есть подозрение
        Что в случае все же такой необходимости функцию нужно 
        Вешать один раз и на document, а не на элемент
        */
        addHandler(element, 'keydown', killCtrlA);
        addHandler(element, 'keyup', killCtrlA);
    }
})();