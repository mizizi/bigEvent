$(function () {
    let form = layui.form
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return "昵称长度大于6位"
            }
        }
    })
    function render() {
        $.ajax({
            type: 'GET',
            url: '/login/moment',
            headers: {
                Authorization: sessionStorage.getItem('token')
            },
            success: function (res) {
                console.log(res);
                if (res.status === 401 && res.msg == '当前登录失败，token失效了！') {
                    sessionStorage.removeItem('token')
                    location.href = '../home/login.html'
                } else if (res.status === 200) {
                    let data1 = res.result
                    $('#username1').val(`${data1.name}`)
                    // $('#nickname1').val(`${data1[0].nickname}`)
                    // $('#email1').val(`${data1[0].email}`)
                }
            }
        })
    }
    $('#btn-submit').on('click', function (e) {
        e.preventDefault()
        let userinfodata = {
            username: $('#username1').val(),
            nickname: $('#nickname1').val(),
            email: $('#email1').val()
        }
        $.ajax({
            type: 'POST',
            url: '/users/update',
            data: userinfodata,
            success: function (res) {
                window.parent.getUserInfo()
            }
        })
    })
    $('#btn-reset').on('click', function (e) {
        e.preventDefault()
        render()
    })
    render()
})