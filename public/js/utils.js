/* dom control */

const menu = document.querySelector('#menu');
const usersMenu = document.querySelector('#users');
const chat = document.querySelector('#chat')
const toggleAudioButton = document.querySelector("#toggle-audio");
const toggleMenuButton = document.querySelector("#toggle-menu");
const toggleUsersButton = document.querySelector("#toggle-users");
const toggleChatButton = document.querySelector("#toggle-chat");


if(toggleAudioButton) toggleAudioButton.addEventListener("click", toggleAudio);
if(toggleMenuButton) toggleMenuButton.addEventListener("click", toggleMenu);
if(toggleUsersButton) toggleUsersButton.addEventListener("click", toggleUsers);
if(toggleChatButton) toggleChatButton.addEventListener("click", toggleChat);


function toggleAudio() {
    if(videoElement.muted) {
        videoElement.muted = false;
        console.log("Enabling audio");
        this.innerHTML = `<img src="/assets/sound.svg">`;
    } else {
        videoElement.muted = true;
        console.log("Disabling audio");
        this.innerHTML = `<img src="/assets/sound-off.svg">`;
    }
}

function toggleMenu() {
    this.src=`/assets/menu${menu.classList.contains('open')?'':'-close'}.svg`
    menu.classList.toggle('open')
}

function toggleUsers() {
    // this.src=`/assets/menu${usersMenu.classList.contains('open')?'':'-close'}.svg`
    toggleUsersButton.src = `/assets/users${usersMenu.classList.contains('open')?'':'-open'}.svg`;
    usersMenu.classList.toggle('open')
}

function toggleChat() {
    this.innerHTML = `<img src="/assets/chat${chat.classList.contains('open')?'-off':''}.svg">`;
    chat.classList.toggle('open')
}