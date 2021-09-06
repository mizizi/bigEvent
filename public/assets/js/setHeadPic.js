function setHeadPic(avatar_url, name) {
    if (!avatar_url) {
        $('.text-avatar').html(`${name.substr(0, 1)}`).show().siblings('img').hide()
    }
    else {
        $('.text-avatar').hide().siblings('img').attr('src', `${avatar_url}`).show()
    }
}