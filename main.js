const 
  electron = require('electron'),
  url = require('url'),
  path = require('path'),
  {app, BrowserWindow, Menu, ipcMain} = electron;

//set ENV
process.env.NODE_ENV = 'production';

//windows
let mainWindow, addItemWindow;

//listen for app 
app.on('ready', createWindow);

function createWindow() {
  //create new window
  mainWindow = new BrowserWindow({});
  //load html to window
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'mainWindow.html'),
    protocol: 'file:',
    slashes: true
  }));
  //Quit app when closed
  mainWindow.on('closed', function() {
    app.quit();
  });
  //Build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  //set application menu
  Menu.setApplicationMenu(mainMenu);
};

//Create add item window
function openAddItemWindow() {
  // //create new window
  addItemWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: 'Add New Shopping Item'
  });
  //load html to window
  addItemWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'addItemWindow.html'),
    protocol: 'file:',
    slashes: true
  }));
  //Garbage collection 
  addItemWindow.on('closed', function(){
    addItemWindow = null;
  });
};

//Receive item:add from template
ipcMain.on('item:add', function(e, item){
  mainWindow.webContents.send('item:add', item);
  addItemWindow.close();
});

//Menu templates
const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Add Item',
        click() {
          openAddItemWindow();
        }
      },
      {
        label: 'Clear Items',
        click(){
          mainWindow.webContents.send('item:clear');
        }
      },
      {
        label: 'Quit',
        accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click(){
          app.quit();
        }
      }
    ]
  }
];

// mac display electron on menu by default 
// windows displays file by default
//to change default for mac to file
if(process.platform == 'darwin') {
  mainMenuTemplate.unshift({});
};

//devtools only in development
if(process.env.NODE_ENV !== 'production') {
  mainMenuTemplate.push({
    label: 'Dev Tools',
    submenu: [
      {
        label: 'Toggle DevTools',
        accelerator: process.platform == 'darwin' ? 'Command+D' : 'Ctrl+D',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools();
        }
      },
      {
        role: 'reload'
      }
    ]
  });
};