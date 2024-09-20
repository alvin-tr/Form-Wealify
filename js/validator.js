const valueInputUserName = document.getElementById('email');
const valueInputPassword = document.getElementById('password');
const loginButton = document.querySelector('.form-submit')


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

                if (!validate(inputElement, rule)) {
                    errorElement.innerText = '';
                    inputElement.parentElement.style.border = '0';
                }


            }
            console.log(inputElement);
        });

    }

    function validate(inputElement, rule) {
        var errorMessage
        var errorElement = inputElement.parentElement.parentElement.querySelector('.form-message')

        // Lấy ra các rule của selector
        var rules = selectorRules[rule.selector]

        // Lặp qua từng rule để kiểm tra (check) || Nếu có lỗi thì dừng việc kiểm tra
        for (var i = 0; i < rules.length; ++i) {
            errorMessage = rules[i](inputElement.value)
            if (errorMessage) break;
        }


        // Nêu lỗi thì hiển thị if nếu không lỗi thì hiển thị else
        if (errorMessage) {
            errorElement.innerText = errorMessage;
            inputElement.parentElement.style.border = '1px solid red';
        }
        else {
            errorElement.innerText = '';
            inputElement.parentElement.style.border = '0';

        }

    }

}

// Định nghĩa rule

Validator.isRequired = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            return value ? undefined : 'Vui lòng nhập trường này !'
        }
    };
}


Validator.isEmail = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : "Trường này phải là email !"
        }
    }
}

Validator.isPassword = function (selector, min) {
    return {
        selector: selector,
        test: function (value) {
            return value.length >= min ? undefined : `Vui lòng nhập tối thiểu ${min} ký tự.`
        }
    }
}

Validator.hasNumber = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            return /\d/.test(value) ? undefined : "Vui lòng nhập tối thiểu 1 chữ số";
        }
    }
}

Validator.hasUppercase = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            return /[A-Z]/.test(value) ? undefined : "Vui lòng nhập ít nhất 1 chữ in hoa."
        }
    }
}

Validator.hasLowercase = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            return /[a-z]/.test(value) ? undefined : "Vui lòng nhập ít nhất 1 chữ in thường."
        }
    }
}

Validator.hasCharacter = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            return /[!@#$%^&*(),.?":{}|<>]/.test(value) ? undefined : " Vui lòng nhập ít nhất 1 ký tự đặc biệt."
        }
    }
}


const userInfo = {
    email: '',
    password: ''
}

loginButton.addEventListener('click', function (e) {
    e.preventDefault()

    userInfo.email = valueInputUserName.value;
    userInfo.password = valueInputPassword.value

    fetch('https://dev-api.wealify.com/api/v1/cms/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInfo)
    })
        .then(function (response) {
            if (!response.ok) {
                throw new Error('Đăng nhập không thành công')
            }
            return response.json();
        })
        .then(function (postData) {

            console.log('postData', postData);

            const accessToken = postData.data.access_token;
            const refreshToken = postData.data.refresh_token;
            const expiredTime = postData.data.access_expired_at;
            // const crrTime = new Date().getTime();
            // const expiredTime = crrTime + 1000 * 1000

            localStorage.setItem('accessToken', accessToken)
            localStorage.setItem('refreshToken', refreshToken)
            localStorage.setItem('expiredTime', expiredTime)

            console.log('expiredTime:::', expiredTime);

            window.location.href = '../screens/manageBankWealify.html'

            const expiredDate = new Date(expiredTime);
            console.log('Thời gian hết hạn (định dạng dễ đọc):', expiredDate.toLocaleString());

        })
        .catch(function (error) {
            console.log('error: ', error.message);
            alert('Đăng nhập không thành công')
        });
});




