export function getJSON(url, callback, onerror) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function () {
        callback(xhr.status, xhr.response);
    };
    xhr.onerror = onerror
    xhr.send();
}