'use strict';

const captureButton_ = document.getElementById('capture');
const downloadButton_ = document.getElementById('download');
const againButton_ = document.getElementById('again');
const canvas_ = document.querySelector('canvas');
const video_ = document.querySelector('video');
const downloader_ = document.getElementById('downloader');
let videoTracks;

let mediaConfig = {
    audio: false,
    // video: true,
    video: {
        width: {
            min: 1280,
            ideal: 1920,
            max: 2560,
        },
        height: {
            min: 720,
            ideal: 1080,
            max: 1440
        },
        facingMode: "user",
        frameRate: { ideal: 10, max: 15 },
    }
};

const handleSuccess = (stream) => {
    const handleSuccess_ = document.getElementById('handleSuccess');
    const controls_ = document.getElementById('controls');
    const loadingCssRipple_ = document.getElementById('loadingCssRipple');
    handleSuccess_.style.display = "flex";
    loadingCssRipple_.classList.add("d-none");

    window.stream = stream;
    videoTracks = stream.getVideoTracks();
    video_.srcObject = stream;
    video_.play();
    setTimeout(() => {
        controls_.classList.remove("d-none");
    }, 500);
};

const handleError = (error) => {
    const loadingCssRipple_ = document.getElementById('loadingCssRipple');
    setTimeout(() => {
        var msg = 'Usted ha denegado el permiso de usar la Cámara.<hr>Activalo como muestra la imagen.<br><br>';
        msg += '<br><img src="images/bloquear.jpg" class="w-100">';
        showAlertModal(msg, 'danger', 'Apoyanos en esto');
        loadingCssRipple_.classList.add("d-none");
    }, 700);
}

downloadButton_.addEventListener('click', function () {
    downloader_.click();
});

againButton_.addEventListener('click', function () {
    captureButton_.classList.remove('d-none');
    downloadButton_.classList.add('d-none');
    againButton_.classList.add('d-none');
    canvas_.classList.add('d-none');
    video_.style.display = "block";
});

captureButton_.addEventListener('click', function () {
    canvas_.classList.remove("d-none");
    canvas_.width = video_.videoWidth;
    canvas_.height = video_.videoHeight;
    canvas_.getContext('2d').drawImage(video_, 0, 0);
    video_.style.display = "none";
    captureButton_.classList.add('d-none');
    againButton_.classList.remove('d-none');
    downloadButton_.classList.remove('d-none');
    downloader_.download = makeid(10) + '.png';
    downloader_.href = canvas_.toDataURL("image/png");
});

navigator.permissions.query({ name: 'camera' }).then(function (result) {
    if (result.state == 'granted') {
    } else if (result.state == 'prompt') {
        showAlertModal('Haz clic en "Permitir" arriba para utilizar la Cámara.');
    } else if (result.state == 'denied') {
    }
    result.onchange = () => {
        $('#modalPermissionCamera').modal('hide');
    };
});

if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
    navigator.mediaDevices.getUserMedia(mediaConfig).then(handleSuccess).catch(handleError);
} else {
    const handleError_ = document.getElementById('handleError');
    const handleSuccess_ = document.getElementById('handleSuccess');
    const loadingCssRipple_ = document.getElementById('loadingCssRipple');
    setTimeout(() => {
        handleError_.classList.remove("d-none");
        handleError_.innerHTML = `
            <div class="alert alert-danger w-100" role="alert">
                <h4 class="alert-heading">Mensaje...!!!</h4>
                <hr>
                <p class="mb-0">Lo sentimos, su navegador no soporta getUserMedia</p>
            </div>
            `;
        handleSuccess_.style.display = "none";
        loadingCssRipple_.classList.add("d-none");
    }, 700);
}

function showAlertModal(body, colorButton, title, icon) {
    var title = title || 'Permitir Cámara';
    var icon = icon || '<i class="material-icons" id="flipIconArrow">transit_enterexit</i>';
    var colorButton = colorButton || 'success';
    var dNoneButton = (colorButton === 'danger') ? 'd-none' : '';
    document.getElementById('showModalPermission').innerHTML = `
    <div class="modal bounceIn animated " tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false"
        id="modalPermissionCamera">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content" style="background: transparent;border: 0;color: #fff;">
                <div class="modal-header" style="border-bottom: 0;padding: 1rem 0 0;">
                    <h5 class="modal-title">` + icon + `  ` + title + `</h5>
                </div>
                <div class="modal-body" style="padding: 1rem 0 0 1.8rem">
                    <p>` + body + `</p>
                </div>
                <div class="modal-footer ` + dNoneButton + `" style="justify-content: flex-start;border-top: 0;padding-left: 1.7rem;">
                    <button type="button" class="btn btn-` + colorButton + `" data-dismiss="modal"
                        style="padding-left: 1.5rem;padding-right: 1.5rem;">
                        OK
                    </button>
                </div>
            </div>
        </div>
    </div>
    `;
    $('#modalPermissionCamera').modal('show');
}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}