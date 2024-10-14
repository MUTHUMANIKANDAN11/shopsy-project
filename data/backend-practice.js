/*
const xhr = new XMLHttpRequest();

xhr.addEventListener('load', () => {
    console.log(xhr.response);
});


xhr.open("GET", "https://supersimplebackend.dev/documentation");
xhr.send()
*/


function start(fun){
    setTimeout(() => {
        console.log('start');
        fun();
    }, 4000);
}

function wait(fun){
    setTimeout(() => {
        console.log('wait');
        fun();
    }, 2000);
}

function end(){
    setTimeout(() => {
        console.log('end');
    }, 1000);
}

new Promise((resolve) => {
    start(() => {
        resolve();
    });
}).then(() => {
    return new Promise((resolve) => {
        wait(() => {
            resolve();
        });
    });
}).then(() => {
    end();
});