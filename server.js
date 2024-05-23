const express = require("express");
const bodyParser = require("body-parser");
const app = express();

// Middleware - บอกวิธีการที่ client ส่งข้อมูลผ่าน middleware
app.use(bodyParser.urlencoded({extended:false})) // ส่งผ่าน Form
app.use(bodyParser.json()) // ส่งด้วย Data JSON

const mysql = require("mysql2/promise");
const dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'root', // <== ระบุให้ถูกต้อง
    password: '',  // <== ระบุให้ถูกต้อง
    database: 'login',
    port: 3306  // <== ใส่ port ให้ถูกต้อง (default 3306, MAMP ใช้ 8889)
});
//  GET students

app.get('/userlist', async (req,res) => {
    const connection = await dbConn
    const rows = await connection.query('SELECT * from userlist')
    res.status(200).json(rows[0])
})

// GET students/:id 
app.get('/userlist/:id', async (req,res)=>{
    const connection = await dbConn
    const rows = await connection.query('SELECT * from userlist where id = ' +req.params.id)
    res.status(200).send(rows[0])
})

app.post("/registerUser", async (req, res) => {
    const connection = await dbConn
    // ส่งข้อมูลผ่าน body-parser (Middleware)
    const username = req.body.username;
    const password = req.body.password; 
    const email = req.body.mail;
 
    const checkUsername = await connection.query(`SELECT * FROM userlist WHERE username = '${username}'`);
    if(checkUsername[0].length ===0 ){
        // const connection = await dbConn
        console.log(`${username} ,${password} ,${email}`)
        const rows = await connection.query(`insert into userlist (username,password,email) values('${username}' ,'${password}' ,'${email}')`)
        res.json({success:"yes"})
        
    }
    else{
        res.json({success:"no"})
    }
  
})
app.post("/userLogin", async (req, res) => {
    // ส่งข้อมูลผ่าน body-parser (Middleware)
    const connection = await dbConn
    console.log(`${req.body.username},${req.body.password}`)
    const rows = await connection.query(`SELECT * from userlist where username = '${req.body.username}' and password = '${req.body.password}'`)
    console.log(rows[0])
    res.json(rows[0])
    // res.json({success:"qwe",status:201})
})

app.listen(3001, () => {
    console.log("Server is running at port 3001")
})
