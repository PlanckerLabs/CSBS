import React, { useEffect, useState } from 'react';

const Sendsbt = (props) => {

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
        </div>
      </div>
    </div>
  )
}

export default Sendsbt
