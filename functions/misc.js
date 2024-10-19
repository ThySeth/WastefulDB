// Some random stuff that I'm messing with

/*
=================
My attempt at making an auto-clearing cache.
I should really add a timer refresh. Can't be that hard?
=================
*/
var collect = [
    {created: Date.now(), keepAlive: 30100, progress: 30100, id: 0} // 30 seconds + 100ms because some milliseconds are lost throughout the process
]

var round = 0;

const cacheInterval = setInterval(() => {
    collect.forEach((entry) => {
        entry.progress = Math.round(entry.keepAlive - Math.round(Date.now() - entry.created));
        console.log(`${entry.progress}ms / ${entry.keepAlive}ms progress for ${entry.id}\n`);
        round++
        if(entry.progress < 10000) { // If the remaining time is < 10s, direct it to a timeout instead of relying on an imprecise interval.
            console.log(`${entry.id} keepAlive below threshold of 10s`)
            EoL(entry.progress, entry); // End of Life
        }
    })
}, 10000)

function EoL(timeLeft, entry) {
    setTimeout(() => {
        collect.splice(collect.find(item => item.id == entry.id), 1); // Cut out the target object
        console.log(`Content deleted after ${round} rounds. New Array:`)
        console.log(collect);
    }, timeLeft)
}
