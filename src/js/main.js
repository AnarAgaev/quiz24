import $ from "jquery";
import IMask from 'imask';

const IS_DEBUG = true;

window.quizState = {
    type: undefined,
    phone: undefined
}

$(document).ready(() => {

    // Обрабатываем клики по карточкам
    $('.cards__list li').toArray().forEach(el => {
        $(el).on(
            'click',
            function () {
                resetCheckboxes();
                setCheckbox(this);
                pushTypeValueToState(this);
                activateBtnNext();
                cleanCustomType();
            }
        );
    })

    // Обрабатываем ввод данных в поле для своего типа грунта
    $('#customType').on(
        'input',
        function () {
            let val = $(this).val();

            if (val !== '') {
                resetCheckboxes();
                setCheckbox(this);
                pushTypeValueToState(this);
                activateBtnNext();
            } else {
                resetCheckboxes();
                inactivateBtnNext();
                quizState.type = undefined;
            }
        }
    );

    // Переходим на следующий слайд
    $('#btnShowNextQuestion').on(
        'click',
        () => {
            if (quizState.type !== undefined) {
                hideCards();
                showForm();
                showBanner();
                moveStepsBar();
                showProgress();
                moveProgressPercents();
                checkProgressBar();
                showFormSubtitle();
                showFormControllers();
            }
        }
    );

    // Маска для телефона
    let phone = document.getElementById('phone');
    let maskOptions = {
        mask: '+{7} (000) 000-00-00'
    };
    let mask = IMask(phone, maskOptions);

    function validPhone (phone) {
        let regular = /^(\+7)?(\d{3}?)?[\d]{11}$/;
        return regular.test(phone);
    }

    // Обработка отправки формы
    $('#form').submit(function (e) {
        e.preventDefault();

        // Для контроля выводим в консолько все выбранные значения
        if (IS_DEBUG) console.log('Выбранные пользователем значения:', quizState);

        if (validPhone(mask.unmaskedValue)) {
            let request = $.ajax({
                url: "https://u1430355.isp.regruhosting.ru/test.php",
                method: "POST",
                data: {
                    type: quizState.type,
                    phone: quizState.phone
                },
                dataType: "json"
            });

            request.done(function( data ) {
                console.log('Ответ сервера', data);

                if (data['send-result']) {

                    hideForm();
                    hideBanner();
                    hideSteps();
                    showModal();
                }
            });

            request.fail(function( jqXHR, textStatus ) {
                alert( "Request failed: " + textStatus );
            });
        }
    });

    // Чекаем телефон при каждом изменении
    $('#phone').on(
        'input',
        () => {
            if (validPhone(mask.unmaskedValue)) {
               $('#sendForm').removeClass('inactive');
            } else {
                $('#sendForm').addClass('inactive');
            }

            quizState.phone = mask.value === ''
                ? undefined
                : mask.value;
        }
    );

    function resetCheckboxes () {
        $('.cards__check').removeClass('active');
    }

    function setCheckbox (el) {
        let checkbox = el.nodeName === 'INPUT'
            ? $(el).prev()
            : $(el).find('.cards__check');

        $(checkbox).addClass('active');
    }

    function pushTypeValueToState (el) {
        quizState.type = el.nodeName === 'INPUT'
            ? $(el).val()
            : $(el).find('.cards__desc').text();
    }

    function activateBtnNext () {
        $('#btnShowNextQuestion').removeClass('inactive');
    }

    function inactivateBtnNext () {
        $('#btnShowNextQuestion').addClass('inactive');
    }

    function cleanCustomType () {
        $('#customType').val('');
    }

    function hideCards () {
        $('#cards').addClass('invisible');
        setTimeout(() => $('#cards').addClass('hidden'), 400);
    }

    function showForm () {
        $('#form').removeClass('hidden');
        setTimeout(() => $('#form').removeClass('invisible'),500);
    }

    function hideForm () {
        $('#form').addClass('invisible');
        setTimeout(() => $('#form').addClass('hidden'),500);
    }

    function showBanner () {
        setTimeout(()=>$('#banner').removeClass('hidden'),4000);
        setTimeout(() => $('#banner').removeClass('invisible'),4100);
        setTimeout(() => $('#banner').addClass('animation'),5000);
    }

    function hideBanner () {
        $('#banner').addClass('invisible');
        setTimeout(() => $('#banner').addClass('hidden'),500);
        setTimeout(() => $('#banner').removeClass('animation'),500);
    }

    function hideSteps () {
        $('#steps').addClass('invisible');
        setTimeout(() => $('#steps').addClass('hidden'),500);
    }

    function showModal () {
        setTimeout(() => $('#madal').removeClass('hidden'),700);
        setTimeout(() => $('#madal').removeClass('invisible'),1000);
    }

    function moveStepsBar () {
        let first = $('.steps__bar span:first-child'),
            second = $('.steps__bar span:last-child');

        $(first).removeClass('active');
        $(second).addClass('active passed');

        $('#stepValue').text('2');
    }

    function showProgress () {
        $('.progress .bar').addClass('animation');
    }
    
    function moveProgressPercents () {
        let num = 0;
        let setTime = setInterval(countUp, 25);

        function countUp () {
            if (num > 99) {
                window.clearInterval(setTime);
            } else {
                num++;
                $('#progressVal').text(num + '%');
            }
        }
    }

    function checkProgressBar () {
        setTimeout(() => {$('#progressVal').addClass('checked')}, 3000)
    }

    function showFormSubtitle () {
        setTimeout(()=>$('#formCaption').removeClass('hidden'), 3500);
        setTimeout(()=>$('#formCaption').removeClass('invisible'), 3600);
    }

    function  showFormControllers () {
        setTimeout(()=>$('#formControls').removeClass('hidden'), 3500);
        setTimeout(()=>$('#formControls').removeClass('invisible'), 3600);
    }
});