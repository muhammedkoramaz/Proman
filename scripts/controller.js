const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;
const app = electron.remote.app
const { ipcMain } = require('electron');
const db = require('electron-db');
const uploadFileBtn = document.getElementById("uploadFileBtn");
const appPath = app.getAppPath();

db.createTable('projects', app.getAppPath(), (succ, msg) => {})
db.createTable('files', app.getAppPath(), (succ, msg) => {})




function selectFiles(activeTab) {
    db.getRows('files', appPath, {
        projectName: activeTab
    }, (succ, data) => {
        console.log("Success: " + succ);
        //Bu fonksiyon data adında bir json array döndürüoyor içinde foreach ile gezip doma bastırıyorum 
        data.forEach((row) => {
            //Alınan pathi stringe çevirip filename çekiyorum
            /*if (filePathString === "") {
                //TODO EĞER FİLEPATH BOŞ İSE YANİ DOSYA EKLENMEDİYSE YAPILACAKLAR:
                var nofilecontent = document.getElementById("no-file-div");
                nofilecontent.style.display = "block";
                var nofile = document.createElement("p");
                nofile.style.color = "red";
                nofile.textContent = "HENÜZ DOSYA EKLEMEDİNİZ!";
                nofilecontent.appendChild(nofile);

            }*/
            //Doma filename bastırıyorum
            console.log(row.fileName)
            createFilesListDom(row.fileName, activeTab);
        });
    })

}

function deleteFile(fileName, projectName) {
    var deleteObject = new Object();
    deleteObject.fileName = fileName;
    deleteObject.projectName = projectName;

    console.log(fileName);
    db.deleteRow('files', appPath, deleteObject, (succ, msg) => {
        document.getElementById(fileName).remove();
        console.log(msg);
    });
}

getData();

function settingsClick() {
    ipcRenderer.send('open-settings')
}

function feedbackClick() {
    ipcRenderer.send('open-feedback')
}

function aboutClick() {
    ipcRenderer.send('open-about')
}

function addProjectBtn() {
    ipcRenderer.send('open-addProjectPopup')
}

ipcRenderer.on('create-project', (err, data) => {
    if (data) {
        console.log(data.name);
        var projectName = data.name;
        var projectDesc = data.desc;
        var currentTime = new Date();
        var dd = String(currentTime.getDate()).padStart(2, '0');
        var mm = String(currentTime.getMonth() + 1).padStart(2, '0');
        var yyyy = currentTime.getFullYear();
        currentTime = dd + '/' + mm + '/' + yyyy;
        insertProject(projectName, projectDesc, currentTime);
        //TODO BURADA KONTROL YAPILACAK EĞER BOŞ İSE DOSYA EKLEMEDİNİZ DİYECEK
        var file = "";
        insertFileTab(projectName, file);
    }

})

function insertProject(projectName, projectDesc, currentTime) {
    let project = new Object();
    project.name = projectName;
    project.desc = projectDesc;
    project.time = currentTime;
    if (db.valid('projects', appPath)) {
        db.insertTableContent('projects', appPath, project, (succ, msg) => {
            if (succ) {
                createProjectDom(projectName, projectDesc, currentTime);
                createFileTabDom(projectName);
            }
        })
    }
}

//DÜZENLEEEE
//Bu iki insert garip oluyor teke indirilebilir galiba domlarda aynı şekilde 
function insertFileTab(projectName, file) {
    var pathString = String(file);
    var fileName = file.replace(/^.*[\\\/]/, '');
    let files = new Object();
    files.projectName = projectName;
    files.filePath = pathString;
    file.fileName = fileName;
    if (db.valid('files', appPath)) {
        db.insertTableContent('files', appPath, files, (succ, msg) => {
            if (succ) {}
        })
    }
}

function insertFilePath(activeTab, path) { //file path değiştir 
    var pathString = String(path);
    var fileName = pathString.replace(/^.*[\\\/]/, '');
    let files = new Object();
    files.projectName = activeTab;
    files.filePath = pathString;
    files.fileName = fileName;
    if (db.valid('files', appPath)) {
        db.insertTableContent('files', appPath, files, (succ, msg) => {
            if (succ) {}
        })
    }
}

function getData() {

    setTimeout(function() {
        db.getAll('projects', appPath, (succ, data) => {
            if (data.length === 0) {
                document.getElementById("no-project-div").style.display = "block";
                document.getElementById("no-project-img").src = "../images/empty.png"
                document.getElementById('no-project-p').textContent = "Henüz Proje Eklemediniz !"
            } else {
                document.getElementById("no-project-div").style.display = "none";

                for (let i = 0; i < data.length; i++) {
                    createProjectDom(data[i].name, data[i].desc, data[i].time);
                    createFileTabDom(data[i].name);
                }
            }
        })
    }, 1000);
}

function createProjectDom(projectName, projectDesc, currentTime) {
    document.getElementById("no-project-div").style.display = "none";
    var myProject = document.getElementById("myproject");

    var wrap = document.createElement("div");
    wrap.className = "wrap-collabsible";

    var input = document.createElement("input");
    input.id = projectName;
    input.className = "toggle";
    input.type = "checkbox";

    var label = document.createElement("label");
    label.htmlFor = projectName;
    label.className = "lbl-toggle";
    label.innerText = projectName;

    var dltBtn = document.createElement("button");
    dltBtn.className = "dlt-btn";
    dltBtn.innerHTML = "<img src='../images/delete.png'>";

    var edtBtn = document.createElement("button");
    edtBtn.className = "edt-btn";
    edtBtn.innerHTML = "<img src='../images/edit.png'>";

    var collContent = document.createElement("div");
    collContent.className = "collapsible-content";

    var contentInner = document.createElement("div");
    contentInner.className = "content-inner";
    contentInner.innerHTML = "<p class='prj-desc'>" + projectDesc + "</p>" + "<p id='prj-add-time'>" + currentTime + "</p>";

    collContent.appendChild(contentInner);

    label.appendChild(dltBtn);
    label.appendChild(edtBtn);

    wrap.appendChild(input);
    wrap.appendChild(label);
    wrap.appendChild(collContent);

    myProject.appendChild(wrap);
}
//Global değişkenler
var myfiles = document.getElementById("myfiles");
var tab = document.getElementById("tab");
var filescontent = document.getElementById("filescontent");

function createFileTabDom(projectName) {
    var tabBtn = document.createElement("button");
    tabBtn.className = "tablinks";
    tabBtn.innerText = projectName;
    tabBtn.value = projectName;
    tabBtn.onclick = function() { openTabs(event, projectName); };
    var tabcontent = document.createElement("div");
    tabcontent.id = "tab" + projectName;
    tabcontent.className = "tabcontent";
    tab.appendChild(tabBtn);
    myfiles.appendChild(tab);
    filescontent.appendChild(tabcontent);
    myfiles.appendChild(filescontent);
}

function createFilesListDom(fileName, activeTab) {
    var tabcontent = document.getElementById("tab" + activeTab);
    var flexBoxFiles = document.createElement("div");
    flexBoxFiles.className = "flex-box-files";
    flexBoxFiles.id = fileName;
    var filesPathTopic = document.createElement("p");
    filesPathTopic.className = "files-path-topic";
    filesPathTopic.textContent = fileName;

    var openBtn = document.createElement("button");
    openBtn.className = "files-open-btn";
    openBtn.innerHTML = "<img src='../images/openfile.png'>";

    var dltBtn = document.createElement("button");
    dltBtn.className = "files-delete-btn";
    dltBtn.innerHTML = "<img src='../images/delete.png'>";
    dltBtn.addEventListener("click", function() {
        deleteFile(fileName, activeTab);
    });

    flexBoxFiles.appendChild(filesPathTopic);
    flexBoxFiles.appendChild(openBtn);
    flexBoxFiles.appendChild(dltBtn);
    tabcontent.appendChild(flexBoxFiles)
    filescontent.appendChild(tabcontent);
    myfiles.appendChild(filescontent);

}
//HERHANGİ BİR TABE TIKLANDIĞINDA:
function openTabs(evt, projectName) {

    var i, tabcontent, tablinks, activeTab;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
        //Tablar arası dolaşırken sayfanın boşaltılıp açılmasını sağlıyor ama bellekte yer tutuyormu bilmiyorum 
        tabcontent[i].innerHTML = "";
    }

    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById("tab" + projectName).style.display = "block";
    evt.currentTarget.className += " active";
    activeTab = document.getElementsByClassName("tablinks active");
    var uploadFileBtn = document.getElementById("uploadFileBtn");
    uploadFileBtn.style.visibility = "visible";
    selectFiles(activeTab[0].value);
}

//DOSYA EKLEME 
uploadFileBtn.addEventListener('click', function(event) {

    ipcRenderer.send('open-file-dialog-for-file')
})
ipcRenderer.on('selected-file', function(event, path) {
    activeTab = document.getElementsByClassName("tablinks active");
    //aktif olan tabteki projeye seçilen dosyanın pathini database'e yazdırıyorum
    insertFilePath(activeTab[0].value, path);
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].innerHTML = "";
    }
    activeTab = document.getElementsByClassName("tablinks active");
    selectFiles(activeTab[0].value);
});