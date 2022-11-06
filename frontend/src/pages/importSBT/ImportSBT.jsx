import React, { useEffect, useState, useCallback } from 'react';
import './importsbt.css'
import templayout1 from '../../assets/SBT1-basic.png'
import templayout2 from '../../assets/SBT2-basic.png'
import excelTemplate from '../../assets/template.xlsx'
import { Modal, Sendsbt, ImportExcel } from '../../components'
import * as XLSX from 'xlsx'
import InputFiles from "react-input-files";

const ImportSBT = () => {
  const [Path, setPath] = useState(templayout1)
  const [Layout, setLayout] = useState("SBT1")
  const [ExeclData, setExeclData] = useState([])
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);
  let CommounityData = {
    CommunityLogo: "",
    CommunityName: "",
    CommunityUrl: "",
  };

  const onImportExcel = (files) => {
    // 獲取上傳的文件對象
    //const { files } = file.target; // 通過FileReader對象讀取文件
    const fileReader = new FileReader();
    //console.log(fileReader);
    for (let index = 0; index < files.length; index++) {
      fileReader.name = files[index].name;
    }
    fileReader.onload = event => {
      try {
        // 判斷上傳檔案的類型 可接受的附檔名
        const validExts = new Array(".xlsx", ".xls");
        const fileExt = event.target.name;

        if (fileExt == null) {
          throw "檔案為空值";
        }

        const fileExtlastof = fileExt.substring(fileExt.lastIndexOf("."));
        if (validExts.indexOf(fileExtlastof) == -1) {
          throw "檔案類型錯誤，可接受的副檔名有：" + validExts.toString();
        }

        const { result } = event.target; // 以二進制流方式讀取得到整份excel表格對象
        const workbook = XLSX.read(result, { type: "binary" });
        let data = []; // 存儲獲取到的數據 // 遍歷每張工作表進行讀取（這裡默認只讀取第一張表）
        for (const sheet in workbook.Sheets) {
          if (workbook.Sheets.hasOwnProperty(sheet)) {
            // 利用 sheet_to_json 方法將 excel 轉成 json 數據
            data = data.concat(
              XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
            ); // break; // 如果只取第一張表，就取消註釋這行
          }
        }

        if (data.length > 0) {
          let tempdata = [];
          for (let index = 0; index < data.length; index++) {
            const element = data[index];
            if (typeof element["id"] !== "undefined") {
              tempdata.push(element)
            }
          }

          setExeclData(tempdata);
        } else {
          // 无资料
        }
        console.log(data);
      } catch (e) {
        // 這裡可以拋出文件類型錯誤不正確的相關提示
        console.log(e);
        //console.log("文件類型不正確");
        return;
      }
    }; // 以二進制方式打開文件
    fileReader.readAsBinaryString(files[0]);
  };
  useEffect(() => {
    //console.log(Path, Layout)
  }, [Path, Layout])
  const handleLogout = (_s, _l) => {
    setPath(_s);
    setLayout(_l)
  }

  return (
    <div className='create section__padding'>
      <div className="w-full create-container">
        <div className="flex flex-row justify-between">
          <div className='flex flex-row'>
            <h2 className='mr-10'><a href={excelTemplate}>1. Down Excel Template and Input your Content</a>
            <br /><span className="btn btn-primary"><a href={excelTemplate}>Download</a></span>
            </h2><br/>
            
            <br/>
            <InputFiles accept=".xlsx, .xls" onChange={onImportExcel}>
             <h2>  2. Upload Your file and Drop</h2> <button className="btn btn-primary">Upload</button>
            </InputFiles>
          </div>
          <Sendsbt data={ExeclData} img={Path} l={Layout} />
        </div>
        {
          (ExeclData.length > 0) ?
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
                        ExeclData.map(
                          (list) =>
                            <tr className='hover'>
                              <td>{list.walletAddress}</td>
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
            : null
        }
      </div>
    </div>

  )
};

export default ImportSBT;
