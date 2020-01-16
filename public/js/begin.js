"use strict";

function loadInfo(flag){
    var socket = myConnect();
    getUserData(socket, flag);
    return;    
}

function getUserData(socket, flag){
    // проверяет статус файла и если он есть 
    // то запрашивает инфу а на сервере он удаляется
    // а инфу передает на вставку
    // flag =  true черновик иначе оригинал
    socket.emit('getFileStatus', flag);
    socket.on('pushFileStatus', (fileStatus) =>{
        console.log('___________fileStatus______________');
        console.log(fileStatus);
        if (!fileStatus || fileStatus.errno == 0){
            socket.emit('getUserData', flag);
            socket.on('pushUserData', (data) => {
                insertData(data);
                myDisconnect(socket);
            });
        } else {
            alert('file not found');
        }
    });
}

function insertData(data){
// вставка инфы в таблицу
    var uData = JSON.parse(data);
    for (var key in uData){
        if (key != "draftFlag") {
            insertToTable(uData[key]['number'], uData[key]['soderzh'], uData[key]['percent'], uData[key]['time'], uData[key]['result'], false);
        }
    }
}

function myConnect(){
    var socket = io.connect('http://www.test.ru:3001');
    return socket;
}

function myDisconnect(socket){
    socket.disconnect();
};

function getLog (socket){
    socket.on('log', (data) => {
        alert(data.hello);
        myDisconnect(socket);
    });
};
      
function isNotEmpty(task) {
    if (task === "") {
        return false;
    }
    return true;
};
      
function delRow(idRow) {
    // получает ид кнопки, ищет индекс строки и удаляет ее
    var index1 = idRow.parentNode.parentNode.rowIndex;
    document.getElementById("tab1").deleteRow(index1);
};
      
function editRow(idRow) {
    // получает ид кнопки, ищет индекс строки удаляет ее из
    // таблицы и возвращает в форму ввода
    var index1 = idRow.parentNode.parentNode.rowIndex,
        numTask = document.getElementById("tBodyId").rows[index1 - 1].cells[0].innerHTML,
        task = document.getElementById("tBodyId").rows[index1 - 1].cells[1].innerHTML,
        percTask = document.getElementById("tBodyId").rows[index1 - 1].cells[2].innerHTML,
        timeTask = document.getElementById("tBodyId").rows[index1 - 1].cells[3].innerHTML,
        resultTask = document.getElementById("tBodyId").rows[index1 - 1].cells[4].innerHTML,
        // запись значений в поля формы
        fieldNum = document.getElementById("numTask"),
        fieldTask = document.getElementById("txtTask"),
        fieldPerc = document.getElementById("percentTask"),
        fieldTime = document.getElementById("timeTask"),
        fieldResult = document.getElementById("resultTask"),
        fieldFlag = document.getElementById("flagTask");
    document.getElementById("tab1").deleteRow(index1);
    fieldNum.value = numTask;
    fieldTask.value = task;
    fieldPerc.value = percTask;
    fieldTime.value = timeTask;
    fieldResult.value = resultTask;
    // fieldFlag.value = percTask;
    //console.log(index1,task,numTask,percTask,timeTask,resultTask);
};

function moveUP(idRow) {
    // получает ид кнопки, ищет индекс строки перемещает ее на
    // одну позицию вверх в таблице
    var index1 = idRow.parentNode.parentNode.rowIndex,
        tr1,
        tr2;
    //alert (index1);
    if (index1 === 1) {
        alert("Куда выше то?");
        return;
    }
    if (!(tr1 = document.getElementsByTagName('tr')[index1 - 1]) || (!(tr2 = document.getElementsByTagName('tr')[index1])))
        return;
    tr2.parentNode.insertBefore(tr2, tr1);
};

function moveDown(idRow) {
    // получает ид кнопки, ищет индекс строки перемещает ее на
    // одну позицию вниз в таблице
    var index1 = idRow.parentNode.parentNode.rowIndex;
    var tr1, tr2;
    if (!(tr1 = document.getElementsByTagName('tr')[index1+1]) || (!(tr2 = document.getElementsByTagName('tr')[index1])))
        return;
    tr2.parentNode.insertBefore(tr1, tr2);
};

function safeAndSend(draft) {
    // получает стуктурированую информацию
    // и сохраняет в файл на яндекс диск
    var data = getInfo(draft),
        socket = myConnect();
    socket.emit('userData', data);
    getLog(socket);
    return;
};

function getInfo(flag) {
    // добывает информацию из таблицы, стуктурирует 
    // и возвращает JSON объект
    var structTask = {};
    structTask.draftFlag = flag;
    var tabWithInfo = document.getElementById("tBodyId"),
        temp = tabWithInfo.rows.length;
    for (var i = 0; i < tabWithInfo.rows.length; i++) {
        structTask[i] = {};
        structTask[i]["number"] = tabWithInfo.rows[i].cells[0].innerHTML;
        structTask[i]["soderzh"] = tabWithInfo.rows[i].cells[1].innerHTML;
        structTask[i]["percent"] = tabWithInfo.rows[i].cells[2].innerHTML;
        structTask[i]["time"] = tabWithInfo.rows[i].cells[3].innerHTML;
        structTask[i]["result"] = tabWithInfo.rows[i].cells[4].innerHTML;
        //console.log(structTask[i].task);
    }
    return JSON.stringify(structTask);
};

function okFunc() {
    var numTask = document.getElementById("numTask").value;
    var task = document.getElementById("txtTask").value;
    var percTask = document.getElementById("percentTask").value;
    var timeTask = document.getElementById("timeTask").value;
    var resultTask = document.getElementById("resultTask").value;
    var flagTask = document.getElementById("flagTask").value;
    // вставляем значения в таблицу
    insertToTable(numTask, task, percTask, timeTask, resultTask, flagTask);
    return;
};

function insertToTable(numTask, task, percTask, timeTask, resultTask, flagTask){
    // вставляет строчку в таблицу
    // находим нужную таблицу
    var tab1 = document.getElementById("tab1").getElementsByTagName("TBODY")[0];
    if (isNotEmpty(task)) {
        // создаем новую строку и добавляем ее
        var newRow = document.createElement("TR");
        tab1.appendChild(newRow);
        // создаем ячейки в этой строке
        var tdNumTask = document.createElement("TD");
        var tdTask = document.createElement("TD");
        var tdPercTask = document.createElement("TD");
        var tdTimeTask = document.createElement("TD");
        var tdResTask = document.createElement("TD");
        var tdDelTask = document.createElement("TD");
        var tdEditTask = document.createElement("TD");
        newRow.appendChild(tdNumTask);
        newRow.appendChild(tdTask);
        newRow.appendChild(tdPercTask);
        newRow.appendChild(tdTimeTask);
        newRow.appendChild(tdResTask);
        newRow.appendChild(tdDelTask);
        newRow.appendChild(tdEditTask);
        // наполняем их
        tdNumTask.innerHTML = numTask;
        tdTask.innerHTML = task;
        tdPercTask.innerHTML = percTask;
        tdTimeTask.innerHTML = timeTask;
        tdResTask.innerHTML = resultTask;
        // вставляем кнопки
        // кнопка удаления
        var tdDelBtn = document.createElement("INPUT");
        tdDelBtn.type = "button";
        tdDelBtn.value = " Delete ";
        tdDelBtn.setAttribute("onclick", "delRow(this)");
        tdDelTask.appendChild(tdDelBtn);
        // кнопка редактирования
        var tdEditBtn = document.createElement("INPUT");
        tdEditBtn.type = "button";
        tdEditBtn.value = "Edit";
        tdEditBtn.setAttribute("onclick", "editRow(this)");
        tdEditTask.appendChild(tdEditBtn);
        // кнопка перемещения вверх
        var tdMoveUpTaskBtn = document.createElement("INPUT");
        tdMoveUpTaskBtn.type = "button";
        tdMoveUpTaskBtn.value = "Up";
        tdMoveUpTaskBtn.setAttribute("onclick", "moveUP(this)");
        tdEditTask.appendChild(tdMoveUpTaskBtn);
        // кнопка перемещения вниз
        var tdMoveDownTaskBtn = document.createElement("INPUT");
        tdMoveDownTaskBtn.type = "button";
        tdMoveDownTaskBtn.value = "Down";
        tdMoveDownTaskBtn.setAttribute("onclick", "moveDown(this)");
        tdEditTask.appendChild(tdMoveDownTaskBtn);
    } else alert("Ничего не введено!");
}

