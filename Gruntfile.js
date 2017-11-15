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

    // Tasks.
    grunt.registerTask('bootstrap', ['exec:local_rpc', 'exec:local_ipfs']);
    grunt.registerTask('truffle', ['clean', 'exec:truffle_compile', 'exec:truffle_migrate', 'copy:contracts']);
    grunt.registerTask('default', []);
};