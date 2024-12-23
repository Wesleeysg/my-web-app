const express = require("express");
const mysql = require('mysql2');
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: 'mysql-aula.cuebxlhckhcy.us-east-1.rds.amazonaws.com',
  user: 'mysqlaula',
  password: 'MySQLAula123!', // Substitua pela sua senha do MySQL
  database: 'healthyfit'
});

connection.connect((err) => {
  if (err) {
      console.error('Erro ao conectar ao banco de dados:', err);
      return;
  }
  console.log('Conexão bem-sucedida com o banco de dados.');
});

  app.post("/saveImc",(req,res) =>{
    const {altura, peso, imc} = req.body;

    if (!altura || !peso || !imc) {
        return res.status(400).send("Dados incompletos!");
    }
    

    const query = "INSERT INTO imc_data (altura, peso, imc) VALUES (?, ?, ?)";

    connection.query(query, [altura, peso, imc], (err, result) => {
        if (err) {
          console.error("Erro ao salvar:", err);
          res.status(500).send("Erro ao salvar.");
        } else {
          res.status(200).send("Dados salvos com sucesso!");
        }
      });
    });

    app.post("/classificacaoImc",(req,res) =>{
      const{imc} = req.body;

      if (!imc) {
        return res.status(400).send("IMC não recebido");
      }
      let classificacao;
      if(imc >= 30)
        classificacao ="Obesidade";
      else if(imc > 24.9)
        classificacao ="Sobrepeso";
      else if(imc > 18.5)
        classificacao ="Peso Normal";
      else
        classificacao ="Abaixo do peso";
    
        return res.json({classificacao});
    })

    app.get("/getImcData", (req, res) =>{
      const query = "SELECT * FROM imc_data";
    console.log("Requisição histórico chegou!")
      connection.query(query, (err, results) =>{
        if(err){
          console.error("Erro ao buscar os dados:", err);
          res.status(500).send("Erro ao buscar os dados")
        } else{
          res.status(200).json(results);
        }
      })
    })

  // Iniciar o servidor na porta 3000
app.listen(3000, () => {
  console.log("Servidor backend rodando na porta 3000");
});