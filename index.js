const {
    app,
    BrowserWindow,
    ipcMain,
    Menu
} = require('electron')

let mainWin, aboutWin, settingsWin, feedbackWin, addProjectWin;
let abaoutOpen = false,
    settingsOpen = false,
    feedbackOpen = false,
    addProjectOpen = false;

function createWindow() {
    mainWin = new BrowserWindow({
        width: 1000,
        height: 700,
        center: true,
        webPreferences: {
            nodeIntegration: true
        }
    })

    mainWin.setMinimumSize(850, 500);
    mainWin.setMenu(null);
    mainWin.loadFile('pages/index.html');

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);

}
//MENU TEMPLATE
const mainMenuTemplate = [{
    label: "Dev Tools",
    submenu: [{
            label: "Dev Tools",
            click(item, focusedWindow) {
                focusedWindow.toggleDevTools();
            }
        },
        {
            label: "Yenile",
            role: "reload"
        }
    ]
}]

function createAboutPage() {
    aboutWin = new BrowserWindow({
        width: 500,
        height: 300,
        parent: mainWin,
        resizable: false,
        movable: false,
        maximizable: false,
        minimizable: false,
        frame: false,
        backgroundColor: "#f7f7f7",
        webPreferences: {
            nodeIntegration: true
        },
    })
    aboutWin.setMenu(null);
    aboutWin.loadFile('pages/about.html');
    abaoutOpen = true;
    aboutWin.on('close', () => {
        aboutWin = null;
        abaoutOpen = false;
    })
}

function createSettingsPage() {
    settingsWin = new BrowserWindow({
        width: 400,
        height: 250,
        parent: mainWin,
        resizable: false,
        movable: false,
        maximizable: false,
        minimizable: false,
        backgroundColor: "#f7f7f7",
        webPreferences: {
            nodeIntegration: true
        },
    })

    settingsWin.setMenu(null);
    settingsWin.loadFile('pages/settings.html');
    settingsOpen = true;
    settingsWin.on('close', () => {
        settingsWin = null;
        settingsOpen = false;
    })
}

function createFeedPage() {
    feedbackWin = new BrowserWindow({
        width: 400,
        height: 250,
        parent: mainWin,
        resizable: false,
        movable: false,
        maximizable: false,
        minimizable: false,
        backgroundColor: "#f7f7f7",
        webPreferences: {
            nodeIntegration: true
        },
    })

    feedbackWin.setMenu(null);
    feedbackWin.loadFile('pages/feedback.html');
    feedbackOpen = true;
    feedbackWin.on('close', () => {
        feedbackWin = null;
        feedbackOpen = false;
    })
}

function createAddProject() {
    addProjectWin = new BrowserWindow({
        width: 400,
        height: 250,
        parent: mainWin,
        resizable: false,
        movable: false,
        maximizable: false,
        minimizable: false,
        frame: false,
        backgroundColor: "#f7f7f7",
        webPreferences: {
            nodeIntegration: true
        },
    })

    addProjectWin.setMenu(null);
    addProjectWin.loadFile('pages/createProject.html');
    addProjectOpen = true;
    addProjectWin.on('close', () => {
        addProjectWin = null;
        addProjectOpen = false;
    })
}


app.whenReady().then(createWindow);
app.allowRendererProcessReuse = false;


ipcMain.on('open-settings', function () {
    if (!settingsOpen && !feedbackOpen && !abaoutOpen)
        createSettingsPage();
})

ipcMain.on('open-feedback', function () {
    if (!settingsOpen && !feedbackOpen && !abaoutOpen)
        createFeedPage();
})

ipcMain.on('open-about', function () {
    if (!settingsOpen && !feedbackOpen && !abaoutOpen)
        createAboutPage();
})


ipcMain.on('open-addProjectPopup', function () {
    if (!addProjectOpen)
        createAddProject();
})

ipcMain.on('addProjectBtnClose', function () {
    addProjectWin.close();
})

ipcMain.on('addProjectBtnSave', (err, data) => {
    if (data) {
        mainWin.webContents.send('create-project', (err, data));
        addProjectWin.close();
    }
})

ipcMain.on('close-about', function () {
    aboutWin.close();
})

/*
var nodeConsole = require('console');
var myConsole = new nodeConsole.Console(process.stdout, process.stderr);
myConsole.log('Hello World!');
 */