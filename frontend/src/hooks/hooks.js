/* Create the IPFS CID of the json data */
import { NFTStorage } from "nft.storage";
const useSave2IPFS = async (cName,cDescription,imageData,cURL) => {

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
        {"trait_type": "Community Logo",
        "value": imageData
      },       
        {"trait_type": "Introduction URL",
      "value": cURL
      },
      
      ],
      image: imageData,          
    };

    const client = new NFTStorage({
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDhiNGFGRDdENTBiZDYxOEZlRjhhNDUzMThiYmMwMDk1YjdDMTc5RjEiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1MTgyNzE0Nzg1OCwibmFtZSI6InRleHR2ZXJzZS1wcmQifQ.nzqaau57VZE-n_RuK5wOV5gVeffDicK8EHrvSKoN7Uo"
    });
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
      console.log("imageData:::::",imageData);
    return ;
  };

  export {useSave2IPFS, useMergeSvg};