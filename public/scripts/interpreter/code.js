var g_debugging = 0;
var g_memory = [];
var g_max_mem = 255;
var g_max_val = 255;
var g_ip = 0;
var g_mp = 0;
var g_dp = 0;
var g_program = [];
var g_targets = [];
var g_input = [];
var g_output = '';
var g_quit_debug_run = 0;
var g_debugging_running = 0;
var g_prompt_for_input = 0;
var g_running = 0;
var g_linebreaker = "\n";
var g_timeout = 0;

function init() {
    if (navigator.userAgent.toLowerCase().indexOf("msie") != -1) {
        g_linebreaker = "\r";
    }
    document.getElementById('edit-source').value = "";
    g_debugging = 1;
    init_memory();
    // debug_toggle(document.getElementById('mainform'));
    debug_toggle("");
    load();
}

function init_memory() {
    for (var i = 0; i <= g_max_mem; i++) {
        g_mp = i;
        g_memory[i] = 0;
        addFromMemory();
    }
    g_mp = 0;
}

function init_io() {
    g_dp = 0;
    g_output = '';
}

function init_prog(code) {
    g_program.length = 0;
    for (var i = 0; i < code.length; i++) {
        var op = code.charAt(i);
        if (is_valid_op(op)) {
            g_program[g_program.length] = op;
        }
    }
    g_ip = 0;
    init_targets();
}

function init_targets() {
    g_targets.length = 0;
    var temp_stack = [];
    for (var i = 0; i < g_program.length; i++) {
        var op = g_program[i];
        if (op == '[') {
            temp_stack.push(i);
        }
        if (op == ']') {
            if (temp_stack.length == 0) alert('Parseing error: ] with no matching [');
            var target = temp_stack.pop();
            g_targets[i] = target;
            g_targets[target] = i;
        }
    }
    if (temp_stack.length > 0) alert('Parseing error: [ with no matching ]');
}

function init_input() {
    g_prompt_for_input = true;
    g_input.length = 0;
    var in_data = "";
    for (var i = 0; i < in_data.length; i++) {
        g_input[g_input.length] = in_data.charAt(i);
    }
    g_dp = 0;
}

function checkEmpty(data) {
    while ((!data)) {
        if (data == null) {
            if (g_running == 1) {
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
    if (op == '#') return 1;
    return 0;
}

function put_output(c) {
    g_output += c;
}

function execute_opcode(op) {
    switch (op) {
        case '+':
            g_memory[g_mp]++;
            if (g_memory[g_mp] > g_max_val) g_memory[g_mp] = 0;
            addFromMemory();
            break;
        case '-':
            g_memory[g_mp]--;
            if (g_memory[g_mp] < 0) g_memory[g_mp] = g_max_val;
            addFromMemory();
            break;
        case '>':
            g_mp++;
            if (g_mp > g_max_mem) g_mp = 0;
            break;
        case '<':
            g_mp--;
            if (g_mp < 0) g_mp = g_max_mem;
            break;
        case '[':
            if (g_memory[g_mp] == 0) g_ip = g_targets[g_ip];
            break;
        case ']':
            g_ip = g_targets[g_ip] - 1;
            break;
        case '.':
            put_output(String.fromCharCode(g_memory[g_mp]));
            break;
        case ',':
            g_memory[g_mp] = get_input();
            addFromMemory();
            break;
    }
}

function bf_interpret(code) {

    if (g_running) {
        bf_stop_run();
        return;
    }
    g_running = 1;
    init_prog(code);
    init_memory();
    init_io();
    init_input();
    set_viewdata('outputview', ' ');
    document.getElementById('edit-source').disabled = true;
    disable_button('debug');
    bf_run_step();
}

function bf_stop_run() {
    enable_button('debug');
    change_button_caption('run', '[Run]');
    document.getElementById('edit-source').disabled = false;
    g_running = 0;
}

function bf_run_done() {
    if (g_running) {
        set_viewdata('outputview', g_output);
    }
    bf_stop_run();
}

function bf_run_step() {
    var op = g_program[g_ip];
    execute_opcode(op);
    g_ip++;
    if (g_ip >= g_program.length || !g_running) {
        bf_run_done();
        return;
    }
    window.setTimeout('bf_run_step();', g_timeout);
}

function update_outputview() {
    set_viewdata('outputview', g_output);
}

function set_viewdata(view, data) {
    var new_node = document.createTextNode(data);
    var p_node = document.getElementById(view);
    p_node.replaceChild(new_node, p_node.childNodes[0]);
}

function run() {
    bf_interpret(document.getElementById('edit-source').value);
}

function debug_done() {
    disable_button('step');
    disable_button('to-breakpoint');
    debug_toggle();
}

function debug_toggle() {
    if (g_debugging == 1) {
        g_debugging = 0;
        document.getElementById('edit-source').disabled = false;
        enable_button('run');
        change_button_caption('debug', '[Debug]');
        disable_button('step');
        enable_button('debug');
        disable_button('to-breakpoint');
    } else {
        g_debugging = 1;
        document.getElementById('edit-source').disabled = true;
        disable_button('run');
        change_button_caption('debug', '[Stop debug]');
        enable_button('step');
        enable_button('to-breakpoint');
        set_viewdata('outputview', ' ');
        start_debugger();
    }
}

function start_debugger() {
    init_memory();
    init_io();
    init_prog(document.getElementById('edit-source').value);
    init_input();
    update_outputview();
}

function run_step() {
    var op = g_program[g_ip];
    execute_opcode(op);
    g_ip++;
    update_outputview();

    if (g_ip >= g_program.length) {
        g_debugging = 1;
        debug_done();
    }
}

function start_debug_run() {
    disable_button('debug');
    disable_button('step');
    change_button_caption('to-breakpoint', '[Stop]');
    g_debugging_running = 1;
}

function stop_debug_run() {
    enable_button('debug');
    enable_button('step');
    change_button_caption('to-breakpoint', '[To breakpoint]');
    g_debugging_running = 0;
}

function run_debug() {
    if (g_debugging_running) {
        g_quit_debug_run = 1;
    } else {
        start_debug_run();
        g_quit_debug_run = 0;
        run_debug_step();
    }
}

function run_debug_step() {
    run_step();
    if ((g_program[g_ip] == '#') || g_quit_debug_run || (g_ip >= g_program.length)) {
        stop_debug_run();
        if (g_ip >= g_program.length) {
            g_debugging = 1;
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
