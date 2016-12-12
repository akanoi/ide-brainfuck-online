var is_debugging = 0;
var memory_array = [];
var max_count_memory = 255;
var max_value_memory = 255;
var index_pointer = 0;
var memory_pointer = 0;
var data_pointer = 0;
var program_code = [];
var targets = [];
var input = [];
var output = '';
var exit_debug_run = 0;
var is_debugging_run = 0;
var prompt_for_input = 0;
var is_running = 0;
var timeout = 0;


function init() {
    document.getElementById('edit-source').value = "";
    is_debugging = 1;
    init_memory();
    debug_toggle();
    load();
}


function init_memory() {
    for (var i = 0; i <= max_count_memory; i++) {
        memory_pointer = i;
        memory_array[i] = 0;
        addFromMemory();
    }
    memory_pointer = 0;
}


function init_io() {
    data_pointer = 0;
    output = '';
}


function init_prog(code) {
    program_code.length = 0;
    for (var i = 0; i < code.length; i++) {
        var op = code.charAt(i);
        if (is_valid_op(op)) {
            program_code[program_code.length] = op;
        }
    }
    index_pointer = 0;
    init_targets();
}


function init_targets() {
    targets.length = 0;
    var temp_stack = [];
    for (var i = 0; i < program_code.length; i++) {
        var op = program_code[i];
        if (op == '[') {
            temp_stack.push(i);
        }
        if (op == ']') {
            if (temp_stack.length == 0) alert('Parseing error: ] with no matching [');
            var target = temp_stack.pop();
            targets[i] = target;
            targets[target] = i;
        }
    }
    if (temp_stack.length > 0) alert('Parseing error: [ with no matching ]');
}


function init_input() {
    prompt_for_input = true;
    input.length = 0;
    var in_data = "";
    for (var i = 0; i < in_data.length; i++) {
        input[input.length] = in_data.charAt(i);
    }
    data_pointer = 0;
}


function checkEmpty(data) {
    while ((!data)) {
        if (data == null) {
            if (is_running == 1) {
                bf_stop_run();
            } else debug_done();
            return 0;
        } else data = window.prompt("Enter again");
    }
    return 1;
}


function get_input() {
    var data = window.prompt("Enter an input character:", "");
    if (checkEmpty(data)) {
        var answer = 0;
        try {
            answer = eval(data);
        } catch (err) {
            answer = data.charCodeAt(0);
            if (answer > 255) {
                answer = get_input();
            }
        }
        return answer;
    }
}


function is_valid_op(op) {
    if (op == '+') return 1;
    if (op == '-') return 1;
    if (op == '>') return 1;
    if (op == '<') return 1;
    if (op == '[') return 1;
    if (op == ']') return 1;
    if (op == '.') return 1;
    if (op == ',') return 1;
    if (op == '@') return 1;
    return 0;
}


function put_output(c) {
    output = c;
}


function execute_opcode(op) {
    switch (op) {
        case '+':
            memory_array[memory_pointer]++;
            if (memory_array[memory_pointer] > max_value_memory) memory_array[memory_pointer] = 0;
            addFromMemory();
            break;
        case '-':
            memory_array[memory_pointer]--;
            if (memory_array[memory_pointer] < 0) memory_array[memory_pointer] = max_value_memory;
            addFromMemory();
            break;
        case '>':
            memory_pointer++;
            if (memory_pointer > max_count_memory) memory_pointer = 0;
            break;
        case '<':
            memory_pointer--;
            if (memory_pointer < 0) memory_pointer = max_count_memory;
            break;
        case '[':
            if (memory_array[memory_pointer] == 0) index_pointer = targets[index_pointer];
            break;
        case ']':
            index_pointer = targets[index_pointer] - 1;
            break;
        case '.':
            put_output(String.fromCharCode(memory_array[memory_pointer]));
            update_outputview();
            break;
        case ',':
            memory_array[memory_pointer] = get_input();
            addFromMemory();
            break;
    }
}


function bf_interpret(code) {

    if (is_running) {
        bf_stop_run();
        return;
    }

    is_running = 1;
    init_prog(code);
    init_memory();
    init_io();
    init_input();
    set_viewdata('outputview', '');
    // document.getElementById('edit-source').disabled = true;
    change_button_caption('run', '[Stop]');
    disable_button('debug');
    bf_run_step();
}


function bf_stop_run() {
    enable_button('debug');
    change_button_caption('run', '[Run]');
    document.getElementById('edit-source').disabled = false;
    is_running = 0;
}


function bf_run_done() {
    if (is_running) {
        set_viewdata('outputview', output);
    }
    bf_stop_run();
}


function bf_run_step() {
    var op = program_code[index_pointer];
    execute_opcode(op);
    index_pointer++;
    if (index_pointer >= program_code.length || !is_running) {
        bf_run_done();
        return;
    }
    window.setTimeout('bf_run_step();', timeout);
}


function update_outputview() {
    set_viewdata('outputview', output);
}


function set_viewdata(view, data) {
    var data = document.createTextNode(data);
    var view = document.getElementById(view);
    if (data.data == '') {
        view.textContent = '';
    } else {
        view.textContent += data.data;
    }
}


function run_code() {
    bf_interpret(document.getElementById('edit-source').value);
}


function debug_done() {
    disable_button('step');
    disable_button('to-breakpoint');
    debug_toggle();
}


function debug_toggle() {
    if (is_debugging) {
        is_debugging = 0;
        document.getElementById('edit-source').disabled = false;
        enable_button('run');
        change_button_caption('debug', '[Debug]');
        disable_button('step');
        enable_button('debug');
        disable_button('to-breakpoint');
    } else {
        is_debugging = 1;
        // document.getElementById('edit-source').disabled = true;
        disable_button('run');
        change_button_caption('debug', '[Stop debug]');
        enable_button('step');
        enable_button('to-breakpoint');
        set_viewdata('outputview', '');
        start_debugger();
    }
}


function start_debugger() {
    init_memory();
    init_io();
    init_prog(document.getElementById('edit-source').value);
    init_input();
    set_viewdata('outputview', '');
}


function run_step() {
    var op = program_code[index_pointer];
    execute_opcode(op);
    index_pointer++;

    if (index_pointer >= program_code.length) {
        is_debugging = 1;
        debug_done();
    }
}


function SelectText(begin, end) {
    ta = document.getElementById("edit-source");
    if (ta.createTextRange) {
        tr = ta.createTextRange();

        //tr.findText("something");

        tr.move("character", begin);
        tr.moveEnd("character", end-begin);

        tr.select();

    } else if (ta.setSelectionRange) {

        ta.setSelectionRange(begin, end);

    }
}


function start_debug_run() {
    disable_button('debug');
    disable_button('step');
    change_button_caption('to-breakpoint', '[Stop]');
    is_debugging_run = 1;
}


function stop_debug_run() {
    enable_button('debug');
    enable_button('step');
    change_button_caption('to-breakpoint', '[To breakpoint]');
    is_debugging_run = 0;
}


function run_debug() {
    if (is_debugging_run) {
        exit_debug_run = 1;
    } else {
        start_debug_run();
        exit_debug_run = 0;
        run_debug_step();
    }
}


function run_debug_step() {
    run_step();
    if ((program_code[index_pointer] == '@') || exit_debug_run || (index_pointer >= program_code.length)) {
        stop_debug_run();
        if (index_pointer >= program_code.length) {
            is_debugging = 1;
            debug_done();
        }
        return;
    }
    window.setTimeout('run_debug_step();', 0);
}


function disable_button(name) {
    var element = document.getElementById(name);
    element.style.display = 'none';
}


function enable_button(name) {
    var element = document.getElementById(name);
    element.style.display = 'inline';
}


function change_button_caption(name, caption) {
    var element = document.getElementById(name);
    element.textContent = caption;
}
