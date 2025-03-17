const wait =  time => {
    time = time ? time : 5000
    return new Promise((resolve,reject)=>{
        setTimeout(() => {
            resolve()
        }, time);
    })
}

module.exports = wait