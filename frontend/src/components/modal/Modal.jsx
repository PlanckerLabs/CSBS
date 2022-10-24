import React, { useEffect, useRef } from 'react';

const Modal = (props) => {
  const myCanvas = useRef();
  useEffect(() => {
    const context = myCanvas.current.getContext("2d");
    const image = new Image();

    image.onload = () => {
      context.drawImage(image, 10, 10, 3840, 3840);
      if (props["l"] === "SBT1") {
        context.fillStyle = '#1C98A8';
      } else if (props["l"] === "SBT2") {
        context.fillStyle = '#A57949';
      } else {
        context.fillStyle = '#FFFFFF';
      }
      context.font = "700 200px Inter";
      context.textAlign = "center";
      context.fillText(props.item.nickName, 1920, 3520);
      context.font = "600 150px Inter";
      context.textAlign = "center";
      context.fillText(props.item.roleName, 1920, 3750);
    };
    image.src = props.img;
  });

  return (
    <div>
      <label for={`my-modal-${props.item.id}`} className="btn modal-button">View</label>
      <input type="checkbox" id={`my-modal-${props.item.id}`} className="modal-toggle" />
      <div className="modal">
        <div className="relative modal-box">
          <label for={`my-modal-${props.item.id}`} className="absolute btn btn-sm btn-circle right-2 top-2">✕</label>
          <h3 className="text-lg font-bold">{props.item.nickName}-{props.item.roleName}</h3>
          <div>
            <canvas ref={myCanvas} width={3840} height={3840} style={{ height: '400px' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal
