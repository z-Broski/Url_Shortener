import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useState } from 'react';
import axios from "axios"
import { useRef } from 'react';
import { useNavigate } from "react-router-dom";
import './App.css';

export default function App() {

  const API_URL = "http://localhost:3001/shortUrl"
  const REDIRECT_URL = "http://localhost:3001/u/"

  const inputRef = useRef(null);
  const [longUrl, setLongUrl] = useState("")
  const [shortUrlPath, setShortUrlPath] = useState("")

  let navigate = useNavigate(); 

  const createShortUrlPath = async(url) => {
    try {
      let response = await axios.post(API_URL, {
        longUrl: url,
      });
      setLongUrl(url)
      setShortUrlPath(response.data)
   } catch (err) {
    alert("Couldn't validate url")
   }
  }

  return (
    <div className="App">
      <div className="urlAndShorten">
        <TextField className="textField" id="outlined-basic" label="Enter URL" variant="outlined" inputRef={inputRef} />
        <Button variant="contained" onClick={() => createShortUrlPath(inputRef.current.value)}>Shorten url</Button>
      </div>
      {shortUrlPath.length > 0 &&
        <div>
          <h4>Short url to page {longUrl} is <a href={REDIRECT_URL + shortUrlPath}>{REDIRECT_URL}{shortUrlPath}</a></h4>
          <Button variant="contained" onClick={() => navigate(shortUrlPath)}> URL Stats </Button>
        </div>         
      }
    </div>
  );
};
