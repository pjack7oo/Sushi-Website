var SushiCat = SushiCat || {};
var rollUrl = "http://localhost:5000/api/account/rolls";
SushiCat.Controller = function () {
    this.localStorageKey = "SushiCat profile";
    this.save= {};
};


SushiCat.Controller.getSaveData = function (successCallback, errCallback) {
    var session = SushiCat.Session.getInstance().get();

    if (!session) {
        return errCallback({
            err: SushiCat.ApiMessages.SESSION_NOT_FOUND
        });
    }
    
}



function uploadServerData (data) {

}

function getUsername() {
    return session.userProfileModel.username;
}

function getRolls() {
    $.ajax({
        type:'GET',
        url: rollUrl,
        success: function(response) {
            
            var data = JSON.stringify(response.extras.rollList);
            
            localStorage.setItem('rollList',data);
            console.log("loaded rolllist into localStorage");
            
        }
    })
}
