


document.querySelectorAll('.icon__title').forEach(function (element) {
    element.addEventListener('click', function () {

        // const downIcon = document.querySelector('.down__icon');
        const downIcon = this.closest('.dropdown_element').querySelector('.down__icon');

        if (downIcon) { // Kiểm tra nếu tồn tại down__icon
            downIcon.classList.toggle('rotate'); // Thay đổi class rotate
        }

        const content = this.closest('.dropdown_element').querySelector('.item__content__dropdown');

        // if (content.style.display === 'none' || content.style.display === '') {
        //     content.style.display = 'block';
        // } else {
        //     content.style.display = 'none';
        // }

        content.classList.toggle('show');

    });
});




fetch('https://dev-api.wealify.com/api/v1/cms/system-payments', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
    },
    params: {
        page: 1,
        limit: 1000
    }
})
    .then((response) => {
        return response.json()
    })
    .then(({ data }) => {
        console.log('data: ', data);
    })