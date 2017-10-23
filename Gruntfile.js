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
            truffle_compile: 'truffle compile',
            truffle_migrate: 'truffle migrate --reset'
        }
    });

    // Loading tasks.
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-exec');

    // Task definitions.
    grunt.registerTask('truffle', ['exec:truffle_compile', 'exec:truffle_migrate', 'copy:contracts']);
    grunt.registerTask('bootstrap', ['exec:local_rpc']);
    grunt.registerTask('default', []);
};