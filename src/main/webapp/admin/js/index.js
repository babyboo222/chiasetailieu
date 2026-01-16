var token = localStorage.getItem("token");

async function thongke(){

    var url = 'http://localhost:8080/api/public/countUser';
    const res = await fetch(url, {
        method: 'GET'
    });
    var result = await res.text();
    document.getElementById("sltaikhoan").innerHTML = result

    var url = 'http://localhost:8080/api/public/countDocument';
    const resp = await fetch(url, {
        method: 'GET'
    });
    var result = await resp.text();
    document.getElementById("sltailieu").innerHTML = result

    var url = 'http://localhost:8080/api/public/countQuestion';
    const respo = await fetch(url, {
        method: 'GET'
    });
    var result = await respo.text();
    document.getElementById("slquest").innerHTML = result


    var url = 'http://localhost:8080/api/admin/newUser';
    const respons = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        }),
    });
    var list = await respons.json();
    var main = ''
    for(i=0; i<list.length; i++){
        main += ` <tr>
                    <td>${list[i].email}</td>
                    <td>${list[i].username}</td>
                    <td>${list[i].createdDate}</td>
                </tr>`
    }
    document.getElementById("listnewUser").innerHTML = main
    document.getElementById("numnewuser").innerHTML = list.length
}