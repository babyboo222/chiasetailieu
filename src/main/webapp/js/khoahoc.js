var size = 8
var sortb = ''
async function loadDanhSachKhoaHoc(page){
    var uls = new URL(document.URL)
    var category = uls.searchParams.get("category");
    var sort = document.getElementById("sorts").value
    var url = 'http://localhost:8080/api/public/allCourseByUser?size='+size+'&page='+page+'&sort='+sort;
    if(category != null){
        url += '&category='+category
    }
    const response = await fetch(url, {
        method: 'GET'
    });
    var result = await response.json();
    console.log(result)
    var list = result.content;
    var totalPage = result.totalPages 
    var totalElements = result.totalElements
    var main = '';
    for (i = 0; i < list.length; i++) {
        var dm = ''
        for(j=0; j<list[i].courseCategories.length; j++){
            dm += `<a href="?category=${list[i].courseCategories[j].category.id}" class="tagcauhoi">.${list[i].courseCategories[j].category.name}</a> `
        }
        main += `<div class="col-sm-6 col-md-3 col-lg-3">
                    <div class="singlekhoahoc">
                        <a href="gioithieukhoahoc?id=${list[i].id}"><img class="imgtl" src="${list[i].linkImage}"></a>
                        <div class="noidungkhview">
                            <a href="gioithieukhoahoc?id=${list[i].id}" class="tentailieu">${list[i].name}</a><br>
                            <div class="d-flexs">
                                <span class="giaitentl">${formatmoney(list[i].price)}</span>
                                <span class="tstailieu"><i class="fa fa-eye"></i> ${list[i].numberView}</span>
                                <span class="tstailieu"><i class="fa fa-user"></i> ${list[i].numberUser}</span>
                            </div>
                            <div class="listtag">
                                ${dm}
                            </div>
                        </div>
                        <button onclick="themGioHang(${list[i].id})" class="btncart"><i class="fa fa-shopping-cart"></i> Thêm vào giỏ hàng</button>
                    </div>
                </div>`
    }
    document.getElementById("listkhoahoc").innerHTML = main

    var mainpage = ''
    for(i=1; i<= totalPage; i++){
        mainpage += `<li onclick="loadDanhSachKhoaHoc(${Number(i)-1})" class="page-item"><a class="page-link" href="#listsp">${i}</a></li>`
    }
    document.getElementById("listpage").innerHTML = mainpage

}

async function loadDanhMuc(type) {
    var url = 'http://localhost:8080/api/public/findCategoryByType?type='+type;
    const response = await fetch(url, {
        method: 'GET'
    });
    var list = await response.json();
    console.log(list)
    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<option value="${list[i].id}">${list[i].name}</option>`
    }
    document.getElementById("listdm").innerHTML = main
    const ser = $("#listdm");
    ser.select2({
        placeholder: "Chọn tag cho câu hỏi",
    });
}

function locKhoaHoc(){
    var category = document.getElementById("listdm").value;
    window.location.href = '?category='+category
}


async function chiTietKhoaHoc(){
    var uls = new URL(document.URL)
    var id = uls.searchParams.get("id");
    var url = 'http://localhost:8080/api/public/courseByUser?id='+id
    const response = await fetch(url, {
        method: 'GET'
    });
    var result = await response.json();
    document.getElementById("tenbaihocgt").innerHTML = result.name
    document.getElementById("sobaihoc").innerHTML = result.numberUnit
    document.getElementById("sohocvien").innerHTML = result.numberUser
    document.getElementById("ngaycapnhat").innerHTML = result.updateDate ==null?result.createdDate:result.updateDate
    document.getElementById("giatienkhgt").innerHTML = formatmoney(result.price)
    document.getElementById("btnthemgh").onclick = function(){themGioHang(result.id);}
    document.getElementById("btnmuangay").onclick = async function(){
        themGioHang(result.id);
        await new Promise(r => setTimeout(r, 500));
        window.location.href = 'giohang'
    }
    document.getElementById("noidunghoc").innerHTML = result.content

    var listca = '';
    for(i=0; i<result.courseCategories.length; i++){
        listca += `<a href="khoahoc?category=${result.courseCategories[i].category.id}" class="poiter">${result.courseCategories[i].category.name}</a>`
        if(i != result.courseCategories.length -1){
            listca += `, `
        }
    }
    document.getElementById("danhmuckhgt").innerHTML = listca

    url = 'http://localhost:8080/api/public/unitByCourse?courseId='+id
    const res = await fetch(url, {
        method: 'GET'
    });
    var list = await res.json();
    var main = ''
    for(i=0; i<list.length; i++){
        main += `<tr><th>${list[i].name}</th></tr>`
    }
    document.getElementById("tablendkhoahoc").innerHTML = main
}

async function loadDanhMucGt(type) {
    var url = 'http://localhost:8080/api/public/findCategoryByType?type='+type;
    const response = await fetch(url, {
        method: 'GET'
    });
    var list = await response.json();
    console.log(list)
    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<li><i class="fa fa-folder-open-o"></i> <a href="khoahoc?category=${list[i].id}">${list[i].name}</a></li>`
    }
    document.getElementById("listdm").innerHTML = main
}


function formatmoney(money) {
    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      });
    return VND.format(money);
}


async function khoaHocCuaToi(page){
    var url = 'http://localhost:8080/api/user/courseUserByUser?size=8&page='+page;
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
        })
    });
    var result = await response.json();
    console.log(result)
    var list = result.content;
    var totalPage = result.totalPages 
    var totalElements = result.totalElements
    var main = '';
    for (i = 0; i < list.length; i++) {
        var dm = ''
        for(j=0; j<list[i].course.courseCategories.length; j++){
            dm += `<a href="khoahoc?category=${list[i].course.courseCategories[j].category.id}" class="tagcauhoi">.${list[i].course.courseCategories[j].category.name}</a> `
        }
        main += `<div class="col-sm-6 col-md-3 col-lg-3">
                    <div class="singlekhoahoc">
                        <a href="chitietkhoahoc?courseuser=${list[i].id}"><img class="imgtl" src="${list[i].course.linkImage}"></a>
                        <div class="noidungkhview">
                            <a href="chitietkhoahoc?courseuser=${list[i].id}" class="tentailieu">${list[i].course.name}</a><br>
                            <div class="d-flexs">
                                <span class="giaitentl">${formatmoney(list[i].course.price)}</span>
                            </div>
                            <span class="ngaydkikh">Ngày đăng ký: ${list[i].createdDate}</span><br>
                            <span class="ngaydkikh">Số bài học: ${list[i].course.numberUnit}</span>
                            <div class="listtag">${dm}</div>
                        </div>
                        <button class="btncart">Đang học (${list[i].listUnit == null?'':list[i].listUnit.split(",").length}/${list[i].course.numberUnit})</button>
                    </div>
                </div>`
    }
    document.getElementById("listkhoahoc").innerHTML = main

    var mainpage = ''
    for(i=1; i<= totalPage; i++){
        mainpage += `<li onclick="khoaHocCuaToi(${Number(i)-1})" class="page-item"><a class="page-link poiter" >${i}</a></li>`
    }
    document.getElementById("listpagekh").innerHTML = mainpage

}


async function loadChiTietKhoaHoc(){
    var uls = new URL(document.URL)
    var courseuserId = uls.searchParams.get("courseuser");
    var id = uls.searchParams.get("id");
    if(courseuserId == null){
        window.location.replace('taikhoan#khoahoc')
    }
    var url = 'http://localhost:8080/api/user/detailCourseUser?id='+courseuserId;
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
        })
    });
    var result = await response.json();
    console.log(result)
    if(response.status > 300){
        window.location.replace('taikhoan#khoahoc')
        return;
    }
    document.getElementById("tenbaihoc").innerHTML = result.course.name
    url = 'http://localhost:8080/api/public/unitByCourse?courseId='+result.course.id;
    const res = await fetch(url, {
        method: 'GET'
    });
    var list = await res.json();
    var main = ''
    for(i=0; i<list.length;i++){
        main += `<li><a href="?courseuser=${courseuserId}&id=${list[i].id}">${list[i].name}</a></li>`
    }
    document.getElementById("ullistbaihoc").innerHTML = main
    document.getElementById("ullistbaihocphu").innerHTML = main
    if(id == null){
        window.location.href = `?courseuser=${courseuserId}&id=${list[0].id}`;return;
    }
    var unit = null;
    for(i=0; i<list.length;i++){
        if(list[i].id == id){
            unit = list[i];
        }
    }
    document.getElementById("noidungchinh").innerHTML = unit.content
    if(unit.questionUnit != null && unit.questionUnit != ""){
        document.getElementById("question").innerHTML = unit.questionUnit
    }
    if(unit.linkFileQuestion != null && unit.linkFileQuestion != ""){
        document.getElementById("linkfilehuongdan").innerText = 'Tải file câu hỏi'
        document.getElementById("linkfilehuongdan").href = unit.linkFileQuestion
    }
    if(unit.answerGuide != null && unit.answerGuide != ""){
        document.getElementById("noidunghd").innerHTML = unit.answerGuide
    }
    if(unit.linkFileGuide != null && unit.linkFileGuide != ""){
        document.getElementById("noidunghd").innerHTML += `<br><a target="_blank" class="poiter" href="${unit.linkFileGuide}">Xem file hướng dẫn</a>`
    }

    if(result.point != null || result.point != ""){
        document.getElementById("btndanhgiakh").style.display = 'none'
        document.getElementById("sotraloidung").innerHTML = result.numberTrue
        document.getElementById("sotraloisai").innerHTML = result.numberFalse
        document.getElementById("pointer").innerHTML = Number(result.point).toFixed(1)
        document.getElementById("mucdo").innerHTML = tinhMucDo(Number(result.point))
        document.getElementById("sotraloidungs").innerHTML = result.numberTrue
        document.getElementById("sotraloisais").innerHTML = result.numberFalse
        document.getElementById("pointers").innerHTML = Number(result.point).toFixed(1)
        document.getElementById("mucdos").innerHTML = tinhMucDo(Number(result.point))
    }

    var listUnit = result.listUnit;
    if(listUnit == null){
            listUnit = id;
    }
    else{
        var arrs = listUnit.split(",");
        var check = false;
        for(i=0; i<arrs.length; i++){
            if(Number(arrs[i]) == Number(id)){
                check = true;
            }
        }
        if(check == false){
            listUnit += ', '+id;
        }
        else{
            return;
        }
    }
    console.log(listUnit)

    await new Promise(r => setTimeout(r, 10000));
    var url = 'http://localhost:8080/api/user/updateListUnit?id='+courseuserId+'&listUnit='+listUnit;
    const resp = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
        })
    });
}


function tinhMucDo(point){
    var mucDo = ''
    if(point < 40){
        mucDo = 'kém'
    }
    else if(point < 65 && point >= 40){
        mucDo = 'Trung bình'
    }
    else if(point < 80 && point >= 65){
        mucDo = 'Khá'
    }
    else if(point > 80){
        mucDo = 'Tốt'
    }
    return mucDo;
}

function chuyenDanhGiaKhoaHoc(){
    var con = confirm("Sau khi làm bài trắc nghiệm, bạn sẽ không thể làm lại được nữa. Bạn chắc chắn muốn làm bài đánh giá cuối cùng?")
    if(con == false){
        return;
    }
    var uls = new URL(document.URL)
    var courseuserId = uls.searchParams.get("courseuser");
    window.location.href = 'tracnghiem?courseuser='+courseuserId;
}

async function loadDsUnit(){
    var uls = new URL(document.URL)
    var courseuserId = uls.searchParams.get("courseuser");
    if(courseuserId == null){
        window.location.replace('taikhoan#khoahoc')
    }
    var url = 'http://localhost:8080/api/user/detailCourseUser?id='+courseuserId;
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
        })
    });
    var result = await response.json();
    console.log(result)
    if(response.status > 300){
        window.location.replace('taikhoan#khoahoc')
        return;
    }
    if(result.point != null){
        alert('Bạn đã làm bài test rồi, không được làm lại nữa');
        history.go ( -1); Location.reload ();
    }
    document.getElementById("tenbaihoc").innerHTML = result.course.name
    url = 'http://localhost:8080/api/public/unitByCourse?courseId='+result.course.id;
    const res = await fetch(url, {
        method: 'GET'
    });
    var list = await res.json();
    var main = ''
    for(i=0; i<list.length;i++){
        main += `<li><a href="chitietkhoahoc?courseuser=${courseuserId}&id=${list[i].id}">${list[i].name}</a></li>`
    }
    document.getElementById("ullistbaihoc").innerHTML = main
    loadCauHoi(result.course.id);
}

var listcauhoi = []
async function loadCauHoi(courseId){
    var url = 'http://localhost:8080/api/user/findExerciseByCourseUser?id='+courseId;
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
        })
    });
    var list = await response.json();
    var main = ''
    for(i=0; i<list.length; i++){
        listcauhoi.push(list[i])
        var ct = list[i].courseExAnswers;
        var mui = ''
        for(j=0; j<ct.length; j++){
            mui += `<div class="col-sm-3"><input value="${ct[j].id}" type="radio" id="cdr${ct[j].id}" name="cau${list[i].id}"><label for="cdr${ct[j].id}">${ct[j].answer}</label></div>`
        }
        main += `<div class="singlechtn">
                    <p class="tench">Câu ${Number(i)+1}: ${list[i].question}</p>
                    <div class="listdapdan row">
                    ${mui}
                    </div>
                    <span id="dapand${list[i].id}"><p class="dungctl"></p></span>
                </div>`
    }
    document.getElementById("listchtracnghiem").innerHTML = main;
}

async function xacNhan(){
    var uls = new URL(document.URL)
    var courseuserId = uls.searchParams.get("courseuser");
    for(i=0; i<listcauhoi.length; i++){
        var dapanchon = $('input[name="cau'+listcauhoi[i].id+'"]:checked').val();
        if(dapanchon == undefined){
            alert("câu số "+(Number(i)+1)+" chưa chọn đáp án")
            return;
        }
    }
    var numDung = 0;
    var numSai = 0;
    for(i=0; i<listcauhoi.length; i++){
        var dapanchon = $('input[name="cau'+listcauhoi[i].id+'"]:checked').val();
        var check = false;
        for(j=0; j<listcauhoi[i].courseExAnswers.length; j++){
            if(listcauhoi[i].courseExAnswers[j].id == dapanchon){
                if(listcauhoi[i].courseExAnswers[j].isTrue == true){
                    check = true;
                }
            }
        }
        if(check == true){
            document.getElementById("dapand"+listcauhoi[i].id).innerHTML = `<p class="dungctl">Đúng</p>`
            numDung = Number(numDung) + 1;
        }
        if(check == false){
            document.getElementById("dapand"+listcauhoi[i].id).innerHTML = `<p class="saictl">Sai</p>`
            numSai = Number(numSai) + 1;
        }
    }
    document.getElementById("divketquatongket").style.display = 'block'
    document.getElementById("sotraloidung").innerHTML = numDung
    document.getElementById("sotraloisai").innerHTML = numSai

    var point =  Number(numDung) / Number(listcauhoi.length) * 100
    document.getElementById("pointer").innerHTML = point.toFixed(1)
    var mucDo = ''
    if(point < 40){
        mucDo = 'kém'
    }
    else if(point < 65 && point >= 40){
        mucDo = 'Trung bình'
    }
    else if(point < 80 && point >= 65){
        mucDo = 'Khá'
    }
    else if(point > 80){
        mucDo = 'Tốt'
    }
    document.getElementById("mucdo").innerHTML = mucDo

    var url = 'http://localhost:8080/api/user/updatePointCourseUser?id='+courseuserId+'&point='+point+
    '&numtrue='+numDung+'&numfalse='+numSai;
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
        })
    });
    if(response.status < 300){
        swal({
            title: "Thông báo", 
            text: "Chúc mừng bạn đã hoàn thành bài kiểm tra", 
            type: "success"
          },
        function(){ 
            
        });
    }
}


async function khoaHocBanChay(){
    var url = 'http://localhost:8080/api/public/allCourseByUser?size=5&page=0&sort=numberUser,desc';
    const response = await fetch(url, {
        method: 'GET'
    });
    var result = await response.json();
    var list = result.content;
    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<a href="gioithieukhoahoc?id=${list[i].id}" class="linkcourse" style="margin-top:20px"><div class="single-course">
                    <div class="row">
                        <div class="col-4">
                            <img class="imgcourse" src="${list[i].linkImage}">
                        </div>
                        <div class="col-8">
                            <span class="name-couse">${list[i].name}</span><br>
                            <span class="price-course">${formatmoney(list[i].price)}</span>
                            <span class="date-course">${list[i].createdDate}</span>
                        </div>
                    </div>
                </div></a>`
    }
    document.getElementById("list-course-right").innerHTML = main
}