async function dangKy() {
    var url = 'http://localhost:8080/api/regis'
    var username = document.getElementById("username").value
    var fullname = document.getElementById("fullname").value
    var email = document.getElementById("email").value
    var password = document.getElementById("password").value
    var user = {
        "username": username,
        "fullname": fullname,
        "email": email,
        "avatar": 'https://creazilla-store.fra1.digitaloceanspaces.com/icons/7912642/avatar-icon-md.png',
        "password": password
    }
    if(password === ""){
        alert("mật khẩu không được để trống!")
        return;
    }
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(user)
    });
    var result = await response.json();
    if(response.status < 300){
        swal({
            title: "Thông báo", 
            text: "đăng ký thành công! hãy check email của bạn!", 
            type: "success"
          },
        function(){ 
            window.location.href = 'xacthuc?email='+result.email
        });
    }
    if(response.status == exceptionCode){
        toastr.warning(result.errorMessage);
    }
}

function loadEmailFromUrl(){
    var uls = new URL(document.URL)
    var email = uls.searchParams.get("email");
    document.getElementById("email").value = email;
}

async function xacThucTaiKhoan(){
    var email = document.getElementById("email").value;
    var key = document.getElementById("maxacthuc").value;
    var url = 'http://localhost:8080/api/active-account?email='+email+'&key='+key
    const res = await fetch(url, {
        method: 'POST'
    });
    if(res.status < 300){
        swal({
            title: "Thông báo",text: "Xác nhận tài khoản thành công!",type: "success"
          },
        function(){ 
            window.location.href = 'login'
        });
    }
    if(res.status == exceptionCode){
        var result = await res.json()
        toastr.warning(result.errorMessage);
    }
}

async function dangNhap() {
    var url = 'http://localhost:8080/api/login'
    var username = document.getElementById("username").value
    var password = document.getElementById("password").value
    var user = {
        "username": username,
        "password": password
    }
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(user)
    });
    var result = await response.json(); 
    if(response.status < 300){
        localStorage.setItem("user",JSON.stringify(result.user));
        localStorage.setItem("token",result.token);
        if(result.user.authorities.name === "ROLE_ADMIN"){
            window.location.href = 'admin/index';
        }
        if(result.user.authorities.name === "ROLE_USER"){
            window.location.href = 'index';
        }
    }
    if(response.status == exceptionCode){
       if(result.errorCode == 300){
        swal({
            title: "Thông báo",text: "Tài khoản chưa được kích hoạt, đi tới kích hoạt tài khoản!",type: "warning"
          },function(){ 
                window.location.href = 'xacthuc?email='+result.errorMessage.split("-")[1]
            });
       }
       else{
            toastr.warning(result.errorMessage);
       }
    }
}


async function loadThongTinTaiKhoan(){
    var token = localStorage.getItem("token");
    if(token == null){
        window.location.replace('login')
    }
    var user = JSON.parse(localStorage.getItem("user"));
    console.log(user)
    if(user != null){
        document.getElementById("fullname").value = user.fullname
        document.getElementById("phone").value = user.phone
        document.getElementById("gender").value = user.gender
        document.getElementById("email").value = user.email
        document.getElementById("avatarpre").src = user.avatar
        linkavatar = user.avatar
    }
}

async function doiMatKhau() {
    var token = localStorage.getItem("token");
    var oldpass = document.getElementById("oldpass").value
    var newpass = document.getElementById("newpass").value
    var renewpass = document.getElementById("renewpass").value
    var url = 'http://localhost:8080/api/user/changePassword?old='+oldpass+"&new="+newpass;
    if(newpass != renewpass){
        alert("mật khẩu mới không trùng khớp");
        return;
    }
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status < 300) {
        swal({
                title: "Thông báo",
                text: "cập nhật mật khẩu thành công, hãy đăng nhập lại",
                type: "success"
            },
            function(){
                window.location.reload()
            });
    }
    if (response.status == exceptionCode) {
        var result = await response.json()
        toastr.warning(result.errorMessage);
    }
}

var linkavatar = ''
async function capNhatThongTin() {
    var token = localStorage.getItem("token");
    document.getElementById("loading").style.display = 'block'

    const filePath = document.getElementById('chonfileavatar')
    const formData = new FormData()
    formData.append("file", filePath.files[0])
    var urlUpload = 'http://localhost:8080/api/public/upload';
    const res = await fetch(urlUpload, {
        method: 'POST',
        body: formData
    });
    if(res.status < 300){
        linkavatar = await res.text();
    }

    var url = 'http://localhost:8080/api/user/updateUser';
    var fullname = document.getElementById("fullname").value
    var phone = document.getElementById("phone").value
    var email = document.getElementById("email").value

    var userDto = {
        "fullname":fullname,
        "phone":phone,
        "email":email,
        "avatar":linkavatar
    }

    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(userDto)
    });
    if (response.status < 300) {
        toastr.warning("Cập nhật thông tin thành công!");
        var urlAccount = 'http://localhost:8080/api/user/userlogged';
        const res = await fetch(urlAccount, {
            method: 'GET',
            headers: new Headers({'Authorization': 'Bearer '+token})
        });
        var account = await res.json();
        localStorage.setItem("user",JSON.stringify(account))
        window.location.reload();
    }
    if (response.status == exceptionCode) {
        var result = await response.json()
        toastr.warning(result.errorMessage);
    }
    document.getElementById("loading").style.display = 'none'
}


async function quenMatKhau(){
    var email = document.getElementById("email").value
    var url = 'http://localhost:8080/api/forgot-password?email='+email
    const res = await fetch(url, {
        method: 'POST'
    });
    if(res.status < 300){
        swal({
            title: "", 
            text: "mật khẩu mới đã được gửi về email của bạn", 
            type: "success"
          },
        function(){ 
            window.location.replace("login")
        });
    }
    if (res.status == exceptionCode) {
        var result = await res.json()
        toastr.warning(result.errorMessage);
    }
}