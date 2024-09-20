function clickEvenCard() {
  document.querySelectorAll(".icon__title").forEach(function (element) {
    element.addEventListener("click", function () {
      const downIcon =
        this.closest(".dropdown_element").querySelector(".down__icon");

      if (downIcon) {
        downIcon.classList.toggle("rotate");
      }

      const content = this.closest(".dropdown_element").querySelector(
        ".item__content__dropdown"
      );

      content.classList.toggle("show");
    });
  });
}



function checkTimeExpired(time) {
  const currentDate = Date.now()
  return time - 1000 < currentDate
}

function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken) {
    alert('Không tìm thấy refresh token. Cần đăng nhập lại.');
    window.location.href = '/auth/login.html';
    return;
  }

  fetch('https://dev-api.wealify.com/api/v1/cms/refresh-token', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
    },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Làm mới token không thành công');
      }
      return response.json();
    })
    .then(data => {

      const newAccessToken = data.data.access_token;
      const newRefreshToken = data.data.refresh_token;
      const newExpiredTime = new Date().getTime() + 10 * 1000;

      localStorage.setItem('accessToken', newAccessToken);
      localStorage.setItem('refreshToken', newRefreshToken)
      localStorage.setItem('expiredTime', newExpiredTime);

      console.log('Token đã được làm mới thành công');
    })
    .catch(error => {
      console.log('Lỗi làm mới token:', error);
      alert('Không thể làm mới token. Bạn cần đăng nhập lại.');

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('expiredTime');


      window.location.href = '/auth/login.html';
    });
}


async function callAPI(url = "", option = {}) {

  const expiredTime = localStorage.getItem('expiredTime');
  if (checkTimeExpired(expiredTime)) {
    refreshAccessToken()
  }

  try {
    const response = await fetch(url, {
      method: option.method,
      headers: {
        'Content-Type': 'application/json',
        ...option.headers
      },
      ...option,
    });

    const data = await response.json();


    if (!data.status === true) {
      throw new Error(`Error: ${response.status}`)

    }
    return data;

  } catch (error) {
    console.error('API call failed:', error);

  }
}

async function fetchAPIProvider(url = "", option = {}, providerList) {
  try {
    const dataProvider = await callAPI(url, option);
    if (dataProvider) {
      console.log('Data provider:', dataProvider);

      providerList(dataProvider.data);
    } else {
      console.log('Khong co du lieu');
    }

  } catch (error) {
    console.error('Faile to fetch API:', error)
  }
}

fetchAPIProvider(
  'https://dev-api.wealify.com/api/v1/cms/constants/providers',
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  },
  providerList
);


let isProviderListCalled = false;

async function providerList(NCCS) {
  if (isProviderListCalled) return;
  isProviderListCalled = true;

  const contentContainer = document.querySelector(".content_container");
  contentContainer.innerHTML = "";

  const container = document.createElement("div");
  container.className = "dropdown_element";

  container.innerHTML = NCCS.map((ncc) => {
    const name =
      ncc.name === "Bank transfer" ? "Tài khoản ngân hàng Việt Nam" : ncc.name;

    if (ncc.name === "Wealify") {
      return "";
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


                    <!-- nút phải -->
                    <div class="item__content__dropdown">
                        <div class="rightbutton">
                            <button>SẮP XẾP</button>
                            <button class="addAccountBtn" >THÊM TÀI KHOẢN</button>
                        </div>

                    <div class="card__item__container--grand" id="provider-${ncc.name}">
                    
                    
                        
                    </div>

                    </div>


                </div>



            </div>
        `;
  }).join("");

  contentContainer.appendChild(container);

  // call API lấy danh sách account ở đây
  let card = [];
  console.log('card:', card);

  const result = await callAPI(
    "https://dev-api.wealify.com/api/v1/cms/system-payments",
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );

  if (!result) {
    console.error("No data returned from API");
    return;
  }

  card = result.data;
  card.sort((a, b) => a.provider.name.localeCompare(b.provider.name));

  for (const ncc of NCCS) {
    if (ncc.name !== "Wealify") {
      let providerContainer = document.getElementById(`provider-${ncc.name}`);
      //lọc ra các account thuộc các provider tương ứng
      const filterCards = card.filter((c) => c.provider.name === ncc.name);

      let cardRender = await cardContainer(filterCards);
      providerContainer.innerHTML = cardRender;
    }
  }

  clickEvenCard();
  handleAddAcountFunction()

}



async function cardContainer(filterCards) {

  let cardRender = filterCards
    .map((card) => {
      if (card.detail.account_name && card.detail.bank_name) {
        // xử lý lấy API từ mảng level
        const levels = card.account_levels
          .map((level) => level.name)
          .join(", ");
        // xử lý lấy API từ mảng có phần tử hoặc không
        let maxPerDay = "Không có dữ liệu";
        if (
          card.limits &&
          card.limits.length > 0 &&
          card.limits[0].max_per_day
        ) {
          maxPerDay = card.limits[0].max_per_day.toLocaleString("en-US");
        }
        //   xử lý lấy API bị lồng mảng trong nhiều object
        let amounts = "0 VND";
        if (
          card.daily_amount &&
          card.daily_amount.TOP_UP &&
          card.daily_amount.TOP_UP.detail.length > 0
        ) {
          amounts =
            card.daily_amount.TOP_UP.detail[0].amount.toLocaleString(
              "es-US"
            ) + " VND";
        }

        let isActive = card.status === true ? "checked" : "";

        return `
             <div class="card__item__container">
                                <div class="card__item__header">
                                    <div class="content--header">
                                        <div class="h3__bank">
                                        <h3>${card.detail.bank_name} </h3>&nbsp;&nbsp;
                                        <h3> - </h3>&nbsp;&nbsp;
                                        <h3>${card.detail.account_name}</h3>
                                        </div>
                                        
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
                                        <p>${card.detail.bank_name}</p>
                                    </div>
                                    <!-- 2 -->
                                    <div class="horizontal__item">
                                        <p>
                                            Chủ tài khoản
                                        </p>
                                        <p>${card.detail.account_name}</p>
                                    </div>
                                    <!-- 3 -->
                                    <div class="horizontal__item">
                                        <p>
                                            Số tài khoản
                                        </p>
                                        <p>${card.detail.account_number}</p>
                                    </div>
                                    <!-- 4 -->
                                    <div class="horizontal__item">
                                        <p>
                                            Gán cho level
                                        </p>
                                        <p>${levels}</p>
                                    </div>
                                    <!-- 5 -->
                                    <div class="horizontal__item">
                                        <p>
                                            Hạn mức/ngày
                                        </p>
                                        <p> ${maxPerDay}VND</p>
                                    </div>
                                    <!-- 6 -->
                                    <div class="horizontal__item">
                                        <p>
                                            Đã top-up/ngày
                                        </p>
                                        <p>${amounts} VND</p>
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
                                            <input type="checkbox" ${isActive}>
                                            <span class="slider round" style="height: 34px;"></span>

                                        </label>
                                    </div>

                                </div>
                            </div>
        `;
      } else if (card.detail.account_name) {
        // xử lý lấy API từ mảng level
        const levels = card.account_levels
          .map((level) => level.name)
          .join(", ");
        // xử lý lấy API từ mảng có phần tử hoặc không
        let maxPerDay = "Không có dữ liệu";
        if (
          card.limits &&
          card.limits.length > 0 &&
          card.limits[0].max_per_day
        ) {
          maxPerDay = card.limits[0].max_per_day.toLocaleString("en-US");
        }
        //   xử lý lấy API bị lồng mảng trong nhiều object
        let amounts = "0 VND";
        if (
          card.daily_amount &&
          card.daily_amount.TOP_UP &&
          card.daily_amount.TOP_UP.detail.length > 0
        ) {
          amounts =
            card.daily_amount.TOP_UP.detail[0].amount.toLocaleString(
              "es-US"
            ) + " VND";
        }

        let isActive = card.status === true ? "checked" : "";

        return `
                 <div class="card__item__container">
                                <div class="card__item__header">
                                    <div class="content--header">
                                        <h3>${card.detail.account_name} </h3>
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
                                            Ewallet
                                        </p>
                                        <p>${card.provider.name}</p>
                                    </div>
                                    <!-- 2 -->
                                    <div class="horizontal__item">
                                        <p>
                                            Email
                                        </p>
                                        <p>${card.detail.email}</p>
                                    </div>
                                    <!-- 3 -->
                                    
                                    <!-- 4 -->
                                    <div class="horizontal__item">
                                        <p>
                                            Gán cho level
                                        </p>
                                        <p>${levels}</p>
                                    </div>
                                    <!-- 5 -->
                                    <div class="horizontal__item">
                                        <p>
                                            Hạn mức/ngày
                                        </p>
                                        <p>${maxPerDay} USD</p>
                                    </div>
                                    <!-- 6 -->
                                    <div class="horizontal__item">
                                        <p>
                                            Đã top-up/ngày
                                        </p>
                                        <p>${amounts} USD</p>
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
                                            <input type="checkbox" ${isActive}>
                                            <span class="slider round" style="height: 34px;"></span>

                                        </label>
                                    </div>

                                </div>
                            </div>
                `;
      } else if (!card.detail.account_name && !card.detail.bank_name) {
        // xử lý lấy API từ mảng level
        const levels = card.account_levels
          .map((level) => level.name)
          .join(", ");
        // xử lý lấy API từ mảng có phần tử hoặc không
        let maxPerDay = "Không có dữ liệu";
        if (
          card.limits &&
          card.limits.length > 0 &&
          card.limits[0].max_per_day
        ) {
          maxPerDay = card.limits[0].max_per_day.toLocaleString("en-US");
        }
        //   xử lý lấy API bị lồng mảng trong nhiều object
        let amounts = "0 VND";
        if (
          card.daily_amount &&
          card.daily_amount.TOP_UP &&
          card.daily_amount.TOP_UP.detail.length > 0
        ) {
          amounts =
            card.daily_amount.TOP_UP.detail[0].amount.toLocaleString(
              "es-US"
            ) + " VND";
        }

        let isActive = card.detail.active === true ? "checked" : "";
        let isActiveVndw = card.detail.vndw === true ? "checked" : "";
        let isActiveVndy = card.detail.vndy === true ? "checked" : "";


        //  xử lý lấy balance
        let balance = Number(card.detail.balance).toLocaleString("en-US") + " VND";


        return `
                <div class="card__item__container">
                               <div class="card__item__header">
                                   <div class="content--header">
                                       <h3>${card.provider.name} </h3>
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
                                           Wallet
                                       </p>
                                       <p>${card.provider.name}</p>
                                   </div>
                                   <!-- 2 -->
                                   <div class="horizontal__item">
                                       <p>
                                           Số dư
                                       </p>
                                       <p>${balance}</p>
                                   </div>
                                   <!-- 4 -->
                                   <div class="horizontal__item">
                                       <p>
                                           Đã rút
                                       </p>
                                       <p>VND</p>
                                   </div>
                                   <!-- 5 -->
                                   <!-- 6 -->
                                   <!-- 7 -->
                                   <div class="horizontal__item">
                                       <p>
                                           Active
                                       </p>
                                       <label class="switch">
                                           <input type="checkbox" ${isActive}>
                                           <span class="slider round" style="height: 34px;"></span>

                                       </label>
                                   </div>
                                   <!-- 8 -->
                                   <div class="horizontal__item">
                                       <p>
                                           Rút VNDW tự dộng
                                       </p>
                                       <label class="switch">
                                           <input type="checkbox" ${isActiveVndw}>
                                           <span class="slider round" style="height: 34px;"></span>

                                       </label>
                                   </div>
                                   <!-- 9 -->
                                   <div class="horizontal__item">
                                       <p>
                                           Rút VNDY tự dộng
                                       </p>
                                       <label class="switch">
                                           <input type="checkbox" ${isActiveVndy}>
                                           <span class="slider round" style="height: 34px;"></span>

                                       </label>
                                   </div>

                               </div>
                           </div>
               `;
      }
    })
    .join("");

  return cardRender;

}

//Xử lý nút thêm tài khoản
function handleAddAcountFunction() {
  const modalAdd = document.querySelector('.modal_add_account_bank_container')
  const addAccountBtn = document.querySelectorAll('.addAccountBtn');

  addAccountBtn.forEach((btn) => {
    btn.addEventListener('click', () => {
      console.log('ok');
      modalAdd.classList.toggle('show')
    })
  })

}