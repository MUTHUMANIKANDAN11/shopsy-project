/*
const xhr = new XMLHttpRequest();

xhr.addEventListener('load', () => {
    console.log(xhr.response);
});


xhr.open("GET", "https://supersimplebackend.dev/documentation");
xhr.send()
*/

/*
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
*/
/*
function data(callBack){
    let name;
    setTimeout(() => {
        name = 'man';
        callBack(name);
    }, 3000);
}
*/
/*  CALL-BACK
data((name) => {
    console.log(name);
});
*/

/*  PROMISE
new Promise((resolve) => {
    data(resolve);
}).then((result) => {
    console.log(result);
});
*/

/*
function getname(){
    return new Promise((resolve) => {
        let name;
        setTimeout(() => {
            name = 'man';
            resolve(name);
        }, 3000);
    });
}

function addname(){
    return new Promise((resolve) => {
        let name2;
        setTimeout(() => {
            name2 = 'from';
            resolve(name2);
        }, 4000);
    });
}

function addname2(){
    return new Promise((resolve) => {
        let name3;
        setTimeout(() => {
            name3 = 'toronto';
            resolve(name3);
        }, 5000);
    });
}


getname().then((result) => {
    return addname().then((result2) => {
        return addname2().then((result3) => {
            console.log(result, result2, result3);
        });
    });
});

*/

function start(){
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("start");
            resolve('start 1');
        }, 4000);
    });
}

function wait(){
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("wait");
            resolve('start 2');
        }, 2000);
    });
}

function end(){
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("end");
            resolve("start 3");
        }, 2000);
    });
}


/*
start().then((value) => {
    wait().then((value2) => {
        end().then((value3) => {
            console.log(value, value2, value3);
        });
    })
});
*/

async function flowOff(){
    const value1 = await start();
    const value2 = await wait();
    const value3 = await end();
    console.log(value1, value2, value3);
}

//flowOff()


/*
new Promise((resolve) => {
    start(resolve);
}).then(() => {
    return new Promise((resolve) => {
        wait(resolve);
    });
}).then(() => {
    end();
});
*/

Promise.all([
    new Promise((resolve) => {
        setTimeout(() => {
            console.log("start");
            resolve('start 1');
        }, 4000);
    }),
    new Promise((resolve) => {
        setTimeout(() => {
            console.log("wait");
            resolve('start 2');
        }, 2000);
    })
]).then((values) => {
    end();
    console.log(values);
});

for (let i=0; i<2; i++){
    console.log('Hii');
}