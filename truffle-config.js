module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*", // testrpc --mnemonic "clog banana trophy city sunset busy citizen biology cash orchard better couch"
      gas: 4000000
    }
  }
};
