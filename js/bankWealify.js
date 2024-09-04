const contentContainer = document.querySelector('.content_container');
const itemDrop = document.querySelector('.item__content__dropdown')


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



fetch('https://dev-api.wealify.com/api/v1/cms/constants/providers', {
    method: 'GET',
    headers: {
        'content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
    },
})
    .then((response) => {
        return response.json()
    })
    .then(({ data }) => {
        console.log('NCC:', data);
        providerList(data)
    })
    .catch((error) => {
        console.error('Lỗi khi gọi dữ liệu:', error);
    })





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

        const groupedData = {};

        if (Array.isArray(data)) {
            data.forEach(item => {
                if (item.provider && item.provider.name) {
                    const providerName = item.provider.name;

                    if (!groupedData[providerName]) {
                        groupedData[providerName] = [];
                    }

                    groupedData[providerName].push(item);
                }
            });
        }


        console.log('okk:', groupedData);

        payCard(data)

    })
    .catch((error) => {
        console.log('Cannot render data:', error);
    })





function providerList(NCCS) {
    const container = document.createElement("div");
    container.className = "dropdown_element";
    // 1.
    // 2. 



    container.innerHTML = NCCS.map(ncc => {

        const name = ncc.name === 'Bank transfer' ? 'Tài khoản ngân hàng Việt Nam' : ncc.name

        if (ncc.name === 'Wealify') {
            return '';
        }

        return `
             <div class="dropdown_element">
                <div class="dropdown_element--contentfirst">
                    <div class="icon__title">
                        <p>${name}</p>
                        <div class="down__icon">
                            <i class="far fa-angle-down"></i>
                        </div>
                    </div>

                    <div class="item__content__dropdown">
                        <div class="rightbutton">
                            <button>SẮP XẾP</button>
                            <button>THÊM TÀI KHOẢN</button>
                        </div>

                        

                    </div>
                </div>

            </div>
        `
    }).join('')


    contentContainer.appendChild(container)

}



function payCard(cards) {




    const container = document.createElement("div");
    container.className = "card__item__container--grand"

    container.innerHTML = cards.map(card => {
        return `
        <div class="card__item__container">
                                <div class="card__item__header">
                                    <div class="content--header">
                                        <h3></h3>
                                        <div class="uutien">
                                            <p>Mức độ ưu tiên</p>
                                            <span class="uutienNumber">1</span>
                                        </div>
                                    </div>

                                    <div class="content__button--header">
                                        <!-- eye -->
                                        <div class="hover__simple">
                                            <i class="far fa-eye"></i>
                                        </div>
                                        <!-- pencil -->
                                        <div class="hover__simple">
                                            <i class="fad fa-pencil"></i>
                                        </div>
                                        <!-- trash -->
                                        <div class="hover__simple">
                                            <i class="fas fa-trash"></i>
                                        </div>
                                    </div>
                                </div>

                                <div class="card__item__body">
                                    <div class="horizontal__item">
                                        <p>
                                            Ngân hàng
                                        </p>
                                        <p>ACB</p>
                                    </div>
                                    <!-- 2 -->
                                    <div class="horizontal__item">
                                        <p>
                                            Chủ tài khoản
                                        </p>
                                        <p>THE HUMAN BANK</p>
                                    </div>
                                    <!-- 3 -->
                                    <div class="horizontal__item">
                                        <p>
                                            Số tài khoản
                                        </p>
                                        <p>32947918234</p>
                                    </div>
                                    <!-- 4 -->
                                    <div class="horizontal__item">
                                        <p>
                                            Gán cho level
                                        </p>
                                        <p>Level 2</p>
                                    </div>
                                    <!-- 5 -->
                                    <div class="horizontal__item">
                                        <p>
                                            Hạn mức/ngày
                                        </p>
                                        <p>12,312,213 VND</p>
                                    </div>
                                    <!-- 6 -->
                                    <div class="horizontal__item">
                                        <p>
                                            Đã top-up/ngày
                                        </p>
                                        <p>0 VND</p>
                                    </div>
                                    <!-- 7 -->
                                    <div class="horizontal__item">
                                        <p>
                                            Còn lại
                                        </p>
                                        <p>12,312,213 VND</p>
                                    </div>
                                    <!-- 8 -->
                                    <div class="horizontal__item">
                                        <p>
                                            Trạng thái
                                        </p>
                                        <span>Còn hạn mức</span>
                                    </div>
                                    <!-- 9 -->
                                    <div class="horizontal__item">
                                        <p>
                                            Active
                                        </p>
                                        <label class="switch">
                                            <input type="checkbox" checked>
                                            <span class="slider round" style="height: 34px;"></span>

                                        </label>
                                    </div>

                                </div>
                            </div>
        `
    }).join('')

    itemDrop.appendChild(container)
    console.log('itemDrop', container);
}