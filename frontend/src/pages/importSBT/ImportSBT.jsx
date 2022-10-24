import React, { useEffect, useState, useCallback } from 'react';
import './importsbt.css'
import templayout1 from '../../assets/SBT1-basic.png'
import templayout2 from '../../assets/SBT2-basic.png'
import { Modal, Sendsbt, ImportExcel } from '../../components'
const ImportSBT = () => {
  const [Path, setPath] = useState(templayout1)
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);
  let CommounityData = {
    CommunityLogo: "",
    CommunityName: "",
    CommunityUrl: "",
  };
  let SendData = [{
    id: 1,
    address: "0x871608cBA092105b91e91295A1d79fFC539BFb48",
    nickName: "Survivor",
    roleName: "DeSoc营地分享人"
  }, {
    id: 2,
    address: "0x871608cBA092105b91e91295A1d79fFC539BFb48",
    nickName: "Rory",
    roleName: "新人分享者"
  }];

  useEffect(() => {
    console.log(Path)
  }, [Path])
  const handleLogout = (_s) => {
    setPath(_s);
  }

  return (
    <div className='create section__padding'>
      <div className="create-container">
        <div className="flex flex-row justify-between">
          <div className='flex flex-row'>
            <h1 className='mr-10'>Import SBT</h1>
            <ImportExcel />
          </div>
          <Sendsbt />
        </div>
        <div className="flex flex-row">
          <div className="flex flex-col flex-initial w-4/12">
            <img className={Path === templayout1 ? "w-64 h-64 border-2 border-solid border-sky-500" : "w-64 h-64"} src={templayout1} onClick={() => { handleLogout(templayout1) }} alt="SBT1" />
            <img className={Path === templayout2 ? "w-64 h-64 border-2 border-solid border-sky-500" : "w-64 h-64"} src={templayout2} onClick={() => { handleLogout(templayout2) }} alt="SBT2" />
          </div>
          <div className='flex-initial w-8/12'>
            <table className='table w-full'>
              <thead>
                <tr>
                  <th>walletAddress</th>
                  <th>nickName</th>
                  <th>roleName</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <>
                  {
                    SendData.map(
                      (list) =>
                        <tr className='hover'>
                          <td>{list.address}</td>
                          <td>{list.nickName}</td>
                          <td>{list.roleName}</td>
                          <td>
                            <Modal item={list} img={Path} />
                          </td>
                        </tr>
                    )}
                </>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

  )
};

export default ImportSBT;
