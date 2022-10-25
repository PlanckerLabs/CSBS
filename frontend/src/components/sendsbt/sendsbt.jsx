import React, { useEffect, useRef } from 'react';
import { useSbtIPFS } from '../../hooks/hooks.js'
const Sendsbt = (props) => {
  let cName = "Community Name Example";
  let cDescription = "Community description";
  const myCanvas = useRef();

  const CreateImageBob = async (item) => {
    let base64path = await addImageProcess(props.img, item)
    return base64path
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
    props.data.map(
      async (list) => {
        let imageData = await CreateImageBob(list)
        let blob = dataURItoBlob(imageData)
        let file = new File([blob], "image.png", { type: 'image/png' });
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useSbtIPFS(cName, cDescription, file, list.nickName, list.roleName);
      }
    );
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
      <label htmlFor="my-modal-g" className="btn btn-active btn-primary">發送</label>
      <input type="checkbox" id="my-modal-g" className="modal-toggle" />
      <div className="modal">
        <div className="relative modal-box">
          <label htmlFor="my-modal-g" className="absolute btn btn-sm btn-circle right-2 top-2">✕</label>
          <h3 className="text-lg font-bold">Congratulations random Internet user!</h3>
          <p className="py-4">You've been selected for a chance to get one year of subscription to use Wikipedia for free!</p>
          <button onClick={SendSBT} class="btn btn-info">確定</button>
          <canvas ref={myCanvas} width={3840} height={3840} />
        </div>
      </div>
    </div>
  )
}

export default Sendsbt
