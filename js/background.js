function Background() {
  
}

chrome.runtime.onMessageExternal.addListener(
  function(request, sender, sendResponse) {
    if (request) {
      if (request.message) {
        if (request.message == "version") {

          //my chrome application initial load screen is login.html
          //window.open('index.html');
          this.launch();
          //if required can send a response back to the web site aswell. I have logged the reply on the web site
          sendResponse({version: '1.1.1'});
        }
      }
    }
    return true;
  });




Background.prototype.ifShowFrame_ = function() {
  var version = parseInt(navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10);
  var os = 'other';
  if (navigator.appVersion.indexOf('Linux') != -1) {
    os = 'linux';
  } else if (navigator.appVersion.indexOf('CrOS') != -1) {
    os = 'cros';
  } else if (navigator.appVersion.indexOf('Mac OS X') != -1) {
    os = 'mac';
  }

  return os === 'linux' && version < 27 ||
         os === 'mac' && version < 25;
};

Background.prototype.launch = function(launchData) {
  this.newWindow();
};


Background.prototype.newWindow = function() {
  var appWindowId = 'appWindow';
  var options = {
    id: appWindowId,
    frame: (this.ifShowFrame_() ? 'chrome' : 'none'),
    innerBounds: { 
      width: 770, 
      height: 400, 
      minWidth: 770,
      minHeight: 400
    }
  };

  chrome.app.window.create('index.html', options, function(win) {
    console.log('Window opened:', win);
    win.onClosed.addListener(this.onWindowClosed.bind(this, win));
  }.bind(this));
};


var background = new Background();
chrome.app.runtime.onLaunched.addListener(background.launch.bind(background));

/* Exports */
window['background'] = background;
Background.prototype['newWindow'] = Background.prototype.newWindow;