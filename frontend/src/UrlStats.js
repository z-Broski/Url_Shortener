import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from "axios"
import './App.css';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

export default function UrlStats() {

  let navigate = useNavigate();
  let { shortUrl } = useParams();
  const API_URL = "http://localhost:3001/shortUrl/"

  const [stats, setStats] = useState([])

  useEffect(() => {
    const getData = async () => {
        const myUrl = API_URL + shortUrl
        try {
          const response = await axios.get(myUrl);
          if (response.data.length !== 0) {
            setStats(response.data);
          } else {
            setStats([true])
          }
        } catch (err) {
          setStats([false])
        }
      };
      getData();
  }, [shortUrl]);


  const deleteShortUrl = async () => {
    const deleteUrl = API_URL + shortUrl
    await axios.delete(deleteUrl);
    navigate("/");
  }


  if (stats.length === 0) {
    return null
  } else if (stats[0] === false) {
    return (
      <div className='App'>
        <h2>404 - Short url not found</h2>
      </div>
    )
  } else if (stats[0] === true) {
    return (
      <div className='App'>
        <h2>Short url {shortUrl} hasn't been clicked yet</h2>
        <Button className="deleteButton" variant="contained" color="error" onClick={() => deleteShortUrl()}>Delete short url</Button>
      </div>
    )
  } else {
    return (
      <div className='App'>
        <h4>Stats for url: {shortUrl}</h4>
          <TableContainer component={Paper}>
          <div style={{ overflow: 'auto', height: '480px' }}>
            <Table className="tableContainer" sx={{ minWidth: 250, tableLayout: "fixed" }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell><b>Date</b></TableCell>
                  <TableCell align="left"><b>Clicks</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stats.map((row) => (
                  <TableRow
                  key={row.event_date}
                  >
                    <TableCell component="th" scope="row">
                      {row.event_date}
                    </TableCell>
                    <TableCell align="left">{row.click_count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          </TableContainer>
          <Button className="deleteButton" variant="contained" color="error" onClick={() => deleteShortUrl()}>Delete short url</Button>
      </div>
    );
  }
};
