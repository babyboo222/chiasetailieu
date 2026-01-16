var token = localStorage.getItem("token");
async function getUrlThanhToan(){
    if(token === null){
        alert("hãy đăng nhập để sử dụng chức năng này")
        window.location.href = 'login';return;
    }
    var user = JSON.parse(localStorage.getItem("user"));
    if(user.authorities.name == 'ROLE_ADMIN'){
        alert("Bạn đang đăng nhập với admin")
        window.location.href = 'login';return;
    }

    var con = confirm('Bạn xác nhận thanh toán các khóa học này?')
    if(con == false){
        return;
    }
    if(localStorage.getItem("cartkh") == null){
        toastr.warning("Không có khóa học nào trong giỏ hàng");
        return;
    }
    var list = JSON.parse(localStorage.getItem("cartkh"));
    if(list.length == 0){
        toastr.warning("Không có khóa học nào trong giỏ hàng");
        return;
    }
    var tong = 0;
    var listId = [];
    for(i=0; i<list.length; i++){
        tong = Number(tong) + Number(list[i].price)
        listId.push(list[i].id);
    }

    var url = 'http://localhost:8080/api/user/checkCourseUser';
    const resp = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(listId)
    });
    if(resp.status == exceptionCode){
        var result = await resp.json();
        toastr.warning(result.errorMessage);
        return;
    }

    var returnurl = 'http://localhost:8080/thanhcong';
    var urlpayment = 'http://localhost:8080/api/user/urlpayment';
    var paymentDto = {
        "amount":tong,
        "content":"thanh toán khóa học",
        "returnUrl":returnurl,
        "notifyUrl":returnurl
    }
    const res = await fetch(urlpayment, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(paymentDto)
    });
    var result = await res.json();
    window.open(result.url, '_blank');
}


async function checkPayment() {
    var list = JSON.parse(localStorage.getItem("cartkh"));
    var uls = new URL(document.URL)
    var vnpOrderInfo = uls.searchParams.get("vnpOrderInfo");
    var amount = uls.searchParams.get("vnp_Amount");
    var listIdcourse = [];
    for(i=0; i<list.length; i++){
        listIdcourse.push(list[i].id)
    }
    const currentUrl = window.location.href;
    const parsedUrl = new URL(currentUrl);
    const queryStringWithoutQuestionMark = parsedUrl.search.substring(1);
    var urlVnpay = queryStringWithoutQuestionMark
    var orderDto = {
        "orderId":vnpOrderInfo,
        "requestId":vnpOrderInfo,
        "amount":amount,
        "idCourse":listIdcourse,
        "urlVnpay":urlVnpay,
    }
    var url = 'http://localhost:8080/api/user/checkPayment';
    var token = localStorage.getItem("token");
    const res = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(orderDto)
    });
    var result = await res.text();
    // if(result == 0){
    //     document.getElementById("thatbai").style.display = 'none'
    //     document.getElementById("thanhcong").style.display = 'block'
    // }
    if(result == 1){
        document.getElementById("thatbai").style.display = 'block'
    }
    if(result == 2){
        window.location.href = 'taikhoan?#khoahoc'
    }
}
