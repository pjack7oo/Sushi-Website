var resetPasswordUrl =
  "https://sushicat-meow.herokuapp.com/api/account/resetpassword"; //"http://localhost:5000/api/account/resetpassword";
var clearSaveDataUrl =
  "https://sushicat-meow.herokuapp.com/api/account/clearSave"; //"http://localhost:5000/api/account/clearSave";
var deleteAccountUrl = "https://sushicat-meow.herokuapp.com/api/account/delete";

function resetPassword() {
  document.getElementById("resetPassword").style.display = "block";
}
$(document).ready(function () {
  $("#resetPassword-submit").click(function () {
    console.log("Reseting Password");
    var $ctnErr = $("#resetPassword-ctn-err"),
      $txtnewPassword = $("#newPassword"),
      $txtnewPasswordConfirm = $("#newPasswordConfirm");

    var newPassword = $txtnewPassword.val().trim(),
      newPasswordConfrim = $txtnewPasswordConfirm.val().trim(),
      invisibleStyle = "bi-invisible",
      invalidInputStyle = "bi-invalid-input";
    $ctnErr.removeClass().addClass(invisibleStyle);
    $ctnErr.hide().slideUp();
    var user = JSON.parse(localStorage.getItem("sushicat-session"));
    var username = user.userProfileModel.username;

    if (!passwordsMatch(newPassword, newPasswordConfrim)) {
      $ctnErr.html("<p>Your passwords don't match.</p>");
      $ctnErr.addClass("bi-ctn-err").slideDown();
      $txtPassword.addClass(invalidInputStyle);
      $txtPasswordConfirm.addClass(invalidInputStyle);
      return;
    }
    $.ajax({
      type: "POST",
      url: resetPasswordUrl,
      data:
        "username=" +
        username +
        "&newPassword=" +
        newPassword +
        "&newPasswordConfirm=" +
        newPasswordConfrim,
      success: function (resp) {
        console.log(resp);
        document.getElementById("resetPassword").style.display = "none";
        if (resp.success == true) {
          console.log(resp);
        } else {
          switch (resp.extras.msg) {
            case SushiCat.ApiMessages.PASSWORD_CONFIRM_MISMATCH:
              $ctnErr.html(
                "<p>You passwords didn't match.  Please try again.</p>"
              );
              $ctnErr.addClass("bi-ctn-err").slideDown();
              $txtnewPassword.addClass(invalidInputStyle);
              $txtnewPassword.addClass(invalidInputStyle);
              break;
          }
        }
      },
      error: function (error) {
        console.log(e.message);
        $ctnErr.html(
          "<p>Oops! SushiCat had a problem and could not reset your password.  Please try again in a few minutes.</p>"
        );
        $ctnErr.addClass("bi-ctn-err").slideDown();
      },
    });
  });
});
function clearSave() {
  console.log("clearing save");

  var $ctnErr = $("#account-ctn-err");
  var user = JSON.parse(localStorage.getItem("sushicat-session"));
  var username = user.userProfileModel.username;
  $.ajax({
    type: "POST",
    url: clearSaveDataUrl,
    data: "username=" + username,
    success: function (resp) {
      if (resp.success == true) {
        $ctnErr.html("<p>SushiCat has cleared your save.</p>");
        $ctnErr.addClass("bi-ctn-err").slideDown();
        localStorage.removeItem("gameData");
        location.reload();
        return true;
      }
    },
    error: function (error) {
      console.log(e.message);
      $ctnErr.html(
        "<p>Oops! SushiCat had a problem and could not clear your save.  Please try again in a few minutes.</p>"
      );
      $ctnErr.addClass("bi-ctn-err").slideDown();
    },
  });
}

function deleteAccount() {
  var $ctnErr = $("#account-ctn-err");
  var user = JSON.parse(localStorage.getItem("sushicat-session"));
  var username = user.userProfileModel.username;
  $.ajax({
    type: "POST",
    url: deleteAccountUrl,
    data: "username=" + username,
    success: function (resp) {
      if (resp.success == true) {
        $ctnErr.html("<p>SushiCat has deleted your account.</p>");
        $ctnErr.addClass("bi-ctn-err").slideDown();
        localStorage.removeItem("sushicat-session");
        location.reload();
        return true;
      }
    },
    error: function (error) {
      console.log(error.message);
      $ctnErr.html(
        "<p>Oops! SushiCat had a problem and could not delete your account.  Please try again in a few minutes.</p>"
      );
      $ctnErr.addClass("bi-ctn-err").slideDown();
    },
  });
}
