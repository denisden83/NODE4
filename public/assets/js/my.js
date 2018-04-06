function sendMail(e) {
    e.preventDefault();
    const data = {
        name: formMail.name.value,
        email: formMail.email.value,
        message: formMail.message.value
    };
    let resultContainer = document.querySelector('.form-email__status');
    sendXhr('/', 'POST', data, (data) => {
        // formMail.reset();
        resultContainer.classList.remove('hidden');
        resultContainer.textContent = data.msg;
    });
}
function sendXhr(url, method, data, cb) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.addEventListener('load', (e) => {
        let result;
        try {
            result = JSON.parse(xhr.responseText)
        } catch (e) {
            cb({msg: 'Извените в данных ошибка', status: 'Error'});
        }
        cb(result);
    });
    xhr.send(JSON.stringify(data));
}

const formMail = document.querySelector('.form-email');
formMail.addEventListener('submit', sendMail);
