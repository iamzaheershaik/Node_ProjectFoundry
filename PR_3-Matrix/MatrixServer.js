const express = require('express');
const app = express();
const PORT = 8080;
app.set("view engine", "ejs")
app.use(express.static('public'))

app.get('/', (req, res)=>{
    res.render('index')
})
app.get('/:page', (req, res)=>{
    res.render(req.params.page);
})
app.listen(PORT, ()=>{
    console.log(`Server started at port http://localhost:${PORT}`)
})