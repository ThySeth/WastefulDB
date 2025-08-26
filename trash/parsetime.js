function parseTime(time) {
    let full = {seconds: (time.match(/(\d{1,2})(s)/)?.[1] || 0), minutes: (time.match(/(\d{1,2})(m)/)?.[1] || 0), hours: (time.match(/(\d{1,2})(h)/)?.[1] || 0)}
    if((full.seconds + full.minutes + full.hours) === 0) return -1;
    let timeout = Date.now() + full.seconds*1000 + full.minutes*60000 + full.hours*3600000;
    timeout = new Date(timeout).toISOString();
    return timeout;
}
