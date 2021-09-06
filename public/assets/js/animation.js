$(function () {
    $('#signin').on('click', function () {
        $('.container').removeClass('right-panel-active')
    })
    $('#signup').on('click', function () {
        $('.container').addClass('right-panel-active')
    })
    $('#signin-form').on('submit', function (e) {
        e.preventDefault()
    })
    $('#signup-form').on('submit', function (e) {
        e.preventDefault()
    })
})