module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        copy: {
            contracts: {
<<<<<<< HEAD
                files: [
                    {
                        expand: true,
                        src: ['build/contracts/*'],
                        dest: 'src/'
                    }
                ],
=======
                files: [{
                    expand: true,
                    src: ['./build/contracts/*.json'],
                    dest: './src'
                }],
>>>>>>> 9e49bdacb8ad90a6bcf80d9ed19c2b877feab32d
            }
        },
        exec: {
            local_geth_rinkeby: 'start geth --rinkeby --rpc --rpcapi db,eth,net,web3,personal --unlock="0x3a980bD986b0E55758151B34A8CE6e32189D35DE"',
            local_testrpc: 'start testrpc --mnemonic "clog banana trophy city sunset busy citizen biology cash orchard better couch" --accounts 50',
            local_bridge: 'cd C:/Users/Francis/Desktop/ethereum-bridge & start node bridge -a 49 --dev mode',
            truffle_compile: 'truffle compile',
            truffle_migrate_local: 'truffle migrate',
            truffle_migrate_rinkeby: 'truffle migrate --network rinkeby',
            truffle_typescript: 'truffle-contract-typescript build ./build/contracts ./src/contracts.ts'
        },
        clean: ['./build/contracts', './src/build/contracts']
    });

    // Loading tasks.
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-exec');

    // Tasks.
    grunt.registerTask('start_localrpc', ['exec:local_testrpc', 'exec:local_bridge'])
    grunt.registerTask('start_rinkeby', ['exec:local_geth_rinkeby'])
<<<<<<< HEAD
    grunt.registerTask('localrpc', ['clean', 'exec:truffle_compile', 'exec:truffle_migrate_local', 'copy:contracts']);
    grunt.registerTask('rinkeby', ['clean', 'exec:truffle_compile', 'exec:truffle_migrate_rinkeby', 'copy:contracts'])
    grunt.registerTask('default', []);
=======
    grunt.registerTask('localrpc', ['clean', 'exec:truffle_compile', 'exec:truffle_migrate_local', 'copy:contracts', 'exec:truffle_typescript']);
    grunt.registerTask('rinkeby', ['clean', 'exec:truffle_compile', 'exec:truffle_migrate_rinkeby', 'copy:contracts', 'exec:truffle_typescript']);
    grunt.registerTask('default', ['localrpc']);
>>>>>>> 9e49bdacb8ad90a6bcf80d9ed19c2b877feab32d
};