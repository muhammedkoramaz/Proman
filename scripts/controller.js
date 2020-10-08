const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;
const app = electron.remote.app
const db = require('electron-db');

const appPath = app.getAppPath();

db.createTable('projects', app.getAppPath(), (succ, msg) => {})

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
    }

})

function insertProject(projectName, projectDesc, currentTime) {
    let project = new Object();
    project.name = projectName;
    project.desc = projectDesc;
    project.time = currentTime;
    if (db.valid('projects', appPath)) {
        db.insertTableContent('projects', appPath, project, (succ, msg) => {
            if (succ)
                createProjectDom(projectName, projectDesc, currentTime);
            else
                throw msg;
        })
    }
}

function deleteProject(wrapID, projectName) {
    db.deleteRow('projects', appPath, {
        'name': projectName
    }, (succ, msg) => {
        if (succ)
            document.getElementById(wrapID).remove();
        else
            throw msg
    });
}

function getData() {

    setTimeout(function () {
        db.getAll('projects', appPath, (succ, data) => {
            if (data.length === 0) {
                document.getElementById("no-project-div").style.display = "block";
                document.getElementById("no-project-img").src = "../images/empty.png"
                document.getElementById('no-project-p').textContent = "Henüz Proje Eklemediniz !"
            } else {
                document.getElementById("no-project-div").style.display = "none";

                for (let i = 0; i < data.length; i++) {
                    createProjectDom(data[i].name, data[i].desc, data[i].time);
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
    wrap.id = "wrap" + projectName;

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
    dltBtn.addEventListener("click", function () {
        deleteProject(wrap.id, projectName);
    });


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