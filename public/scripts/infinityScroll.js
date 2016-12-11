var memory_counter = 0;
var lines = [];


function load() {
    for (var i = 0; i <= 32; i++) {
        if (memory_counter <= lines.length && memory_counter < memory_array.length) {
            console.log(memory_counter);
            lines.push(takeCell(memory_counter));
            memory_counter++;
        }
    }
}


function takeCell(index) {
    return {
        hex: '0x' + index.toString(16),
        data: memory_array[index]
    };
}


function addFromMemory() {
    if (memory_pointer < lines.length)
        lines[memory_pointer] = takeCell(memory_pointer);
}