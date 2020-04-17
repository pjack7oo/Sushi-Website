var SushiCat = SushiCat || {};
var rollUrl = "http://localhost:5000/api/account/rolls",
    logoutUrl = "http://localhost:5000/api/account/logoff";
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
            $(document).ready(function(){
                populateRolls(data);
            })
            
        }
    })
}

function drawAccount() {
    var user = JSON.parse(localStorage.getItem('sushicat-session'));
    var $username = document.getElementById("accountUsername");
    if (user) {
        console.log(user);
        // var para = document.createElement("p");
        // var node = document.createTextNode(user.userProfileModel.username);
        // para.appendChild(node);
        document.getElementById("accountUsername").innerHTML = "<b>Username: </b>" + user.userProfileModel.username;
        document.getElementById("accountEmail").innerHTML = "<b>Email: </b>" + user.userProfileModel.email;
        document.getElementById("accountName").innerHTML = "<b>Name: </b>" + user.userProfileModel.name;
        createAccountControlResetPassword();
        createAccountControlClearSave();
    }

}
function createAccountControlClearSave() {
    var accountButtons = document.getElementById('accountButtons');
    var element = document.getElementById("clearSave");
    if (typeof(element)!= 'undefined' && element != null){
        return;
    }
    
    var clearSaveBtn = document.createElement("button");
    clearSaveBtn.innerHTML= "Clear Save";
    clearSaveBtn.id = "clearSave";
    clearSaveBtn.style.padding = "10px 10px";
    clearSaveBtn.onclick = clearSave;
    accountButtons.appendChild(clearSaveBtn);
}
function createAccountControlResetPassword() {
    var accountButtons = document.getElementById('accountButtons');
    var element = document.getElementById("resetPasswordbtn");
    if (typeof(element)!= 'undefined' && element != null){
        return;
    }
    
    var resetPasswordBtn = document.createElement("button");
    resetPasswordBtn.innerHTML= "Reset Password";
    resetPasswordBtn.id = "resetPasswordbtn";
    resetPasswordBtn.style.padding =  "10px 10px";
    resetPasswordBtn.style.margin = "10px"
    resetPasswordBtn.onclick = resetPassword;
    accountButtons.appendChild(resetPasswordBtn);
}
function clearAccount() {
    document.getElementById("accountUsername").innerHTML = "<b>Username: </b>";
    document.getElementById("accountEmail").innerHTML = "<b>Email: </b>";
    document.getElementById("accountName").innerHTML = "<b>Name: </b>";
    var buttons = document.getElementById('accountButtons');
    buttons.removeChild(document.getElementById("resetPasswordbtn"));
    buttons.removeChild(document.getElementById("clearSave"));
}

function logOut() {
    $.ajax({
        type:'POST',
        url: logoutUrl,
        success: function(response) {
            console.log(response);
            localStorage.removeItem('sushicat-session');
            clearAccount();
        }
    })
}

$(document).ready(function() {
    var user = JSON.parse(localStorage.getItem('sushicat-session'));
    if (user) {
        if(user.keepSignedIn == false) {
            logOut();
        }
    }
});

function populateRolls(data){
    var rollContainer = document.getElementById('SpecificRolls');
    var data = JSON.parse(data);
    
    
    for (let roll of data){
        var item            = document.createElement('div'),
            itemContent     = document.createElement('div'),
            itemDescription = document.createElement('div'),
            itemBox         = document.createElement('div'),
            itemIngredients = document.createElement('div'),
            itemImg         = document.createElement('div'),
            itemInner       = document.createElement('div'),
            itemOuter       = document.createElement('div');

        
        
        item.className            = "learn-item";
        itemContent.className     = 'content';
        itemDescription.className = 'rollDescription';
        itemBox.className         = "box1";
        itemIngredients.className = 'rollIngredients';
        itemImg.className         = 'Image';
        itemInner.className       = 'nestedRollIngrd';
        itemOuter.className       = 'nestedRollIngrd';
        
        var rollName = document.createElement('p');
            rollName.innerHTML = roll.name;
        item.appendChild(rollName);

        var description = document.createElement('p');
        description.innerHTML = roll.description;
        description.align = "center";
        itemDescription.appendChild(description);

        var innerDescription = document.createElement('p');
        innerDescription.innerHTML = "Inner Ingredients";
        itemInner.appendChild(innerDescription);
        for(let ingrd of roll.inner){
            var para =document.createElement('p');
            
            para.innerHTML = ingrd;
            itemInner.appendChild(para);
        }
        var outerDescription = document.createElement('p');
        outerDescription.innerHTML = "Outer Ingredients";
        itemOuter.appendChild(outerDescription);
        for(let ingrd of roll.outer){
            var para =document.createElement('p');
            
            para.innerHTML = ingrd;
            itemOuter.appendChild(para);
        }
        var base64Flag = 'data:image/png;base64,';
        var imgStr = bufferToBase64(roll.image.data.data);
        var str = base64Flag+imgStr;
        var img = document.createElement('img');
        img.src = str;
        itemImg.appendChild(img);
        //TODO store and retrieve img of roll
        itemIngredients.appendChild(itemInner);
        itemIngredients.appendChild(itemOuter);
        itemBox.appendChild(itemIngredients);
        itemBox.appendChild(itemImg);
        itemContent.appendChild(itemDescription);
        itemContent.appendChild(itemBox);
        item.appendChild(itemContent);
        rollContainer.appendChild(item);
    }   
}

function bufferToBase64(buffer) {
    var binary = '';
    var bytes = [].slice.call(new Uint8Array(buffer));

    bytes.forEach((b)=>{binary += String.fromCharCode(b)});

    return window.btoa(binary);
}


