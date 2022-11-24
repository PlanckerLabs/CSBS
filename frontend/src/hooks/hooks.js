/* Create the IPFS CID of the json data */
//import { NFTStorage } from "nft.storage";
import { NFTStorage } from 'https://cdn.jsdelivr.net/npm/nft.storage/dist/bundle.esm.min.js'



const client = new NFTStorage({
  token: process.env.REACT_APP_NFT_STORAGE_API_KEY
});

// jhf api key ：eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDkxNjhiZDExQ2MxODIxNWM2NTNmZUQ1QjYzZjhiMTg0NDAxOTA4YjMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2NzY1MTI1ODQ3NiwibmFtZSI6ImFraXJhIn0.DvHGGXozXPzpx-i_Q6BpWWYsf5-nOgNcpFPSSwRucv8
// rory api key：eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDExNTI3YTE3RUU4MzA4NzM2MjhBMTcyNjBkNUM2OUMzNGU0ODc4NDYiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2NzU3MzA5MjE4NiwibmFtZSI6IkNTQlMifQ.Oai_r-35_kj0a8FeEywh0L5L6G7AF0kE7eIvck6-lVo

const useSave2IPFS = async (cName, cDescription, imageData, cURL) => {

  //image contains any File or Blob you want to save
  // let imageData = new File(
  //   [
  //     `${baseSVG}${name}</text></svg>`,
  //   ],
  //   `SoulTokens.svg`,
  //   {
  //     type: "image/svg+xml",
  //   }
  // );
  // console.log("imageData:::::",imageData);

  let jsonData = {
    name: cName,
    description: cDescription,
    attributes: [
      {
        "trait_type": "Community Logo",
        "value": imageData
      },
      {
        "trait_type": "Introduction URL",
        "value": cURL
      },

    ],
    image: imageData,
  };


  try {
    await client
      .store(jsonData)
      .then((metadata) => {
        // console.log(metadata)
        console.log("metadata saved", metadata);
        //   askContractToMintNft(metadata.url);
      });
  } catch (error) {
    console.log(error)
    console.log("Could not save NFT to NFT.Storage - Aborted minting");
  }
};

//   merge baseSVG and markedName into one picture
const useMergeSvg = async (baseSVG, markedName, svgName) => {
  let imageData = new File(
    [
      `${baseSVG}${markedName}</text></svg>`,
    ],
    svgName,
    {
      type: "image/svg+xml",
    }
  );
  console.log("imageData:::::", imageData);
  return;
};

//
/*
#### 活动记录内容
+ URL：活动内容（如翻译活动的页面内容）进入AR+IPFS，Hash上链
+ image：一张有意义或者代表性的图片，2Mb 以内，进入AR+IPFS，Hash上链
+ seal_list：暂空
+ event_name: 活动名称20字
+ event_value:活动的价值描述90字
+ event_id: 在官方服务器的id，可以没有
+ community_name: 社区名称（需要注册，唯一，不可重名）
+ community_seal: 暂空
+ start_time:开始时间，如果只有开始时间，认为是当天结束
+ end_time:结束时间
+ receiver:参与人（接收人），数组

#### 接受者填写内容
+ 需要参与者填写一些活动参与度信息
+ nick_name: 参与者名称
+ role: 活动扮演角色，可多选
+ job：负责工作文字描述，90字文本
+ result_url: 产出结果网址
+ self_jifen：评估自己的工作量
*/
const useSbtIPFS = async (cName, cDescription, imageData, nickName, roleName) => {
  /*
    test communityAddress :0x1613544204458181CE82240CD0ab9C114B3B899d
    cName: 'Plancker'
    cDescription: 'First CSBS Create'
  */
  let jsonData = {
    name: cName, // 社區
    description: cDescription,
    attributes: [
      {
        "trait_type": "eventName",
        "value": "大理活動參加"
      },
      {
        "trait_type": "nickName",
        "value": nickName.charAt(0).toUpperCase() + nickName.slice(1)
      },
      {
        "trait_type": "roleName",
        "value": process.env.REACT_APP_COMMU_ACT_NAME + roleName + process.env.REACT_APP_COMMU_ACT_TAIL
      },
    ],
    image: imageData,
  };

  console.log(jsonData)
  // 圖片
  // await client.storeBlob(imageData)
  let url;
  // metdata
  try {
    await client
      .store(jsonData)
      .then((metadata) => {
        console.log("metadata saved", metadata);
        url = metadata.url;
      });
  } catch (error) {
    console.log(error)
    console.log("Could not save NFT to NFT.Storage - Aborted minting");
  }
  return url;
};

export { useSave2IPFS, useMergeSvg, useSbtIPFS };