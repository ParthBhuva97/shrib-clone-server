const express = require('express')
const cors = require('cors')
const axios = require('axios')
require("dotenv").config()

const PORT = process.env.PORT || 3000
const app = express()
app.use(express.json())
app.use(cors())

app.get("/",(req,res)=>{
    res.send("Hello World!")
})

// app.get("/:id",(req,res)=>{
//     fs.readFile(`textFiles/${req.params.id}.txt`,(err,data)=>{
//         if(err) throw err;
//         res.send(data);
//     })
//     // res.send(req.params.id);
// })

app.post("/:id",(req,res)=>{
    const {textContent} = req.body;

    axios.get(`https://api.github.com/repos/ParthBhuva97/shribCloneContents/contents/${req.params.id}.txt`,{
            headers: {
                "Authorization" : `Bearer ${process.env.GITHUB_PAT}`,
                "Accept" : "application/vnd.github+json",
                "X-GitHub-Api-Version" : "2022-11-28"
            }
        }).then((res)=>{
            // console.log(res.data.sha);
            res.send(addOrUpdateFile("UPDATE",req.params.id,btoa(textContent),res.data.sha));
    }).catch((err)=>{
        res.send(addOrUpdateFile("ADD",req.params.id,btoa(textContent)));
        // console.log(err.response.data.message);
    })
})

function addOrUpdateFile(operation,id,textContent,shaValue=''){
    let data;
    if (operation === "UPDATE"){
        data = {message: `File ${id} Updated at ${Date.now()}`,content: textContent,sha: shaValue}
    }
    else if(operation === "ADD"){
        data = {message: `File ${id} Created at ${Date.now()}`,content: textContent}
    }
    axios.put(`https://api.github.com/repos/ParthBhuva97/shribCloneContents/contents/${id}.txt`,
    data
    ,{
        headers: {
            "Authorization" : `Bearer ${process.env.GITHUB_PAT}`,
            "Accept" : "application/vnd.github+json",
            "X-GitHub-Api-Version" : "2022-11-28"
        }
    }).then((res)=>{
        console.log(res.data);
        console.log("Data Saved");
        return "Data Saved";
        // res.send("Data Saved");
    }).catch((err)=>{
        return "Failed to Save Data"
    })
}

app.listen(PORT,()=>{
    console.log(`Server running on PORT ${PORT}`)
})