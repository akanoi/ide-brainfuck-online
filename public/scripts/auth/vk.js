var User = require('../../../models/user').User;
var HttpError = require('../../../error').HttpError;
var AuthError = require('../../../models/user').AuthError;


function init_vk() {
    VK.init({
        apiId: 5772693
    });

}


function registration_vk() {
    VK.Auth.login(function (res) {
        if (!res.session) {
            alert("Error :(");
            return;
        }

        var username = res.session.user.first_name + " " + res.session.user.last_name;
        var password = res.session.user.id;


        $.ajax({
            url: "/registration",
            method: "POST",
            data: {
                username: username,
                password: password
            },
            complete: function () {},
            statusCode: {
                200: function () {
                    window.location.href = "/ide";
                },
                403: function (jqXHR) {}
            }
        });
    });
}


function login_vk() {
    VK.Auth.login(function (res) {
        if (!res.session) {
            alert("Error :(");
            return;
        }

        var username = res.session.user.first_name + " " + res.session.user.last_name;
        var password = res.session.user.id;

        $.ajax({
            url: "/login",
            method: "POST",
            data: {
                username: username,
                password: password
            },
            complete: function () {},
            statusCode: {
                200: function () {
                    window.location.href = "/ide";
                },
                403: function (jqXHR) {}
            }
        });
    });
}