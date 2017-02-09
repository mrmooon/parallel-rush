define(['Phaser', 'game'], function (Phaser, game) {
    
    function cookieLevel (){
        var lvl = this.checkCookie();
    
        if (lvl == -1) {
            this.updateCookie(1);
        } else {
            this.updateCookie(lvl);
        }
    }
    
    cookieLevel.prototype.checkCookie = function() {
        var nivel = this.getCookie();
        if (nivel != "")
            return parseInt(nivel);
        else
            return -1;
    }
    
    cookieLevel.prototype.updateCookie = function(lvl) {
        var d = new Date();
        d.setTime(d.getTime() + (24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = "nivel = "+lvl+ ";" + expires + ";path=/";
        this.level = lvl;

    }

    cookieLevel.prototype.getCookie = function () {
        var x = document.cookie;
        var res = x.split(";");
        console.log(res);
        for (i in res){
            value = res[i].split("=");
            if (value[0] ==  "nivel"){
                console.log(value[1]);
                return value[1];
            }
        }
        return "";
    }
    
    return cookieLevel;
});
