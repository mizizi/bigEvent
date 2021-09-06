
$(() => {
    //登录表单校验
    $('#signin-password').on('blur', function () {
        let inpval = $('#signin-password').val() || $('#signup-password').val()
        let reg = /^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9]{8,18}$/;
        if (reg.test(inpval)) {
            // 登录
            $('#signin-form').on('submit', function (e) {
                e.preventDefault()
                let data = $('#signin-form').serialize()
                console.log(data);
                $.post('/login', data, function (res) {
                    console.log(res);
                    sessionStorage.setItem("token", res.token)
                    if (res.status === 200) {
                        location.href = './index.html'
                    } else {
                        sendTips(res.msg)
                    }
                })
                $('#signin-form')[0].reset()
            })
        }
        else {
            sendTips('密码格式不正确')
        }
    })
    // 注册表单校验
    $('#signup-password').on('blur', function () {
        let inpval = $('#signup-password').val()
        let reg = /^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9]{8,18}$/;
        if (reg.test(inpval)) {
            // 注册
            $('#signup-form').on('submit', function (e) {
                e.preventDefault()
                let data = $('#signup-form').serialize()
                if ($('#signup-password').val() !== $('#surepsd').val()) {
                    return sendTips('两次输入密码不一致')
                }
                $.post('/users', data, function (res) {
                    if (res.status == 200) {
                        $('#signin').click()
                        $('#signin-username').val($('#signup-username').val())
                        $('#signin-password').val($('#signup-password').val())
                        $('#signin-password').focus()
                        $('#signup-form')[0].reset()
                    } else {
                        sendTips(res.msg)
                    }
                })
            })
        } else {
            sendTips('密码格式不正确')
        }
    })
    $('input').on('keyup', function (e) {
        if (e.keyCode == 13) {
            console.log($(this).parents('div').siblings('button')[0]);
            $(this).blur()
            $(this).parents('div').siblings('button')[0].click()
        }
    })
    function sendTips(msg) {
        $('.layer').show().html(msg)
        let timer = setTimeout(function () {
            $('.layer').hide()
        }, 2000)
    }
})