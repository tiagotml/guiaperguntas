const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const connection = require('./database/database');
const Pergunta = require('./database/Perguntas');
const Resposta = require('./database/Resposta');

connection.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.log(error);
});

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
}
);
// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Rotas
app.get('/', (req, res) => {
    Pergunta.findAll({
        raw: true, order: [
            ['id', 'DESC']
        ]
    }).then((perguntas) => {
        res.render('index', {
            perguntas: perguntas
        });
    });

});

app.get('/perguntar', (req, res) => {
    res.render('perguntar');
});

app.post('/salvarpergunta', (req, res) => {
    const { titulo, descricao } = req.body;
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect('/');
    });
});

app.get('/pergunta/:id', (req, res) => {
    const { id } = req.params;
    // busca um dado com uma condição
    Pergunta.findOne({
        where: { id: id }
    }).then((pergunta) => {
        if (pergunta != undefined) { // pergunta encontrada
            Resposta.findAll({
                where: { perguntaId: pergunta.id },
                order: [
                    ['id', 'DESC']
                ]
            }).then((respostas) => {
                res.render('pergunta', {
                    pergunta: pergunta,
                    respostas: respostas
                });
            });

        }
        else {
            res.redirect('/');
        }
    })
});
app.post('/responder', (req, res) => {
    const { corpo, perguntaId } = req.body;
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect('/pergunta/' + perguntaId);
    });
});
app.post('/pergunta/:id/deletar', (req, res) => {
    const { respostaId } = req.body;
    Resposta.destroy({
        where: { id: respostaId }
    }).then(() => {
        res.redirect('/pergunta/' + req.params.id);
    }
    );
});
app.post('/deletar', (req, res) => {
    const { perguntaId } = req.body;
    Pergunta.destroy({
        where: { id: perguntaId }
    }).then(() => {
        res.redirect('/');
    }
    );
});