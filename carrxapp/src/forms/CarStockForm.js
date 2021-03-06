import {React,useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {TextField, 
    InputLabel, 
    Select, 
    FormControl,
    FormHelperText,
    Button
} from '@material-ui/core';
import axios from "axios";
import CommonConstant from '../constants/CommonConstant';
import { uploadFile } from 'react-s3';
import S3 from 'react-aws-s3';
const config = {
  bucketName: CommonConstant.S3_BUCKET,
  dirName: 'car-images',
  region: CommonConstant.REGION,
  accessKeyId: CommonConstant.ACCESS_KEY,
  secretAccessKey: CommonConstant.SECRET_ACCESS_KEY,
}


const config1 = {
  bucketName: CommonConstant.S3_BUCKET,
  dirName: 'media', /* optional */
  region: 'us-east-1',
  accessKeyId: CommonConstant.ACCESS_KEY,
  secretAccessKey: CommonConstant.SECRET_ACCESS_KEY
}
const ReactS3Client = new S3(config1);

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '25ch',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));


// const handleYearChange = (event) => {
//     const name = event.target.name;
//     setState({
//       ...state,
//       [name]: event.target.value,
//     });
//   };

const carRequest ={
    "vin":"",
  "model":"",
   "maker":"",
   "engine":"",
  "year":"",
  "imgUrl":"",
  "milleage":"",
  "price":""
}

export default function CarStockForm() {
  const classes = useStyles();
  const [data, setData] = useState(carRequest);
  const [image, setImage] = useState(null);
  const [selectedFile,setSelectedFile] = useState(null)
  const [apiResponse, setAPIResponse] = useState("");

  const onImageChange = event => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
     console.log(img.name)
      setSelectedFile(img)
      const url = URL.createObjectURL(img);
      setImage(url)
      console.log(url)
    }
  };
  const handleUpload = async (file) => {
    // uploadFile(file, config)
    //     .then(data => console.log(data))
    //     .catch(err => console.error(err))

    const newFileName = 'test-file.jpg';

ReactS3Client
    .uploadFile(file, newFileName)
    .then(data => console.log(data))
    .catch(err => console.error(err))
}


  const handleInputChange = e => {
    e.preventDefault();
    //code below is an example deconstruct
    const { name, value } = e.target;
    // ...data
    
    setData({
      ...data,
      [name]: value
    });  
  }


  const handleCreateButton = (event) => {
    event.preventDefault();   
    console.log(data)
    handleUpload(selectedFile)
    data.imgUrl = selectedFile.name
    axios.post(  
    CommonConstant.CREATE_CAR_API_ENDPOINT , data
      ).then((response) => {
        //It means the API is working
        console.log(response);
        setAPIResponse(response.data);
        //clear all the textfields after submitting
        setData({
          "vin":"",
        "model":"",
         "maker":"",
         "engine":"",
        "year":"",
        "imgUrl":"",
        "milleage":"",
        "price":""
      }
      )
      }, (error) => {
        console.log(error);
      });
  }




  return (
    <div className={classes.root}>
      <div>
        <TextField
          value = {data.vin}
          id="standard-full-width"
          label="VIN"
          name="vin"
          style={{ margin: 8 }}
          placeholder="Vehicle ID"         
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={handleInputChange}
        />
        <TextField
         value = {data.model}
          id="standard-full-width"
          label="Model"
          name="model"
          style={{ margin: 8 }}
          placeholder="Model Name"         
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={handleInputChange}
        />
           <TextField
           value = {data.maker}
          id="standard-full-width"
          label="Maker"
          name="maker"
          style={{ margin: 8 }}
          placeholder="Manufacturer"         
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={handleInputChange}
        />
        <TextField
           value = {data.milleage}
          id="standard-full-width"
          label="MPG"
          name="milleage"
          style={{ margin: 8 }}
          placeholder="Milleage"         
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={handleInputChange}
        />
           <TextField
            value = {data.engine}
          id="standard-full-width"
          label="Engine"
          name="engine"
          style={{ margin: 8 }}
          placeholder="Engine Type"         
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={handleInputChange}
        />
          <TextField
             value = {data.price}
          id="standard-full-width"
          label="Price"
          name="price"
          style={{ margin: 8 }}
          placeholder="Sales Price"         
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={handleInputChange}
        />
         <FormControl required className={classes.formControl}>
        <InputLabel htmlFor="age-native-required">Year</InputLabel>
        <Select
          native
          value = {data.year}
          name="year"
          inputProps={{
            id: 'age-native-required',
          }}
          onChange={handleInputChange}
        >
          <option aria-label="None" value="" />
          <option value={2000}>2000</option>
          <option value={2020}>2020</option>
          <option value={2021}>2021</option>
        </Select>
        <FormHelperText>Required</FormHelperText>
      </FormControl>

        <div>
            <img src={image} />
            <h1>Select Image</h1>
            <input type="file" name="imgUrl" onChange={onImageChange} />
            {/* <button onClick={() => handleUpload(selectedFile)}> Upload to S3</button> */}
          </div>

          <br/>

          <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={handleCreateButton}
            >
            Create Car
            </Button>
            <p>
              <b style={{color:'green'}}>{apiResponse}</b>
            </p>
      </div>

    
    </div>
  );
}
