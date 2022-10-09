import './create.css'
import Image from '../../assets/Image.png'
import React from "react";
import * as XLSX from 'xlsx'

export class Create extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e) {
      const files = e.target.files[0];
      let reader = new FileReader()
      reader.readAsBinaryString(files)
      reader.onload = function (event) {
        try {
            let result = event.target.result
            let xlsxdata = XLSX.read(result, { type: 'binary' })
            console.log(xlsxdata)
            for (let n in xlsxdata.Sheets) {
                let col = XLSX.utils.sheet_to_json(xlsxdata.Sheets[n], { header: 1, defval: '', blankrows: false })
                console.log(col)
            }
        } catch (err) {

        }
    }
  }
  
  render() {
    return (
          <div className='create section__padding'>
      <div className="create-container">
        <h1>Create community</h1>
        <p className='upload-file'>Upload File</p>
        <div className="upload-img-show">
            <h3>JPG, PNG, GIF, SVG, WEBM, MP3, MP4. Max 100mb.</h3>
            <img src={Image} alt="banner" />
            <p>Drag and Drop File</p>
        </div>
        <form className='writeForm' autoComplete='off'>
          
          <div className="formGroup">
            <label>Upload</label>
            <input type="file" className='custom-file-input' onChange={this.handleChange}
          />
          </div>
          <div className="formGroup">
            <label>Name</label>
            <input type="text" placeholder='Item Name' autoFocus={true} />
          </div>
          <div className="formGroup">
            <label>Description</label>
            <textarea type="text" rows={4}
          placeholder='Decription of your item' 
          ></textarea>
          </div>
          <div className="formGroup">
            <label>Price</label>
            <div className="twoForm">
              <input type="text" placeholder='Price'  />
              <select>
                <option value="ETH">ETH</option>
                <option value="BTC">BTC</option>
                <option value="LTC">LTC</option>
              </select>
            </div>
          </div>
          <div className="formGroup">
            <label>Category</label>
            <select >
               <option>Art</option>
               <option>Photography</option>
               <option>Sports</option>
               <option>Collectibles</option>
               <option>Trading Cards</option>
               <option>Utility</option>
            </select>
          </div>
          <div className="formGroup">
            <label>Available Items</label>
            <input type="text" placeholder='No of Items'/>
          </div>
          <button className='writeButton'>Create Item</button>
        </form>
      </div>
    </div>
    );
  }
}


export default Create;
