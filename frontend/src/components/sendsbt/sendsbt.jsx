import React, { useEffect, useRef, useState } from 'react';
import { useContract, useContractRead, useContractWrite, useChainId, useAccount } from '@thirdweb-dev/react';
import { ethers } from 'ethers'
import CommunitySBTABI from '../../abi/CommunitySBT.json';
import { useSbtIPFS } from '../../hooks/hooks'


const Sendsbt = (props) => {
  let cName = "CSBS";
  let cDescription = "CSBS description";
  const myCanvas = useRef();
  const [MssageData, setMssageData] = useState('')
  const chainId = useChainId();
  const Account = useAccount();
  const { contract } = useContract("0x3CA7dCA365D135e51210EFFE70b158cCd82d3deF", CommunitySBTABI);
  const {
    mutateAsync: sedsbt,
  } = useContractWrite(contract, "issueBatchSBTWithEvent");




  const CreateImageBob = async (item) => {
    let base64path = await addImageProcess(props.img, item)
    return base64path
  }

  const SBTexist = async (address, tokenId) => {
    try {
      //console.log(ethers.utils)
      //console.log('aa', ethers.utils.solidityKeccak256(['address', 'uint256'], [address, tokenId]))
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
    return new Promise((resolve, reject) => {
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
        context.font = "700 200px Inter";
        context.textAlign = "center";
        context.fillText(item.nickName, 1920, 3520);
        context.font = "600 150px Inter";
        context.textAlign = "center";
        context.fillText(item.roleName, 1920, 3750);
        resolve(myCanvas.current.toDataURL("image/png"))
      };
      img.src = src
    })
  }

  const SendSBT = async () => {
    let address = [];
    let metadata = [];

    try {
      if (chainId === 80001) {
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
              let blob = dataURItoBlob(imageData)
              let file = new File([blob], "image.png", { type: 'image/png' });
              // eslint-disable-next-line react-hooks/rules-of-hooks
              let url = await useSbtIPFS(cName, cDescription, file, list.nickName, list.roleName);
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
            } else {
              setMssageData('error....')
            }
          } else {
            setMssageData('Over...')
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
  function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
      byteString = atob(dataURI.split(',')[1]);
    else
      byteString = unescape(dataURI.split(',')[1]);
    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], { type: mimeString });
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
      <label htmlFor="my-modal-g" className="btn btn-active btn-primary">Drop</label>
      <input type="checkbox" id="my-modal-g" className="modal-toggle" />
      <div className="modal">
        <div className="relative modal-box">
          <label htmlFor="my-modal-g" className="absolute btn btn-sm btn-circle right-2 top-2">✕</label>
          <h3 className="text-lg font-bold">準備</h3>
          <p className="py-4">點下確認開始～～發送</p>
          <h3>{MssageData}</h3>
          <button onClick={SendSBT} class="btn btn-info">確定</button>
          <canvas ref={myCanvas} width={3840} height={3840} style={{ display: 'none' }} />
        </div>
      </div>
    </div>
  )
}

export default Sendsbt
