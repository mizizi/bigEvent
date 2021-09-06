$(function () {
    let form = layui.form
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同！'
            }
        },
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致！'
            }
        }
    })
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        let data = {
            oldPassword: $('#lastpsd').val(),
            newPassword: $('#newpsd1').val()
        }
        $.ajax({
            type: 'POST',
            url: '/users/changePsd',
            data,
            async: false,
            headers: {
                Authorization: sessionStorage.getItem('token')
            },
            success: function (res) {
                console.log(res);
                if (res.status === 400) {
                    console.log(res.message);
                } else if (res.status === 200 && res.msg == '修改密码成功') {
                    sessionStorage.removeItem('token')
                    parent.location.reload();
                }
            }
        })
    })
})