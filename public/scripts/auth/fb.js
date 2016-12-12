function registration_fb() {
    FB.login(function (res) {
        if (res && !res.error) {
            FB.api('/me?fields=id,first_name,last_name', function (res) {
                var username = res.first_name + " " + res.last_name;
                var password = res.id;
                $.ajax({
                    url: "/registration",
                    method: "POST",
                    data: {
                        username: username,
                        password: password
                    },
                    complete: function () {
                    },
                    statusCode: {
                        200: function () {
                            window.location.href = "/ide";
                        },
                        403: function (jqXHR) {
                        }
                    }
                });
            });
        }
    }, {scope: 'public_profile'});
}


function login_fb() {
    FB.login(function (res) {
        if (res && !res.error) {
            FB.api('/me?fields=id,first_name,last_name', function (res) {
                var username = res.first_name + " " + res.last_name;
                var password = res.id;

                $.ajax({
                    url: "/login",
                    method: "POST",
                    data: {
                        username: username,
                        password: password
                    },
                    complete: function () {
                    },
                    statusCode: {
                        200: function () {
                            window.location.href = "/ide";
                        },
                        403: function (jqXHR) {
                        }
                    }
                });
            });
        }
    }, {scope: 'public_profile'});
}