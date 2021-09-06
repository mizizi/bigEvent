$(() => {
    getUserInfo()
    $('#exit').on('click', function () {
        let layer = layui.layer
        layer.confirm('是否退出登录', { icon: 3, title: '提示' }, function (index) {
            sessionStorage.removeItem('token')
            location.href = '../home/login.html'
            layer.close(index)
        })

    })
})
function getUserInfo() {
    $.ajax({
        type: 'GET',
        url: '/login/moment',
        headers: {
            Authorization: sessionStorage.getItem('token')
        },
        success: async function (res) {
            if (res.status === 401 && res.message == '未授权,无效token') {
                sessionStorage.removeItem('token')
                location.href = '../home/login.html'
            } else if (res.status === 200) {
                let data = res.result
                setHeadPic(res.result.avatar_url, res.result.name)
                $('.welcome').html(`欢迎您  ${data.name}`)
            }
        }
    })
}