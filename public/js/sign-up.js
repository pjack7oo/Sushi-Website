

// (function () {

// })();
    
var usernameIsValid = function (username) {
    return username.length < 10;
}

var emailAddressIsValid = function (email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

var passwordsMatch = function (password, passwordConfirm) {
    return password === passwordConfirm;
}

var passwordIsComplex = function(password) {
    //todo set some rules
    return true;
}

$(document).ready(function() {
    $('#register-submit').click(function() {
        //console.log("register");
        var $ctnErr = $('#ctn-err'),
            $txtEmail = $('#txt-email'),
            $txtName  = $('#txt-name'),
            $txtUname = $('#txt-username'),
            $txtPassword = $('#txt-password'),
            $txtPasswordConfirm = $('#txt-password-confirm');

        var name = $txtName.val().trim(),
            email = $txtEmail.val().trim(),
            username = $txtUname.val().trim(),
            password = $txtPassword.val().trim(),
            passwordConfirm = $txtPasswordConfirm.val().trim(),
            invalidInput = false,
            invisibleStyle = "bi-invisible",
            invalidInputStyle = "bi-invalid-input";

        $ctnErr.removeClass().addClass(invisibleStyle);
        $ctnErr.hide().slideUp();

        // if (name.length === 0) {
        //     $txtName.addClass(invalidInputStyle);
        //     invalidInput = true;
        // }

        if(!emailAddressIsValid(email)) {
            $ctnErr.html("<p>Please enter a valid email address.</p>");
            $ctnErr.addClass("bi-ctn-err").slideDown();
            $txtEmail.addClass(invalidInputStyle);
            return;
        }
        if (!usernameIsValid(username)) {
            $ctnErr.html("<p>Please enter a valid username under 10 characters.</p>");
            $ctnErr.addClass("bi-ctn-err").slideDown();
            $txtUname.addClass(invalidInputStyle);
            return;
        }

        if(!passwordsMatch(password, passwordConfirm)) {
            $ctnErr.html("<p>Your passwords don't match.</p>");
            $ctnErr.addClass("bi-ctn-err").slideDown();
            $txtPassword.addClass(invalidInputStyle);
            $txtPasswordConfirm.addClass(invalidInputStyle);
            return;
        }

        if(!passwordIsComplex(password)) {
            $ctnErr.html("<p>Your password is very easy to guess.  Please try a more complex password.</p>");
            $ctnErr.addClass("bi-ctn-err").slideDown();
            $txtPassword.addClass(invalidInputStyle);
            $txtPasswordConfirm.addClass(invalidInputStyle);
            return;
        }

        $.ajax({
            type: 'POST',
            url: "http://localhost:5000"
        })
    })
})