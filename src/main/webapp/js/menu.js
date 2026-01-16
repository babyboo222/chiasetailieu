const exceptionCode = 417;
var token = localStorage.getItem("token");
async function loadMenu(){
    var t ='Tài khoản';
    var avt ='image/user.png';
    if(localStorage.getItem('user') != null){
        t = JSON.parse(localStorage.getItem('user')).username
        avt = JSON.parse(localStorage.getItem('user')).avatar
    }
    var dn = `<div class="dropdown usermenuinfor">
                <a class="texts" href="#" id="tttaikhoan" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src="${avt}" class="imgmenu"> ${t}
                </a>
                <ul class="dropdown-menu" aria-labelledby="tttaikhoan">
                    <li class="li-drop"><a class="dropdown-item" href="taikhoan"><img src="image/user.png" class="imgmenu"> Thông tin tài khoản</a></li>
                    <li class="li-drop"><a class="dropdown-item" href="taikhoan#cauhoi"><img src="image/quest.jpg" class="imgmenu"> Câu hỏi</a></li>
                    <li class="li-drop"><a class="dropdown-item" href="taikhoan#tailieu"><img src="image/doc.png" class="imgmenu"> Tài liệu</a></li>
                    <li onclick="dangXuat()" class="li-drop"><a class="dropdown-item" href="#"><img src="image/logout.png" class="imgmenu"> Đăng xuất</a></li>
                </ul>
            </div>`
    if(token == null){
        dn = `<li class="licartmenu"><a class="lidangnhapmenu" href="login">Đăng nhập</a></li>`
    }
    var menu = `<a href="index" class="tieudelogo"><img class="poiter" src="image/logo.ico"> Diễn đàn</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul id="navchinh" class="navbar-nav me-auto mb-5 mb-lg-0">
        <li class="nav-item"><a class="nav-link menucha" href="index">Hỏi đáp</a></li>
        <li class="nav-item"><a class="nav-link menucha" href="tailieu">Tài liệu</a></li>
        <form onsubmit="return(timKiemInput());" class="s_search" id="frmtimkiem">
            <i class="fa fa-search"></i>
            <input name="search" placeholder="Tìm kiếm" class="search-menu">
            <select id="t" class="chonloaiTk">
                <option value="cau_hoi">Câu hỏi</option>
                <option value="tai_lieu">Tài liệu</option>
            </select>
        </form>
    </ul>
    <div id="dflex" class="d-flex">
        ${dn}
        <button onclick="window.location.href='dangtailieu'" class="btnuploadbt-top"><i class="fa fa-cloud-upload"></i> Tải lên</button>
    </div>
    </div>`
    document.getElementById("menus").innerHTML = menu
    checkroleAdmin();
}

function timKiemInput(){
    var frm = document.getElementById('frmtimkiem') || null;
    if(frm) {
        var t = document.getElementById("t").value
        if(t == 'cau_hoi'){
            frm.action = 'index' 
        }
        if(t == 'tai_lieu'){
            frm.action = 'tailieu' 
        }
        if(t == 'khoa_hoc'){
            frm.action = 'khoahoc' 
        }
    }
}

async function loadMenuTrai(){
    var menutrai =
    `
    <p class="publict">CỘNG ĐỒNG</p>
    <div class="listmenu-left">
        <a href="index" class="menu-left"><img src="image/war.png"> Hỏi đáp</a><br>
        <a href="tailieu" class="menu-left mnleft">Tài liệu</a><br>
    </div>
    <p class="publict">CHIA SẺ</p>
    <div class="bto">
        <b>Diễn đàn học tập - chia sẻ tài liệu</b>
        <span> – Bắt đầu cộng tác và chia sẻ kiến ​​thức của bạn với mọi người.</span>
        <img src="image/banner-left.svg">
        <button onclick="window.location.href='dangtailieu'" class="btnuploadbt">Đăng tải tài liệu</button>
    </div>`
    document.getElementById("danhmuctrai").innerHTML = menutrai
}

async function dangXuat(){
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.replace("logout")
}

async function checkroleUser(){
    var token = localStorage.getItem("token");
    var url = 'http://localhost:8080/api/user/check-role-user';
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if(response.status > 300){
        window.location.replace('login')
    }
}

async function checkroleAdmin(){
    var token = localStorage.getItem("token");
    var url = 'http://localhost:8080/api/admin/check-role-admin';
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if(response.status < 300){
        window.location.replace('admin/index')
    }
}



