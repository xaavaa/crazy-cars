//This will use the demo backend if you open index.html locally via file://, otherwise your server will be used
let backendUrl = location.protocol === 'file:' ? "https://tiktok-chat-reader.zerody.one/" : undefined;
let connection = new TikTokIOConnection(backendUrl);

// Counter
let viewerCount = 0;
let likeCount = 0;
let diamondsCount = 0;

// These settings are defined by obs.html
if (!window.settings) window.settings = {};



$(document).ready(() => {
    $('#connectButton').click(connect);
    $('#stopButton').click(endConnection);
    $('#uniqueIdInput').on('keyup', function (e) {
        if (e.key === 'Enter') {
            connect();
        }
        sortTops();
        showTops();
    });

    if (window.settings.username) connect();

    var dict = {
        alemania: 0,
        arabia: 0,
        china: 0,
        eeuu : 0,
        espana: 0,
        francia: 0,
        india: 0,
        inglaterra: 0,
        ucrania: 0
      };

    
})

Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
    get: function(){
        return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
    }
})

var tempLikes = 0;
function connect() {
    updateGifter("hasbullah_fan", "eeuu");
    playVideo("videos/usa/"+1+".mp4",1,"usa");
    let uniqueId = window.settings.username || $('#uniqueIdInput').val();
    if (uniqueId !== '') {

        $('#stateText').text('Connecting...');

        connection.connect(uniqueId, {
            enableExtendedGiftInfo: true
        }).then(state => {
            // reset stats
            viewerCount = 0;
            likeCount = 0;
            diamondsCount = 0;
            updateRoomStats();

        }).catch(errorMessage => {
            $('#stateText').text(errorMessage);

            // schedule next try if obs username set
            if (window.settings.username) {
                setTimeout(() => {
                    connect(window.settings.username);
                }, 30000);
            }
        })

    } else {
        alert('no username entered');
    }
}

// Prevent Cross site scripting (XSS)
function sanitize(text) {
    return text.replace(/</g, '&lt;')
}

function updateRoomStats() {
    $('#roomStats').html(`Viewers: <b>${viewerCount.toLocaleString()}</b> Likes: <b>${likeCount.toLocaleString()}</b> Earned Diamonds: <b>${diamondsCount.toLocaleString()}</b>`)
}

function generateUsernameLink(data) {
    return `<a class="usernamelink" href="https://www.tiktok.com/@${data.uniqueId}" target="_blank">${data.uniqueId}</a>`;
}

function isPendingStreak(data) {
    return data.giftType === 1 && !data.repeatEnd;
}


var currentVideoCountry = "";
var isLocked = false;
var timeOut = null;
var videoElem; 
var timerEnd;
var msToEnd = timerEnd - new Date().getTime();

var top5countrysName = [""];
var top5countrysValue = [""];
var dictTops = { 
    eeuu : 4, 
    india : 0, 
    ucrania : 0, 
    espana : 12, 
    inglaterra : 0, 
    china : 2, 
    francia : 5, 
    alemania : 0, 
    arabia : 0 
  }

const dictImages = { 
    eeuu : "imgs/eeuu.png" , 
    india : "imgs/india.png" , 
    ucrania : "imgs/ucrania.png" , 
    espana : "imgs/espana.png" , 
    inglaterra : "imgs/inglaterra.png" , 
    china : "imgs/china.png" , 
    francia : "imgs/francia.png" , 
    alemania : "imgs/alemania.png" , 
    arabia : "imgs/arabia.png" 
  }

                      /*
                    if (window.timeOut == null) {
                        window.timeOut = window.setTimeout(function(){
                            window.timerEnd = new Date().getTime() + time*1000;
                            window.videoElem.pause();
                            window.isLocked = false;
                            console.log("pause") 
                        },(time*1000));
                    }else {
                        console.log(time+" time before");
                        console.log("Temps guardat: "+window.timerEnd - new Date().getTime());
                        // Si el timer encara te temops guardat, s'acumula a la variable time.
                        if (window.timerEnd - new Date().getTime() > 0) time += window.timerEnd - new Date().getTime();
                        window.clearTimeout(window.timeOut); 
                        console.log("clear timeout")
                        console.log(time+" time after");
                        window.timeOut = null;

                        window.timeOut = window.setTimeout(function(){
                            window.videoElem.pause();
                            console.log("pause") 
                        },(time*1000));
                    } */

                                    /*
                if (window.timeOut == null) {
                    window.timeOut = window.setTimeout(function(){
                    // Calculem el moment que hauria de finaltizar el timer, a partir de la data actual 
                    // i la suma del temps que volem que s'executi el video.
                    window.timerEnd = new Date().getTime() + time*1000; 
                    window.isLocked = false;
                    },(time*1000)); 

                } else {
                    console.log(time+" time before");

                    // Si el timer encara te temops guardat, s'acumula a la variable time.
                    if (window.timerEnd - new Date().getTime() > 0) time += window.timerEnd - new Date().getTime();

                    window.clearTimeout(window.timeOut); 
                    console.log("clear timeout");
                    console.log(time+" time after");
                    window.timeOut = null;
                    
                    window.timeOut = window.setTimeout(function(){
                        window.videoElem.pause();
                        console.log("pause");
                    },(time*1000));*/
/*function countdown(timeleft){
    console.log("COUNTDOWN")
    var lockedText = document.getElementById("locked");
    
    var downloadTimer = setInterval(function(){
    if(timeleft <= 0){
        clearInterval(downloadTimer);
    }
    lockedText.innerHTML = "LOCKED VIDEO "+timeleft.toString()+"s";
    timeleft -= 1;
    }, 1000);
    }*/

/**
 * Play video, a partir de una ruta (src), el temps que ha de recorrer (time) i si es un video obtingut per x likes.
 * Mostra el video.
 * 
 * @param {String} src 
 * @param {Integer} time 
 * @param {String} isLike 
 */

async function playVideo(src, time, isLike) { 
    console.log("Source: "+src);
    var lockedText = document.getElementById("locked");
    videoElem = document.getElementById("video");
    if (window.currentVideoCountry==""){
        window.currentVideoCountry = isLike;
    }

    // Primer if comprova si s'ha fixat algun video. 
    // En cas que n'hi hagi un, comprovarà si esta pausat (else). 
    // I si ja està pausat, per tant ha acabat el video torna a cridar el mètode playVideo, 
    // i reprodueix el següent.
    if (window.isLocked == false){
        if(window.currentVideoCountry == isLike) {
            try {
                if (time > 10) {
                    window.isLocked = true;
                    console.log("locked");
                    lockedText.innerHTML = "🔒LOCKED VIDEO🔒";
                }
                console.log("time: "+time);

                if ("" == window.videoElem.getAttribute('src')) {
                    window.videoElem.setAttribute('src', src);
                }

                await window.videoElem.play();
                console.log("playing");

              } catch(err) {
                  console.log("not playing, error: "+err);
              }
        } else {
            window.videoElem.setAttribute('src', src);
            if (isLike == "like") {
                try {
                    window.clearTimeout(window.timeOut); 
                    window.isLocked = true;
                    lockedText.innerHTML = "🔒LOCKED VIDEO🔒";
                    console.log("locked hasbullah video");
                    await window.videoElem.play();
                    console.log("Playing hasbullah");
                  } catch(err) {
                      console.log("not playing, error: "+err);
                  }
            } else {
                try {
                    if (time > 10) {
                        window.isLocked = true;
                        console.log("locked")
                        var lockedText = document.getElementById("locked");
                        lockedText.innerHTML = "🔒LOCKED VIDEO🔒";
                    }
                    console.log("time: "+time);
                    await window.videoElem.play();
                    console.log("playing");

                  } catch(err) {
                      console.log("not playing, error: "+err);
                  }
            }
        }
    } else {
        if(!window.videoElem.paused){ 
            console.log("Currently a video is fixed")
        } else {
            window.isLocked = false;
            console.log("unlocked");
            lockedText = document.getElementById("locked");
            lockedText.innerHTML = "+10💰 = FULL VIDEO";
            playVideo(src, time, isLike);
        }
    }
    
  }

function addLikesItem(data) {
    let container = location.href.includes('obs.html') ? $('.eventcontainer') : $('.likescontainer');
    window.tempLikes += data.likeCount;
    console.log(tempLikes);
    
    if (window.tempLikes > 500) {
        console.log("hasbullah")
        var i = Math.floor(Math.random() * 6) + 1;

        playVideo("videos/hasbullah/"+i+".mp4", 0, "like");
        tempLikes = 0;
    }

    if (container.find('div').length > 200) {
        container.find('div').slice(0, 100).remove();
    }


    /*
    if(data.isSubscriber) {
        var seguidor = "Seguidor";
    } else {
        var seguidor = "No Seguidor";
    } 
    
    let streakId = data.nickname.toString() + '_' + data.likeCount;

    let html = `
        <div data-streakid=${isPendingStreak(data) ? streakId : ''}>
            <img class="miniprofilepicture" src="${data.profilePictureUrl}">
            <span>
                <b>${generateUsernameLink(data)}:</b> <span>${seguidor}</span><br>
                <div>
                    <table>
                        <tr>
                            <td>
                                <span>Likes: <b>${data.likeCount}</b> (ID:${data.userId})<span><br>
                            </td>
                        </tr>
                    </tabl>
                </div>
            </span>
        </div>
    `; 

    let existingStreakItem = container.find(`[data-streakid='${streakId}']`);

    if (existingStreakItem.length) {
        existingStreakItem.replaceWith(html);
    } else {
        container.append(html);
    }

    container.stop();
    container.animate({
        scrollTop: container[0].scrollHeight
    }, 800); */
}

/**
 * Add a new message to the chat container
 */
function addChatItem(color, data, text, summarize) {
    let container = location.href.includes('obs.html') ? $('.eventcontainer') : $('.chatcontainer');

    if (container.find('div').length > 500) {
        container.find('div').slice(0, 200).remove();
    }
/*
    container.find('.temporary').remove();;

    container.append(`
        <div class=${summarize ? 'temporary' : 'static'}>
            <img class="miniprofilepicture" src="${data.profilePictureUrl}">
            <span>
                <b>${generateUsernameLink(data)}:</b> 
                <span style="color:${color}">${sanitize(text)}</span>
            </span>
        </div>
    `);

    container.stop();
    container.animate({
        scrollTop: container[0].scrollHeight
    }, 400); */
}

/**
 * Add a new gift to the gift container
 */

function sortTops(){
    dictionary = window.dictTops;
    window.top5countrysValue = [];
    window.top5countrysName = [];
    for (var key in dictionary){
        window.top5countrysValue.push(dictionary[key]);
        window.top5countrysName.push(key);
    }

    var list = [];
    for (var j = 0; j < window.top5countrysName.length; j++) 
        list.push({'name': window.top5countrysName[j], 'value': top5countrysValue[j]});

    list.sort(function(a, b) {
        return ((a.value < b.value) ? -1 : ((a.value == b.value) ? 0 : 1));
        //Sort could be modified to, for example, sort on the age 
        // if the name is the same. 
    });

    for (var k = 0; k < list.length; k++) {
        window.top5countrysName[k] = list[k].name;
        window.top5countrysValue[k] = list[k].value;
    }

    window.top5countrysName = window.top5countrysName.reverse();
    window.top5countrysValue = window.top5countrysValue.reverse();
}

function showTops() {
    var top1 = document.getElementById('top1_text');
    var top2 = document.getElementById('top2_text');
    var top3 = document.getElementById('top3_text');
    var top4 = document.getElementById('top4_text');
    var top5 = document.getElementById('top5_text');

    var top_img1 = document.getElementsByClassName('top1');
    var top_img2 = document.getElementsByClassName('top2');
    var top_img3 = document.getElementsByClassName('top3');
    var top_img4 = document.getElementsByClassName('top4');
    var top_img5 = document.getElementsByClassName('top5');
    
    top1.innerHTML  = window.top5countrysValue[0];
    top2.innerHTML  = window.top5countrysValue[1];
    top3.innerHTML  = window.top5countrysValue[2];
    top4.innerHTML  = window.top5countrysValue[3];
    top5.innerHTML  = window.top5countrysValue[4];

    top_img1[0].setAttribute('src', "imgs/"+window.top5countrysName[0]+".png");
    top_img2[0].setAttribute('src', "imgs/"+window.top5countrysName[1]+".png");
    top_img3[0].setAttribute('src', "imgs/"+window.top5countrysName[2]+".png");
    top_img4[0].setAttribute('src', "imgs/"+window.top5countrysName[3]+".png");
    top_img5[0].setAttribute('src', "imgs/"+window.top5countrysName[4]+".png");
    

}

function updateGifter(nickname, countryName) {
    let flagImg = document.getElementById('banderaactual');
    var donerName = document.getElementById('nomdequidona');

    flagImg.setAttribute('src', dictImages[countryName]);
    donerName.innerHTML = "@"+nickname;
}



function addGiftItem(data) {
    let container = location.href.includes('obs.html') ? $('.eventcontainer') : $('.giftcontainer');

    if (container.find('div').length > 200) {
        container.find('div').slice(0, 100).remove();
    }

    // let streakId = data.userId.toString() + '_' + data.giftId;

    if (data.giftPictureUrl == "https://p19-webcast.tiktokcdn.com/img/maliva/webcast-va/eba3a9bb85c33e017f3648eaf88d7189~tplv-obj.png"){
        console.log("eeuu")
        var i = Math.floor(Math.random() * 4) + 1;
        console.log("a"+window.dictTops)

        window.dictTops["eeuu"] = window.dictTops["eeuu"] + data.repeatCount;
        console.log("b"+window.dictTops)
        sortTops();
        showTops();
        updateGifter(data.nickname, "eeuu");
        playVideo("videos/usa/"+i+".mp4",data.repeatCount,"usa");
        
    } else if (data.giftPictureUrl == "https://p19-webcast.tiktokcdn.com/img/maliva/webcast-va/a99fc8541c7b91305de1cdcf47714d03~tplv-obj.png") {
        console.log("india")
        var i = Math.floor(Math.random() * 4) + 1;
        window.dictTops["india"] = window.dictTops["india"] + data.repeatCount;
        sortTops();
        showTops();
        updateGifter(data.nickname, "india");
        playVideo("videos/india/"+i+".mp4",data.repeatCount,"india");

    } else if (data.giftPictureUrl == "https://p19-webcast.tiktokcdn.com/img/maliva/webcast-va/802a21ae29f9fae5abe3693de9f874bd~tplv-obj.png") {
        console.log("ucrania")            
        var i = Math.floor(Math.random() * 3) + 1;
        window.dictTops["ucrania"] = window.dictTops["ucrania"] + data.repeatCount;
        sortTops();
        showTops();
        updateGifter(data.nickname, "ucrania");
        playVideo("videos/ukraina/"+i+".mp4",data.repeatCount,"ukraina");
    } else if (data.giftPictureUrl == "https://p19-webcast.tiktokcdn.com/img/maliva/webcast-va/968820bc85e274713c795a6aef3f7c67~tplv-obj.png") {
        console.log("espana")            
        var i = Math.floor(Math.random() * 4) + 1;
        window.dictTops["espana"] = window.dictTops["espana"] + data.repeatCount;
        sortTops();
        showTops();
        updateGifter(data.nickname, "espana");
        playVideo("videos/spain/"+i+".mp4",data.repeatCount,"spain");
    } else if (data.giftPictureUrl == "https://p19-webcast.tiktokcdn.com/img/maliva/webcast-va/09d9b188294ecf9b210c06f4e984a3bd~tplv-obj.png") {
        console.log("inglaterra")            
        var i = Math.floor(Math.random() * 5) + 1;
        window.dictTops["inglaterra"] = window.dictTops["inglaterra"] + data.repeatCount;
        sortTops();
        showTops();
        updateGifter(data.nickname, "inglaterra");
        playVideo("videos/uk/"+i+".mp4",data.repeatCount,"uk");
    }
    else if (data.giftPictureUrl == "https://p19-webcast.tiktokcdn.com/img/maliva/webcast-va/728cc7436005cace2791aa7500e4bf95~tplv-obj.png") {
        console.log("china")            
        var i = Math.floor(Math.random() * 4) + 1;
        window.dictTops["china"] = window.dictTops["china"] + data.repeatCount;
        sortTops();
        showTops();
        updateGifter(data.nickname, "china");
        playVideo("videos/china/"+i+".mp4",data.repeatCount,"china");
    }
    else if (data.giftPictureUrl == "https://p19-webcast.tiktokcdn.com/img/maliva/webcast-va/c043cd9e418f13017793ddf6e0c6ee99~tplv-obj.png") {
        console.log("francia")            
        var i = Math.floor(Math.random() * 4) + 1;
        window.dictTops["francia"] = window.dictTops["francia"] + data.repeatCount;
        sortTops();
        showTops();
        updateGifter(data.nickname, "francia");
        playVideo("videos/france/"+i+".mp4",data.repeatCount,"france");
    }
    else if (data.giftPictureUrl == "https://p19-webcast.tiktokcdn.com/img/maliva/webcast-va/3f02fa9594bd1495ff4e8aa5ae265eef~tplv-obj.png") {
        console.log("alemania")            
        var i = Math.floor(Math.random() * 4) + 1;
        window.dictTops["alemania"] = window.dictTops["alemania"] + data.repeatCount;
        sortTops();
        showTops();
        updateGifter(data.nickname, "alemania");
        playVideo("videos/alemania/"+i+".mp4",data.repeatCount,"alemania");
    }
    else if (data.giftPictureUrl == "https://p19-webcast.tiktokcdn.com/img/maliva/webcast-va/a43ec3a70f63d2d48683bed39e18cd2d~tplv-obj.png") {
        console.log("arabia")            
        var i = Math.floor(Math.random() * 4) + 1;
        window.dictTops["arabia"] = window.dictTops["arabia"] + data.repeatCount;
        sortTops();
        showTops();
        updateGifter(data.nickname, "arabia");
        playVideo("videos/arabia/"+i+".mp4",data.repeatCount,"arabia");
    }
/*
    let html = `
        <div data-streakid=${isPendingStreak(data) ? streakId : ''}>
            <img class="miniprofilepicture" src="${data.profilePictureUrl}">
            <span>
                <b>${generateUsernameLink(data)}:</b> <span>${data.describe}</span><br>
                <div>
                    <table>
                        <tr>
                            <td><img class="gifticon" src="${data.giftPictureUrl}"></td>
                            <td>
                                <span>Name: <b>${data.giftName}</b> (ID:${data.giftId})<span><br>
                                <span>Repeat: <b style="${isPendingStreak(data) ? 'color:red' : ''}">x${data.repeatCount.toLocaleString()}</b><span><br>
                                <span>Cost: <b>${(data.diamondCount * data.repeatCount).toLocaleString()} Diamonds</b><span>
                            </td>
                        </tr>
                    </tabl>
                </div>
            </span>
        </div>
    `;

    let existingStreakItem = container.find(`[data-streakid='${streakId}']`);

    if (existingStreakItem.length) {
        existingStreakItem.replaceWith(html);
    } else {
        container.append(html);
    }

    container.stop();
    container.animate({
        scrollTop: container[0].scrollHeight
    }, 800); */
}


// viewer stats
connection.on('roomUser', (msg) => {
    if (typeof msg.viewerCount === 'number') {
        viewerCount = msg.viewerCount;
        updateRoomStats();
    }
})

// like stats
connection.on('like', (msg) => {
    if (typeof msg.totalLikeCount === 'number') {
        likeCount = msg.totalLikeCount;
        updateRoomStats();
    }

    if (window.settings.showLikes === "0") return;

    if (typeof msg.likeCount === 'number') {
        addChatItem('#447dd4', msg, msg.label.replace('{0:user}', '').replace('likes', `${msg.likeCount} likes`))
    }

    addLikesItem(msg);

})

// Member join
let joinMsgDelay = 0;
connection.on('member', (msg) => {
    if (window.settings.showJoins === "0") return;

    let addDelay = 250;
    if (joinMsgDelay > 500) addDelay = 100;
    if (joinMsgDelay > 1000) addDelay = 0;

    joinMsgDelay += addDelay;

    setTimeout(() => {
        joinMsgDelay -= addDelay;
        addChatItem('#21b2c2', msg, 'joined', true);
    }, joinMsgDelay);
})

// New chat comment received
connection.on('chat', (msg) => {
    if (window.settings.showChats === "0") return;

    addChatItem('', msg, msg.comment);
})

// New gift received
connection.on('gift', (data) => {
    if (!isPendingStreak(data) && data.diamondCount > 0) {
        diamondsCount += (data.diamondCount * data.repeatCount);
        updateRoomStats();
        addGiftItem(data);
    }

    if (window.settings.showGifts === "0") return;

    
})

// share, follow
connection.on('social', (data) => {
    if (window.settings.showFollows === "0") return;

    let color = data.displayType.includes('follow') ? '#ff005e' : '#2fb816';
    addChatItem(color, data, data.label.replace('{0:user}', ''));
})

connection.on('streamEnd', () => {
    $('#stateText').text('Stream ended.');

    // schedule next try if obs username set
    if (window.settings.username) {
        setTimeout(() => {
            connect(window.settings.username);
        }, 30000);
    }
})

function endConnection() {
    document.location.reload(true);
}