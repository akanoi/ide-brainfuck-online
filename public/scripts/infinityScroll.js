var memory_counter = 0;
var lines = [];


function load() {
    for (var i = 0; i <= max_count_memory; i++) {
        if (memory_counter <= lines.length && memory_counter < memory_array.length) {
            lines.push(takeCell(memory_counter));
            memory_counter++;
        }
    }
}


function takeCell(index) {
    return {
        hex: '0x' + (index.toString(16)).toUpperCase(),
        data: memory_array[index]
    };
}


function addFromMemory() {
    if (memory_pointer < lines.length)
        lines[memory_pointer] = takeCell(memory_pointer);
}