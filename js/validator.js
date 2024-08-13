// đối tượng 'Validator'
function Validator(options) {


    var selectorRules = {};

    var formElement = document.querySelector(options.form);

    if (formElement) {

        formElement.onsubmit = function (e) {
            e.preventDefault();
        }

        // Lặp qua mỗi rule và xử lý sự kiện (lắng nghe sự kiện như blur, input,...)
        options.rules.forEach(function (rule) {

            // Lưu lại các rule cho mỗi inpuut

            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);

            } else {
                selectorRules[rule.selector] = [rule.test];

            }


            var inputElement = formElement.querySelector(rule.selector);

            // Xử lý trường hợp blur khỏi input
            if (inputElement) {
                inputElement.onblur = function () {

                    validate(inputElement, rule)
                }
            }

            // Xử lý trường hợp bắt đầu viết thì phải mất errorMessage
            inputElement.oninput = function () {
                var errorElement = inputElement.parentElement.parentElement.querySelector(options.errorSelector)

                errorElement.innerText = '';
                inputElement.parentElement.style.border = '0';

            }

        });

    }

    function validate(inputElement, rule) {
        var errorMessage
        var errorElement = inputElement.parentElement.parentElement.querySelector('.form-message')

        // Lấy ra các rule của selector
        var rules = selectorRules[rule.selector]

        // Lặp qua twungf rule để kiểm tra (check) || Nếu có lỗi thì dừng việc kiểm tra
        for (var i = 0; i < rules.length; ++i) {
            errorMessage = rules[i](inputElement.value)
            if (errorMessage) break;
        }

        console.log('errorMessage', errorMessage);

        if (errorMessage) {
            errorElement.innerText = errorMessage;
            // inputElement.parentElement = document.querySelector('.input__form').style.border = '1px solid red';
            inputElement.parentElement.style.border = '1px solid red';
        }
        else {
            errorElement.innerText = '';
            // inputElement.parentElement = document.querySelector('.input__form').style.border = '0';
            inputElement.parentElement.style.border = '0';

        }

        console.log('okiadshuj', inputElement.parentElement);

    }

}

// Định nghĩa rule

Validator.isRequired = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            return value ? undefined : 'Vui lòng nhập trường này'
        }
    };
}


Validator.isEmail = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : "Trường này phải là email!"
        }
    }
}



Validator.isPassword = function (selector, min) {
    return {
        selector: selector,
        test: function (value) {
            return value.length >= min ? undefined : `Vui lòng nhập tối thiểu ${min} ký tự`
        }
    }
}