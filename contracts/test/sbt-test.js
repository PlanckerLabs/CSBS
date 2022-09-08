const { expect } = require("chai");
const { ethers} = require("hardhat");
const { web3 } = require("hardhat");
const { BigNumber } = require("ethers");
// import { utils } from 'ethers'

function check(f, got, want) {
  expect(got).to.eq(want, f);
}

function checkArray(f, got, want) {
  got.forEach((v, i) => {
    expect(v).to.eq(want[i], f);
  });
}


describe("SBT Test", async function () {
  
    it("Check ERC721",async function(){
        let [operator, acc1, acc2] = await ethers.getSigners();
        let factory = await ethers.getContractFactory("SBT");
        let sbtInstance = await factory.connect(operator).deploy();
        await sbtInstance.deployed();
        await sbtInstance.initialize("ABC","abc");
        expect(await sbtInstance.name()).to.equal("ABC");
        expect(await sbtInstance.symbol()).to.equal("abc");
        expect(await sbtInstance.owner()).to.equal(operator.address)
    })

    it("Check Upgradeable",async function(){
        let [operator, acc1, acc2] = await ethers.getSigners();
        let factory = await ethers.getContractFactory("SBT");
        let sbtInstance = await factory.connect(operator).deploy();
        await sbtInstance.deployed();
        let selector = await sbtInstance.callInitFuncData("ABC","abc")

        let sbtInstanceUpgrade = await factory.connect(acc2).deploy();
        await sbtInstanceUpgrade.deployed();

        let factory1 = await ethers.getContractFactory("UpgradeableProxy");
        let proxyInstance = await factory1.connect(operator).deploy(sbtInstance.address,acc1.address,selector);
        await proxyInstance.deployed();

        let SBTProxy = await ethers.getContractAt("SBT",proxyInstance.address)
        expect(await SBTProxy.name()).to.equal("ABC");
        expect(await SBTProxy.symbol()).to.equal("abc");
        expect(await SBTProxy.owner()).to.equal(operator.address)

        
        const adminSlot = "0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103"
        let actualAdmin = await web3.eth.getStorageAt(proxyInstance.address,adminSlot)
        let actualA =web3.utils.toBN(actualAdmin).toString()
        let expectA = web3.utils.toBN(acc1.address).toString()
        expect(actualA).to.equal(expectA)
        await proxyInstance.connect(acc1).changeAdmin(acc2.address)
        actualAdmin = await web3.eth.getStorageAt(proxyInstance.address,adminSlot)
        actualA =web3.utils.toBN(actualAdmin).toString()
        expectA = web3.utils.toBN(acc2.address).toString()
        expect(actualA).to.equal(expectA)


        const ImplementationSlot = "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc"
        let actualImplement = await web3.eth.getStorageAt(proxyInstance.address,ImplementationSlot)
        let actualI =web3.utils.toBN(actualImplement).toString()
        let expectI = web3.utils.toBN(sbtInstance.address).toString()
        expect(actualI).to.equal(expectI)

        await expect(proxyInstance.connect(acc2).upgradeToAndCall(sbtInstanceUpgrade.address,selector)).to.be.revertedWith("Initializable: contract is already initialized")
        await proxyInstance.connect(acc2).upgradeTo(sbtInstanceUpgrade.address)

        actualImplement = await web3.eth.getStorageAt(proxyInstance.address,ImplementationSlot)
        actualI =web3.utils.toBN(actualImplement).toString()
        expectI = web3.utils.toBN(sbtInstanceUpgrade.address).toString()
        expect(actualI).to.equal(expectI)

        SBTProxy = await ethers.getContractAt("SBT",proxyInstance.address)
        expect(await SBTProxy.name()).to.equal("ABC");
        expect(await SBTProxy.symbol()).to.equal("abc");
        expect(await SBTProxy.owner()).to.equal(operator.address)



    })

    
  
});