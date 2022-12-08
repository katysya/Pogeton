import {getJSON} from './getJSON.js'

const burger = document.querySelector('.burger');
const burgerSubtitle = document.querySelector('.burger__subtitle');
const header = document.querySelector('.header');
const language = document.querySelector('.language');
const main = document.querySelector('.main');
const body = document.body;

let currentModal = null
let requestId = null
let captchaTimer = null

/* Для менюшки*/
burger.addEventListener('click', () => {
    burger.classList.toggle('burger-active');
    burgerSubtitle.classList.toggle('burger__subtitle-hidden');
    header.classList.toggle('header-active');
    language.classList.toggle('language-hidden');
    main.classList.toggle('main--back');
    // body.classList.toggle('locked');
});

/* Для активного раздела*/
// const menuItem = document.querySelectorAll('.nav__link');

// menuItem.forEach(item => {
//     item.addEventListener('click', e => {
//         e.classList.toggle('nav__link-active');
//     });
// });

/* Для Модального окна*/
const modalBtns = document.querySelectorAll('.modal-open');
const modals = document.querySelectorAll('.modal');

function openModal(elem, source) {
    let screenWidth = window.screen.width;

    const titleModal = document.querySelector('.modal__question');
    const textModal = document.querySelector('.modal__text');
    const textAreaModal = document.querySelector('.modal__textarea');
    const inputModal = document.querySelector('.modal__input');
    const descModal = document.getElementsByClassName('modal__item-desc');

    if (screenWidth < 1000) {
        titleModal.textContent = "как вам удобно";
        textAreaModal.setAttribute("rows", "3");

    }
    if (screenWidth < 500) {
        textAreaModal.setAttribute("rows", "2");
        descModal[0].textContent = "написать в телеграм";
        descModal[1].textContent = "написать в инстаграм";
        textAreaModal.setAttribute("placeholder", "напишите, что вас интересует");
        inputModal.setAttribute("placeholder", "номер телефона");
    }

    if (source.classList.contains("work__btn-item")) {
        textAreaModal.value = source.innerText;
    }

    elem.classList.add('active');
    header.classList.add('visibility');

    currentModal = elem
}

function closeModal(modal) {
    modal.classList.remove('active');
    // body.classList.remove('locked');
    header.classList.remove('visibility');

    let clearInput = document.querySelectorAll('.modal__input, .modal__textarea');
    clearInput.forEach(el => el.value = '');

    document.getElementsByClassName("request_error")[0].textContent = ""
}

function closeModalFromEvent(e) {
    if (e.target.closest('.modal__close') || e.target.classList.contains('modal__close') || e.target.classList.contains('modal__wrapper')) {
        closeModal(e.target.closest(".modal"))
    }
}

modalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        let data = e.target.dataset.modalOpen;
        modals.forEach(modal => {
            if (modal.dataset.modal == data ||
                modal.dataset.modal == e.target.closest('.modal-open').dataset.modalOpen) {
                openModal(modal, e.target);
            }
        });
    });
});

modals.forEach(modal => {
    modal.addEventListener('click', e => closeModalFromEvent(e));
});

///Для копирования ссылок
const linkModal = document.querySelectorAll('.modal__link-copy');
const link = document.querySelectorAll('.link-copy');

function successCopying() {
    let popup = document.querySelector('.popup__copy');
    popup.classList.add('active');
    setTimeout(() => popup.classList.remove('active'), 3000);
}

function fallbackCopyTextToClipboard(text, onSuccess) {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        onSuccess();
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}

function copyTextToClipboard(text, onSuccess) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text, onSuccess);
        return;
    }
    navigator.clipboard.writeText(text).then(function () {
        onSuccess();
    }, function (err) {
        console.error('Async: Could not copy text: ', err);
    });
}

linkModal.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault(); //отменяем переход по ссылке
        let link = e.target.closest('.modal__link').getAttribute("toCopy");
        copyTextToClipboard(link, successCopying)
    });
});

const copyMail = document.querySelector('.copy');
link.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault(); //отменяем переход по ссылке
        let link = e.target.closest('.link').getAttribute("toCopy");
        copyTextToClipboard(link, () => {
            copyMail.classList.add('active');
            setTimeout(() => copyMail.classList.remove('active'), 1000);
        })
    });
});

///Для клавиши esc
window.addEventListener('keydown', e => {
    modals.forEach(modal => {
        if (e.key === "Escape" && modal.classList.contains('active')) {
            modal.classList.remove('active');
            // body.classList.remove('locked');
        }
    });
});

///Дата
function showTimer() {
    const creationDate = new Date("2021", "08", "09");

    const yearsItem = document.getElementsByClassName("years")[0];
    const monthsItem = document.getElementsByClassName("months")[0];
    const weeksItem = document.getElementsByClassName("weeks")[0];
    const daysItem = document.getElementsByClassName("days")[0];
    const hoursItem = document.getElementsByClassName("hours")[0];
    const minutesItem = document.getElementsByClassName("minutes")[0];
    const secondsItem = document.getElementsByClassName("seconds")[0];

    const monthDiff = (d1, d2) => {
        let months;
        months = (d2.getFullYear() - d1.getFullYear()) * 12;
        months -= d1.getMonth();
        months += d2.getMonth();
        return months <= 0 ? 0 : months;
    }

    setInterval(() => {
        const currDate = new Date();
        const totalMonths = monthDiff(creationDate, currDate);
        const years = Math.floor(totalMonths / 12);
        const months = Math.floor(totalMonths % 12);
        const totalDays = currDate.getDate();
        const weeks = Math.floor(totalDays / 7);
        const day = currDate.getDay();
        const hours = currDate.getHours();
        const minutes = currDate.getMinutes();
        const seconds = currDate.getSeconds();

        yearsItem.innerHTML = ("0000" + years).slice(-4);
        monthsItem.innerHTML = ("00" + months).slice(-2);
        weeksItem.innerHTML = weeks;
        daysItem.innerHTML = day;
        hoursItem.innerHTML = ("00" + hours).slice(-2);
        minutesItem.innerHTML = ("00" + minutes).slice(-2);
        secondsItem.innerHTML = ("00" + seconds).slice(-2);
    }, 1000);
}

function fetchProjectUnits() {
    const cardBlock = document.getElementsByClassName("card__block")[0];
    getJSON("/api/v1/project_unit", (status, projectUnits) => {
        projectUnits.forEach(unit => {
            const tags = unit.tags.split(" ");
            cardBlock.innerHTML = cardBlock.innerHTML + `
                <a class="card__item" href="${unit.link}" target="_blank">
                    <img class="card__img" src="/static/${unit.id}.png" alt="Card">
                    <p class="card__desc">${unit.title}</p>
                    <div class="card__hashtags">
                        ${tags.map(tag => `<span class="card__hash-item">${tag}</span>`).join(" ")}
                    </div>
                </a>
            `
        })
    }, () => {
        for (let i = 0; i < 6; i++) {
            cardBlock.innerHTML = cardBlock.innerHTML + `
                <a class="card__item" href="#">
                    <img class="card__img" src="./img/card/card_item.png" alt="Card">
                    <p class="card__desc">Тайтл</p>
                    <div class="card__hashtags">
                        <span class="card__hash-item">#god</span>
                        <span class="card__hash-item">#save</span>
                        <span class="card__hash-item">#the</span>
                        <span class="card__hash-item">#queen</span>
                    </div>
                </a>
            `
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    showTimer();
    fetchProjectUnits();
});

function hideMenu() {
    burger.classList.remove('burger-active');
    burgerSubtitle.classList.remove('burger__subtitle-hidden');
    header.classList.remove('header-active');
    language.classList.remove('language-hidden');
    main.classList.remove('main--back');
}

///Скролл для якоря
document.querySelectorAll('a.anchor').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();

        const href = this.getAttribute('href').substring(1);

        const scrollTarget = document.getElementById(href);

        const topOffset = 0;
        const elementPosition = scrollTarget.getBoundingClientRect().top;
        const offsetPosition = elementPosition - topOffset;

        hideMenu();

        window.scrollBy({
            top: offsetPosition,
            behavior: 'smooth',
        })
    })
})

//Captcha
const captcha = document.querySelector('.captcha');
const captchaInput = document.querySelector('.captcha__input');

captcha.addEventListener('click', (e) => {
    closeCaptcha(e);
})

function closeCaptcha(e) {
    if (e.target.classList.value === 'captcha active') {
        e.target.closest('.captcha').classList.remove('active');
    }
}
//

document.getElementById('form1').addEventListener('submit', submitRequestForm);
let form2 = document.getElementById('form2')
form2.addEventListener('submit', submitCaptchaForm);

function submitRequestForm(event) {
    event.preventDefault();

    let formData = new FormData(event.target);
    let obj = {};
    formData.forEach((value, key) => obj[key] = value);

    captcha.classList.add('active');

    fetch(new Request(event.target.action, {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json',
        },
    })).then(
        function (response) {
            if (response.status !== 200) {
                document.getElementsByClassName("request_error")[0].textContent = "введены некорректные данные"
                return
            }

            response.json().then(json => {
                requestId = json.id
                let lastTime = new Date()

                form2.innerHTML = `
                    <label class="captcha__label">Тест на бота</label>
                    <div class="captcha_timer">осталось времени: 30 с</div>
                    <div class="captcha__img_area">
                        <img class="captcha__img" src="/static/${requestId}.png" alt="captcha image">
                        <div class="choose_box"></div>
                    </div>
                    <span class="captcha_error" style="color: red"></span>
                    <button class="button captcha__submit" type="submit">Подтвердить</button>
                `

                let choose_box = document.getElementsByClassName('choose_box')[0]
                for (let i = 0; i < 9; i++) {
                    choose_box.innerHTML = choose_box.innerHTML + `
                        <input class="captcha_trigger" pos="${i}" type="checkbox"/>
                    `
                }

                const showTimer = () => {
                    let timeRemaining = Math.floor(30 - (new Date() - lastTime) / 1000)
                    if (timeRemaining < 0) {
                        clearInterval(captchaTimer)
                        form2.innerHTML = `
                            <span style="
                                color: red;
                                font-size: 30px;
                                font-weight: 800;
                                opacity: 0.8;
                                grid-row: 1/5;
                                padding: 30px;
                                ">Время истекло :(</span>
                        `
                        return
                    }
                    document.getElementsByClassName("captcha_timer")[0].textContent = `
                        осталось времени: ${timeRemaining} с
                    `
                }

                if (captchaTimer !== null) {
                    clearInterval(captchaTimer)
                }
                showTimer()
                captchaTimer = setInterval(showTimer, 1000)

                captcha.classList.add('active');

                closeModal(currentModal)
            })
        },
        function (error) {
            console.error(error);
        }
    );
}

///Форма
function submitCaptchaForm(event) {
    event.preventDefault();

    let data = ""
    let triggers = document.getElementsByClassName("captcha_trigger")
    for (let i = 0; i < 9; i++) {
        let trigger = triggers.item(i)
        if (trigger.checked) {
            data += trigger.getAttribute("pos")
        }
    }

    fetch(new Request(event.target.action, {
        method: 'PUT',
        body: JSON.stringify({
            requestId,
            captchaAnswer: data
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    })).then(
        function (response) {
            if (response.status === 200) {
                clearInterval(captchaTimer)
                form2.innerHTML = `
                    <span style="
                        color: green;
                        font-size: 24px;
                        font-weight: 800;
                        opacity: 0.95;
                        grid-gap: 1/3;
                        padding: 10px;
                        ">Ваша заявка принята!</span>
                    <span style="
                        color: white;
                        font-size: 16px;
                        opacity: 0.8;
                        grid-gap: 3/4;
                        padding: 10px;
                        ">Ожидайте ответа на указанный вами контакт :)</span>
                `
            } else {
                document.getElementsByClassName("captcha_error")[0].textContent = "ты - бот!"
            }
        },
        function (error) {
            console.error(error);
        }
    )
}

////New Captcha


