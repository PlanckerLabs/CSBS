import './create.css'
import Image from '../../assets/Image.png'
const Create = () => {

  return (
    <div className='create section__padding'>
      <div className="create-container">
        {/* <h1>Create my community</h1> */}
        {/* <div className="upload-img-show">
            <h3>JPG, PNG, GIF, SVG, WEBM, MP3, MP4. Max 100mb.</h3>
            <img src={Image} alt="banner" />
            <p>Drag and Drop File</p>
        </div> */}
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
          {/* <div className="formGroup">
            <label>Give a Description or just a Motto to introduce</label>
            <textarea type="text" rows={4}
          placeholder='Decription of your community' 
          ></textarea>
          </div> */}
          <div className="formGroup">
            <label>Give a URL of your Community</label>
            <div className="twoForm">
              <input type="text" placeholder='Community introduction URL'  />
            </div>
          </div>
          <button className='writeButton'>Create my Community in Registry</button>
        </form>
      </div>
    </div>
   
  )
};

export default Create;
