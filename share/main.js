var gui = require('nw.gui');
var peer = new Peer({key: 'c08e7ef5-80a6-40b7-9671-5156cbf83598'});
var clipboard = gui.Clipboard.get();
gui.Screen.Init(); // you only need to call this once
gui.Screen.chooseDesktopMedia(["window","screen"], 
  function(streamId) {
    navigator.webkitGetUserMedia({
        audio: { //Note: Audio desktop capture only supported in Chromium in WindowsOS 
         mandatory: {
             chromeMediaSource: "system",
             chromeMediaSourceId: streamId
          }
        },
        video: {
          mandatory: {
            chromeMediaSource: 'desktop', 
            chromeMediaSourceId: streamId, 
            maxWidth: 1920, 
            maxHeight: 1080
          }, 
          optional: []
        }
      },
      function(stream){
        var video = document.getElementById('video');
        video.src = URL.createObjectURL(stream);

        peer.on('open', function(id) {
          var url = 'http://talk.igaru.com/share/#!/'+ id;
          document.getElementById('url').text = url;
          peer.on('connection', function(connection) {
          peer.call(connection.peer,stream);
        });

      });
      }, 
      function(err){
        console.error(err);
      }
    );
  }
);

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById('copy').addEventListener('click',function(){
    clipboard.set(document.getElementById('url').text, 'text');
  },false);
});