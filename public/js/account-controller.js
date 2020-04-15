var SushiCat = SushiCat || {};

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

export function getUsername() {
    return session.userProfileModel.username;
}

$(document).ready(function () {

})
