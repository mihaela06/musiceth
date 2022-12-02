const fs = require('fs');
const AudioNFT = artifacts.require("AudioNFT");

module.exports = async function (deployer, network) {
    var configFile = "config/" + network + ".json";
    await deployer.deploy(AudioNFT);
    const instance = await AudioNFT.deployed();

    var addresses = { "AudioNFT": instance.address };

    fs.writeFileSync(configFile, JSON.stringify(addresses));
}