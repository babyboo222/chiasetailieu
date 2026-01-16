var token = localStorage.getItem("token");
async function loadDanhSachUser() {
    $('#example').DataTable().destroy();
    var url = 'http://localhost:8080/api/admin/getUserByRole';
    var role = document.getElementById("role").value
    if(role != ""){
        url += '?role='+role
    }
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    var listUser = await response.json();
    console.log(listUser)
    var main = '';
    var activebtn = 'btn btn-primary'
    var activename = 'khóa'
    var activeicon = 'fa fa-lock'
    var type = 1;
    for (i = 0; i < listUser.length; i++) {
        if(listUser[i].actived == 0){
            activebtn = 'btn btn-danger'
            activename = 'mở khóa'
            activeicon = 'fa fa-unlock'
            type = 0;
        }
        else{
            activebtn = 'btn btn-primary'
            activename = 'khóa'
            activeicon = 'fa fa-lock'
            type = 1;
        }
        var btn = `<td><button onclick="lockOrUnlock(${listUser[i].id},${type})" class="${activebtn}"><i class="${activeicon}"></i> ${activename}</button></td>`
        if(listUser[i].authorities.name == "ROLE_ADMIN"){
            btn = '<td></td>'
        }
        var gioitinh = listUser[i].gender == 0 ? "Nam":"Nữ"
        main += `<tr>
                    <td>${listUser[i].id}</td>
                    <td><img src="${listUser[i].avatar}" style="width: 60px"></td>
                    <td>${listUser[i].username}</td>
                    <td>${listUser[i].email}</td>
                    <td>${listUser[i].fullname}</td>
                    <td>${gioitinh}</td>
                    <td>${listUser[i].phone}</td>
                    <td>${listUser[i].createdDate}</td>
                    <td>${listUser[i].authorities.name}</td>
                    ${btn}
                </tr>`
    }
    document.getElementById("listuser").innerHTML = main
    $('#example').DataTable();
}

async function lockOrUnlock(id, type) {
    var con = confirm("Xác nhận hành động?");
    if(con == false){
        return;
    }
    var url = 'http://localhost:8080/api/admin/activeUser?id=' + id;
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status < 300) {
        var mess = '';
        if(type == 1){
            mess = 'Khóa thành công'
        }
        else{
            mess = 'Mở khóa thành công'
        }
        swal({
            title: "Thông báo", 
            text: mess, 
            type: "success"
          },
        function(){ 
            window.location.reload();
        });
    }
    else {
        swal({
            title: "Thông báo", 
            text: "hành động thất bại", 
            type: "error"
          },
        function(){ 
            window.location.reload();
        });
    }
}


async function themTaiKhoanAdmin() {
   
}