module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        copy: {
            contracts: {
                files: [
                    // includes files within path and its sub-directories
                    { expand: true, src: ['build/**'], dest: 'src/' }
                ],
            }
        },
        exec: {
            create_dot_files: buildCommandsForDotFiles(),
            create_png_graphs: buildCommandsForPngGraphs(),
            local_rpc: 'start testrpc --mnemonic "clog banana trophy city sunset busy citizen biology cash orchard better couch" --accounts 50',
            local_ipfs: 'start ipfs daemon',
            truffle_compile: 'truffle compile',
            truffle_migrate: 'truffle migrate --reset'
        },
        clean: ['./build/contracts', './src/build/contracts']
    });

    // Loading tasks.
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-exec');

    // Task definitions.
    grunt.registerTask('bootstrap', ['exec:local_rpc', 'exec:local_ipfs']);
    grunt.registerTask('truffle', ['clean', 'exec:truffle_compile', 'exec:truffle_migrate', 'copy:contracts']);
    grunt.registerTask('default', []);
    grunt.registerTask('graph', ['exec:create_dot_files', 'exec:create_png_graphs']);
};

function buildCommandsForDotFiles() {
    const contractsFolder = './contracts/';
    const fs = require('fs');

    var commands = '';
    fs.readdir(contractsFolder, (err, files) => {
        files.forEach(file => {
            commands += 'solgraph ./contracts/' + file + ' > ./contracts_graph/' + file + '.dot' + ' & '
        });
        commands += 'echo DONE';
        console.log(commands);
    });
}

function buildCommandsForPngGraphs() {
    const contractsGraphFolder = './contracts_graph/';
    const fs = require('fs');

    var commands = '';
    fs.readdir(contractsGraphFolder, (err, files) => {
        files.forEach(file => {
            commands += 'dot -Tpng ./contracts_graph/' + file + ' > ./contracts_graph/' + file + '.png' + ' & '
        });
        commands += 'echo DONE';
        console.log(commands);
    });
}