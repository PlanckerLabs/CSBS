import React, { useEffect, useState, useCallback } from 'react';
import './importsbt.css'
import templayout1 from '../../assets/SBT1-basic.png'
import templayout2 from '../../assets/SBT2-basic.png'
import { Modal, Sendsbt, ImportExcel } from '../../components'
const ImportSBT = () => {
  const [Path, setPath] = useState(templayout1)
  const [Layout, setLayout] = useState("SBT1")
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);
  let CommounityData = {
    CommunityLogo: "",
    CommunityName: "",
    CommunityUrl: "",
  };
  let SendData = [{
    id: 1,
    address: "0xEbCa532F2933Ce328E3Db97EbDa99b47f09635a6",
    nickName: "Survivor",
    roleName: "DeSoc营地分享人"
  }, {
    id: 2,
    address: "0xa1fe7CA38462b3567D4f915eF7c1b56938c251A4",
    nickName: "Rory",
    roleName: "新人分享者"
  }];

  useEffect(() => {
    //console.log(Path, Layout)
  }, [Path, Layout])
  const handleLogout = (_s, _l) => {
    setPath(_s);
    setLayout(_l)
  }

  return (
    <div className='create section__padding'>
      <div className="create-container">
        <div className="flex flex-row justify-between">
          <div className='flex flex-row'>
            <h1 className='mr-10'>Import SBT</h1>
            <ImportExcel />
          </div>
          <Sendsbt data={SendData} img={Path} l={Layout} />
        </div>
        <div className="flex flex-row">
          <div className="flex flex-col flex-initial w-4/12">
            <img className={Path === templayout1 ? "w-64 h-64 border-2 border-solid border-sky-500" : "w-64 h-64"} src={templayout1} onClick={() => { handleLogout(templayout1, "SBT1") }} alt="SBT1" />
            <img className={Path === templayout2 ? "w-64 h-64 border-2 border-solid border-sky-500" : "w-64 h-64"} src={templayout2} onClick={() => { handleLogout(templayout2, "SBT2") }} alt="SBT2" />
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
                            <Modal item={list} img={Path} l={Layout} />
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
