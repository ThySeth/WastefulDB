
class Queue extends WastefulDB {
  constructor (options = {feedback, serial, path, kill}) {
  super({feedback, serial, path, kill});
    this.queue = [];
    this.position = 0;
  }

  add(object) {
    this.queue.push(object);
    console.log(this.queue);
     if(this.queue.length > 0) {
       this.next();
     }
  }
  async next() {
    if(this.position == this.queue.length) {
      this.queue = [];
       this.position = 0;
        console.log("Queue done.");
    }
     let current = this.queue[this.position];
      await this.insert(current);
       this.position += 1;
        this.next();
  }
/*
  async next() {
    if(this.position == this.queue.length) {
      this.queue = [];
       this.position = 0;
        console.log("Queue has completed successfully. Memory has been dumped.");
    }
     let current = this.queue[this.position];
      await this.update(current);
       return this.position += 1;
  }
  */

}
