var signIn = "http://localhost:5000/api/account/login",
    sessionTimeout = 1000*60*60*24;

$(document).ready(function () {
    
    
    $('#login-submit').click(function() {
        console.log("Signing in");
        var $ctnErr = $('#login-ctn-err'),
            $txtUsername = $('#login-username'),
            $txtPassword = $('#login-password'),
            $keepsignedIn = document.getElementById('checkedLogin');
        
        var username = $txtUsername.val().trim(),
            password = $txtPassword.val().trim(),
            invisibleStyle = 'bi-invisible',
            invalidInputStyle = 'bi-invalid-input';
        
        $ctnErr.removeClass().addClass(invisibleStyle);
        $ctnErr.hide().slideUp();    

        $.ajax({
            
            type: 'POST',
            url: signIn,
            data: "username=" + username + "&password=" + password,
            success: function (resp) {
                console.log("success signin");
                console.log(resp);
                
                if ( resp.success == true) {
                    var today = new Date(),
                        expirationDate = new Date();
                    expirationDate.setTime(today.getTime() + sessionTimeout);
                    
                    SushiCat.Session.getInstance().set({
                        userProfileModel: resp.extras.userProfileModel,
                        sessionId: resp.extras.sessionId,
                        expirationDate: expirationDate,
                        keepSignedIn: $keepsignedIn.checked
                    });
                    drawAccount();
                    document.getElementById('login').style.display='none';
                    return;
                } else {
                    
                        switch (resp.extras.msg) {
                            case SushiCat.ApiMessages.DB_ERROR:
                                $ctnErr.html("<p> Oops! SushiCat had a problem and can't login right now. Try again in a bit.");
                                $ctnErr.addClass("bi-ctn-err").slideDown();
                                break;
                            case SushiCat.ApiMessages.INVALID_PWD:
                            default:
                            case SushiCat.ApiMessages.USERNAME_NOT_FOUND:
                                $ctnErr.html("<p>You entered a wrong username or password.  Please try again.</p>");
                                $ctnErr.addClass("bi-ctn-err").slideDown();
                                $txtUsername.addClass(invalidInputStyle);
                                $txtPassword.addClass(invalidInputStyle);
                                break;

                        }
                    
                }
            },
            error: function (e) {

                $txtUsername.val("");
                $txtPassword.val("");
                console.log(e.message);
                $ctnErr.html("<p> SushiCat had a problem and can't login right now. Try again in a bit.");
                $ctnErr.addClass("bi-ctn-err").slideDown();
            }
        })
        
        
    })
})