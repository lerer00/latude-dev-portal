module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: 1337, // Match any network id
      from: "0x1b2edbe6be67f591ea47c9e99c8c9bc3ef197ef7" // testrpc --mnemonic latude
    }
  }
};
