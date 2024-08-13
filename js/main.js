const dropdownButton = document.querySelectorAll(".btn-drop");
const dropdownMenu = document.querySelectorAll(".dropdown-menu");
const noidung = document.querySelectorAll(".noidung");
const btnAdd = document.querySelector(".btn-add-currency");
const emailInput = document.querySelector('[name = " emailInput"]');
const btnAddCurrency = document.querySelector(".btn-add-currency");
const hanmucContainer = document.querySelector(".hanmucContainer");
const containerModal = document.querySelector(".container-modal");
const currencyValue = document.querySelector('[name = "reset-inpuutCrr]');
const crrContainer = document.querySelectorAll("crrContainer")

// mảng lưu trữ các giá trị Currency đã chọn
let selectedValue = [];


// nút X
const btnX = document.querySelector(".imghd");
// body
const body = document.querySelector(".body");
// nút đông ý
const btnDongy = document.querySelector(".btn-dongy");
// nút hủy
const btnHuy = document.querySelector(".btn-huy");
// modal
const container = document.querySelector('.container')
// btnModal
const btnModal = document.querySelector('.btnModal');
// modal
const modal = document.querySelector('.modal')

// vòng lặp để hiện menu
// xử lý xóa chữ hiện có để thay thế chữ được click trong menu
dropdownButton.forEach((button, index) => {
  const menu = dropdownMenu[index];
  const content = noidung[index];

  button.addEventListener("click", () => {
    console.log("da an nut");
    menu.classList.toggle("show");
  });

  menu.addEventListener("click", (e) => {
    if (e.target.tagName === "P") {
      content.textContent = e.target.textContent;
      const value = e.target.getAttribute('data-currency')
      selectedValue.push(value);
      menu.classList.remove("show");
      valueChecktoRemove()
    }
  });
});


// xử lý đã có giá trị nào trong currency thì ẩn ở menu và khi chọn hết cá giá trị thì disable nút ADD
// function valueChecktoRemove() {
//   dropdownMenu.forEach((menu) => {
//     const items = menu.querySelectorAll('p')
//     console.log('items', items);
//     items.forEach((item) => {
//       const value = item.getAttribute('data-currency')

//       if (selectedValue.includes(value)) {
//         item.classList.add('hide')
//         console.log('value', item);
//       }
//       else {
//         item.classList.remove('hide')
//       }
//     })
//   })
// }

// Xử lý đóng modal khi ấn nút
btnX.addEventListener("click", () => {
  // container.classList.remove("show");
  containerModal.classList.remove("show");
  resetForm();
  removeExtraInputs()
});

// xử lý ấn nút Modal thì mở body
btnModal.addEventListener('click', (e) => {
  // container.classList.add("show");
  containerModal.classList.add("show");
  // xử lý tắt modal thì sau khi mở lên tự động cuộn lên trên cùng
  container.scrollTop = 0
  console.log('btnModal', containerModal.classList.add("show"));

})

// xử lý ấn nút Hủy thì đóng modal
btnHuy.addEventListener('click', () => {
  containerModal.classList.remove("show");
  resetForm();
  removeExtraInputs();
})

// xử lý kích ra ngoài modal thì tắt modal
window.addEventListener('click', (e) => {
  if (e.target === containerModal) {
    containerModal.classList.remove("show");
    resetForm();
    removeExtraInputs();
    console.log('Tat Modal');
  }
})


// xử lý nếu ấn ra ngoài menu hoặc nút drop thì sẽ tắt menu
document.addEventListener("click", (e) => {
  dropdownMenu.forEach((menu, index) => {
    const button = dropdownButton[index];
    if (
      !button.contains(e.target)
      && !menu.contains(e.target)
    ) {
      menu.classList.remove('show')
    }
  })
});

// hàm reset các giá trị trong tất cả các ô input về '' khi bị tắt modal
function resetForm() {
  const inputs = document.querySelectorAll('.reset-inpuut')
  inputs.forEach(input => {
    if (input.type === 'checkbox') {
      input.checked = false
    }
    input.value = ''
  })

  const paragraph = document.querySelectorAll('[name="reset-inpuut"]')
  paragraph.forEach(input => {
    input.textContent = 'Chọn loại ví'
  })

  const paragraphCrr = document.querySelectorAll('[name="reset-inpuutCrr"]')
  paragraphCrr.forEach(input => {
    input.textContent = ''
  })
}

function removeExtraInputs() {
  const hanmucInputs = document.querySelectorAll('.hanmucInput')
  hanmucInputs.forEach((input, index) => {
    if (index > 0) {
      input.remove();
    }
  })
}


// thêm thẻ div input khi ấn nút
btnAddCurrency.addEventListener("click", () => {
  const newHanmucInput = document.createElement("div");
  newHanmucInput.className = "hanmucInput";
  newHanmucInput.innerHTML = `
                    <div class="input1">
                        <input class="reset-inpuut" placeholder="0" type="number" >
                    </div>

                    <div class="input2">
                        <p name="reset-inpuut" class="noidung"></p>
                        <button class="btn-drop">
                            <img src="./assests/svg/dropdownicon.svg">
                        </button>

                        <ul class="dropdown-menu">
                            <li class="crrContainer">
                                <p data-currency="USD">USD</p>
                            </li>
                            <li class="crrContainer">
                                <p data-currency="GDP">GDP</p>
                            </li>
                            <li class="crrContainer">
                                <p data-currency="EUR">EUR</p>
                            </li>
                        </ul>
                    </div>
  `;
  hanmucContainer.appendChild(newHanmucInput)

  // Xử lý khi click vào các btn-drop trong các hanmucInput mới
  const dropdownButton = newHanmucInput.querySelector(".btn-drop");
  const dropdownMenu = newHanmucInput.querySelector(".dropdown-menu");
  const noidung = newHanmucInput.querySelector(".noidung");

  dropdownButton.addEventListener("click", () => {
    dropdownMenu.classList.add("show");
  });

  dropdownMenu.addEventListener("click", (e) => {
    if (e.target.tagName === "P") {
      noidung.textContent = e.target.textContent;
      dropdownMenu.classList.remove("show");
    }
  });
  // xử lý xóa chữ hiện có để thay thế chữ được click trong menu
  document.addEventListener('click', (e) => {
    if (
      !dropdownButton.contains(e.target)
      &&
      !dropdownMenu.contains(e.target)
    ) {
      dropdownMenu.classList.remove("show");
    }
  })
});
