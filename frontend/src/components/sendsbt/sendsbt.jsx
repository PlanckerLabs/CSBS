import React, { useEffect, useRef, useState } from 'react';
import { useContract, useContractWrite, useChainId, useAccount } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import CommunitySBTABI from '../../abi/CommunitySBT.json';
import { sbtIPFS } from '../../hooks/hooks';


const Sendsbt = (props) => {
  let cName = process.env.REACT_APP_COMMU_NAME;
  let cDescription = process.env.REACT_APP_COMMU_DISC;
  const myCanvas = useRef();
  const closeModal = useRef();
  const [MssageData, setMssageData] = useState('')
  const chainId = useChainId();
  const Account = useAccount();

  const { contract } = useContract(process.env.REACT_APP_PRODUCT_POLYGON_CONTRACT_ADDR, CommunitySBTABI);
  console.log("contract: ", process.env.REACT_APP_RORY_CONTRACT_ADDR)

  const {
    mutateAsync: sedsbt,
  } = useContractWrite(contract, "issueBatchSBTWithEvent");

  const CreateImageBob = async (item) => {
    let base64path;
    await addImageProcess(props.img, item).then(
      (path) => {
        base64path = path;
      }
    );
    return base64path;
  }

  const SBTexist = async (address, tokenId) => {
    try {
      const exist = await contract.call("addressAwardedMap", ethers.utils.solidityKeccak256(['address', 'uint256'], [address, tokenId]))
      return exist;
    } catch (error) {
      console.log(error)
      return 1;
    }
  }
  const checkSigner = async () => {
    try {
      const result = await contract.call("communityEventMap", 1)
      //console.log(Account, result.communitySigner)
      if (Account[0].data.address === result.communitySigner) {
        return 1;
      } else {
        return 0;
      }
    } catch (error) {
      console.log(error)
      return 0;
    }

  }
  function addImageProcess(src, item) {
    return new Promise((resolve) => {
      const context = myCanvas.current.getContext("2d");
      let img = new Image()
      img.onload = () => {
        context.drawImage(img, 0, 0, 3840, 3840);
        if (props["l"] === "SBT1") {
          context.fillStyle = '#1C98A8';
        } else if (props["l"] === "SBT2") {
          context.fillStyle = '#A57949';
        } else {
          context.fillStyle = '#FFFFFF';
        }
        context.font = "600 150px Inter";
        context.textAlign = "center";
        let _roleName = process.env.REACT_APP_COMMU_ACT_NAME + item.roleName + process.env.REACT_APP_COMMU_ACT_TAIL
        context.fillText(_roleName, 1920, 3750);
        resolve(myCanvas.current.toDataURL("image/png"))
      };
      img.src = src
    })
  }

  const SendSBT = async () => {
    let address = [];
    let metadata = [];

    try {
      if (checkChainId()) {
        let singer = await checkSigner()
        if (singer) {
          setMssageData('Start Send ...')
          for (let index = 0; index < props.data.length; index++) {

            const list = props.data[index];
            let exists = await SBTexist(list.walletAddress, 1);
            setMssageData(`IPFS UPLOAD .... ${list.walletAddress}`)

            if (!exists) {
              console.log('in')
              let imageData = await CreateImageBob(list)
              let blob = await (await fetch(imageData)).blob()
              let file = new File([blob], "image.png", { type: 'image/png' });
              let url = await sbtIPFS(cName, cDescription, file, list.roleName);
              metadata.push(url)
              address.push(list.walletAddress)
            }
          }
          setMssageData(`Send SBT...`);
          if (metadata.length > 0) {
            let Sentresult = await sedsbt([1, address, metadata]);
            console.log('rrrr', Sentresult)
            if (Sentresult.receipt.status === 1) {
              setMssageData('Success...')
              console.log('上傳完畢')
              setTimeout(() => {
                closeModal.current.click();
              }, 10000);
            } else {
              setMssageData('error....')
            }
          } else {
            setMssageData('Over...')
            setTimeout(() => {
              closeModal.current.click();
            }, 10000);
          }

        } else {
          setMssageData('not communitySigner!!')

        }
      } else {
        setMssageData('Switch Mumbai NetWork!!')
      }
    } catch (error) {
      setMssageData('error....')
      console.log(error)
    }

  }
  function checkChainId() {
    /*
      Main Network
        ETH:1,
        BSC:56,
        AVA:43114,
        Fantom:250,
        Polygon:137,
        Arbitrum One:42161,
        OP:10
      TestNetWork
        Goerli:5
        BSC:97
        Mumbai:80001
    */
    let chainIds = [1, 56, 43114, 250, 137, 42161, 10, 5, 97, 80001]
    if (chainIds.indexOf(chainId) > -1) {
      return true;
    }
    return false;
  }

  useEffect(() => {

  });

  return (
    // 發送sbt 功能
    // 先跳警語我們將上傳
    // 上傳社區資料+IPFS -> address,url
    // 開始上傳 SBT IPFS
    // 互叫智能合約
    <div>
      <h2>  3. Batch drop SBT to Destination addresses</h2>
      <label htmlFor="my-modal-g" className="btn btn-active btn-primary">Drop</label>
      <input type="checkbox" id="my-modal-g" className="modal-toggle" />

      <div className="modal">
        <div className="relative modal-box">
          <label ref={closeModal} htmlFor="my-modal-g" className="absolute btn btn-sm btn-circle right-2 top-2">✕</label>
          <h3 className="text-lg font-bold">Ready?</h3>
          <p className="py-4">Confirm and ～～Launch!</p>
          <h3>{MssageData}</h3>
          <label onClick={SendSBT} className="btn btn-info">Confirm</label>
          <canvas ref={myCanvas} width={3840} height={3840} style={{ display: 'none' }} />
        </div>
      </div>
    </div>
  )
}

export default Sendsbt
