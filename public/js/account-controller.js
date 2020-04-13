var SushiCat = SushiCat || {};

SushiCat.Controller = function () {
    this.localStorageKey = "SushiCat profile";
    this.save= {};
};

function getServerData () {
    var session = SushiCat.Session.getInstance().get();
}

function uploadServerData (data) {

}

$(document).ready(function () {

})