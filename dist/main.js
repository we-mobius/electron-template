(()=>{"use strict";const e=require("electron");function n(){new e.BrowserWindow({width:1920,height:1080,webPreferences:{nodeIntegration:!1,webSecurity:!0,allowRunningInsecureContent:!1}}).loadFile("./index.html")}e.app.whenReady().then(n),e.app.on("window-all-closed",(()=>{"darwin"!==process.platform&&e.app.quit()})),e.app.on("activate",(()=>{0===e.BrowserWindow.getAllWindows().length&&n()}))})();
//# sourceMappingURL=main.js.map