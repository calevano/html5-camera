// window.onload = function () {
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var video = document.getElementById('video');
var mediaConfig = { video: true };
var errBack = function (e) {
    console.log('An error has occurred!', e)
};

if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
    console.log("Momento de divertirnos...");
    navigator.mediaDevices.getUserMedia(mediaConfig)
        .then(
            (stream) => {
                video.srcObject = stream;
                // video.play();
            });

} /* Legacy code below! */
else if (navigator.getUserMedia) { // Standard
    navigator.getUserMedia(mediaConfig, function (stream) {
        video.src = stream;
        video.play();
    }, errBack);
} else if (navigator.webkitGetUserMedia) { // WebKit-prefixed
    navigator.webkitGetUserMedia(mediaConfig, function (stream) {
        video.src = window.webkitURL.createObjectURL(stream);
        video.play();
    }, errBack);
} else if (navigator.mozGetUserMedia) { // Mozilla-prefixed
    navigator.mozGetUserMedia(mediaConfig, function (stream) {
        video.src = window.URL.createObjectURL(stream);
        video.play();
    }, errBack);
}
// Trigger photo take
document.getElementById('snap').addEventListener('click', function () {
    context.drawImage(video, 0, 0, 640, 480);
});
// }