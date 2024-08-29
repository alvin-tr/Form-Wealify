


document.querySelectorAll('.icon__title').forEach(function (element) {
    element.addEventListener('click', function () {

        const downIcon = document.querySelector('.down__icon');
        console.log(downIcon);
        if (downIcon) { // Kiểm tra nếu tồn tại down__icon
            downIcon.classList.toggle('rotate'); // Thay đổi class rotate
        }
    });
});