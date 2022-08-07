import './create.css'
import {useSave2IPFS} from '../../hooks/hooks.js'
// import Image from '../../assets/Image.png'
const Create = () => {
  let cName = "Community Name Example";
  let cDescription ="Community description";
  let cLogo ="logo";
  let cURL ="https://123.com"
  const createCommunity = useSave2IPFS(cName,cDescription,cLogo,cURL);
  return (
    <div className='create section__padding'>
      <div className="create-container">
        <form className='writeForm' autoComplete='off'>         
          <div className="formGroup">
            <label>Upload a Community logo with 100*100</label>
            <input type="file" className='custom-file-input'
          />
          </div>
          <div className="formGroup">
            <label>Set your Community Name limit to 50 words</label>
            <input type="text" placeholder='Community Name' autoFocus={true} />
          </div>
          <div className="formGroup">
            <label>Give a URL of your Community</label>
            <div className="twoForm">
              <input type="text" placeholder='Community introduction URL'  />
            </div>
          </div>
          <button className='writeButton'onClick={createCommunity} >Create my Community in Registry</button>
        </form>
      </div>
    </div>
   
  )
};

export default Create;
