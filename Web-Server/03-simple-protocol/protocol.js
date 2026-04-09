class MessageReader {
    constructor(){
        this.buffer = this.buffer.alloc(0);
        this.messages = [];
    }

    push(data){
        this.buffer = this.buffer.concat([this.buffer, data])
        while(this.buffer.concat([this.buffer, data]))
    }
}