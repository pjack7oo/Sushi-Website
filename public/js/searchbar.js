function setUpSearch() {

    //console.log(rollsLoaded);
    
    if (rollsLoaded) {
        $('#submitSearch').click(function() {
            var $input = $('#searchText');
            //var specificRolls = document.getElementById("SpecificRolls");
            var rolls = document.getElementsByName("roll");
            //console.log(rolls);
            var tags = document.getElementsByTagName("a");
            var input = $input.val().trim();
            var length = tags.length;
            if (input !==""){
            for (let i = 0; i < length; i++){
                //console.log(tags[i].name == input);
                
                if (tags[i].name == input) {
                    window.location.hash = tags[i].name;
                    var item = tags[i].parentElement;
                    if (!$(item).hasClass('learnActive')) {
                        $(item).toggleClass('learnActive');
                    }
                    
                    
                }
                
                
            }
            }

            // for (let i = 0; i < length; i++){
            //     var tag = rolls[i].getElementsByTagName("a");
            //     if (tag.name == input){
            //         console.log(tag.name, input);
                    
            //         window.location.hash = tag.id;
            //     }
            // }
        });
    }
}