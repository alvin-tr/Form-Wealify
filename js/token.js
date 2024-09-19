fetch('https://dev-api.wealify.com/api/v1/cms/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(userInfo)
})

fetch('https://dev-api.wealify.com/api/v1/cms/refresh-token', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 'refresh': authTokens.refresh })
});

fetch("https://dev-api.wealify.com/api/v1/cms/system-payments",
    {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    }
);

fetch("https://dev-api.wealify.com/api/v1/cms/constants/providers", {
    method: "GET",
    headers: {
        "content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
})

function fetchAPI(url, options) {
    fetch(url, {
        method: options.method,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    })
}

function getProvider() {
    fetchAPI('')
}

// điểm chung:
// 1: đều chung domain
// 2: đều có header cho biết dữ liệu ở định dạng json
// 3: hai cái cuối dùng thêm acccessToken để xác thực


//1, tìm hiểu body trong fetch để làm gì và dùng khi nào
//2, xem lại video rest và destructuring trong es6