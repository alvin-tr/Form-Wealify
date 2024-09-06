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

fetch("https://dev-api.wealify.com/api/v1/cms/constants/providers", {
  method: "GET",
  headers: {
    "content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
})
  .then((response) => {
    return response.json();
  })
  .then(({ data }) => {
    console.log("NCC:", data);
    providerList(data);
    console.log(" providerList(data)", providerList(data));
  })
  .catch((error) => {
    console.error("Lỗi khi gọi dữ liệu:", error);
  });

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
                            <button>THÊM TÀI KHOẢN</button>
                        </div>

                    <div class="card__item__container--grand" id="provider-${ncc.name}">
                    
                    
                        
                    </div>

                    </div>


                </div>



            </div>
        `;
  }).join("");

  contentContainer.appendChild(container);

  for (const ncc of NCCS) {
    if (ncc.name !== "Wealify") {
      let providerContainer = document.getElementById(`provider-${ncc.name}`);
      let cardRender = await cardContainer(ncc.name);
      providerContainer.innerHTML = cardRender;
    }
  }

  clickEvenCard();
}

async function cardContainer(providerName) {
  let card = [];

  try {
    const response = await fetch(
      "https://dev-api.wealify.com/api/v1/cms/system-payments",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    const result = await response.json();
    card = result.data;
    console.log("cardokenh: ", card);

    const filteredCards = card.filter((c) => c.provider.name === providerName);

    let cardRender = filteredCards
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
        }
      })
      .join("");

    return cardRender;
  } catch (error) {
    console.log("Can not render data:", error);
    return "";
  }
}
