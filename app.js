var express = require('express')
const app = express()

const PORT = 3000

pathBD = 'mongodb+srv://wanessalanne:usmileismilejb96@cluster0.eebma.mongodb.net/biblioteca?retryWrites=true&w=majority'

var mongoose = require('mongoose')
mongoose.connect(pathBD, { useNewUrlParser: true, useUnifiedTopology: true })
const Livros = mongoose.model(
    "livros",
    {
        titulo: String,
        autor: String,
        isbn: Number,
        editora: String,
        anoPublicacao: Number,
        edicao: Number,
        localizacao: String,
        status: String,
    }
)
app.set("view engine", "ejs")
app.set("views", __dirname, "/views")
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', (req, res) => {
    res.render('./views/pages/index')
})

app.get('/cadastro', (req, res) => {
    // res.send('Está é a página de cadastro de livros')
    res.render('./views/pages/cadastro')
})

app.post('/cadastro', (req, res) => {
    let livro = new Livros()
    livro.titulo = req.body.titulo
    livro.autor = req.body.autor
    livro.isbn = req.body.isbn
    livro.editora = req.body.editora
    livro.anoPublicacao = req.body.anoPublicacao
    livro.edicao = req.body.edicao
    livro.localizacao = req.body.localizacao
    livro.status = req.body.status

    livro.save(err => {
        if (err) {
            console.log(err)
            return res.redirect('/errocadastro')
        }
        res.redirect('/cadastroSucesso')
    })

})

app.get('/cadastroSucesso', (req, res) => {
    res.render('./views/pages/cadastroSucesso')
})
app.get('/errocadastro', (req, res) => {
    res.render('./views/pages/errocadastro')
})

app.get('/lista-livros', (req, res) => {
    Livros.find({}, (err, livro) => {
        if (err) {
            return console.log(err)
        }
        res.render('./views/pages/listalivros', { lista_livros: livro })
    })

})

app.post("/pesquisa", (req, res) => {
    var pesquisar_livros = req.body.query;
    
  Livros.find(
        {$or: [
        {titulo: {$regex: new RegExp('.' + pesquisar_livros + '.', 'i')}},
        {autor: {$regex: new RegExp('.' + pesquisar_livros + '.', 'i')}},
        {isbn: {$regex: new RegExp('.' + pesquisar_livros + '.', 'i')}},
        {editora: {$regex: new RegExp('.' + pesquisar_livros + '.', 'i')}},
        {anoPublicacao: {$regex: new RegExp('.' + pesquisar_livros + '.', 'i')}},
        {localizacao: {$regex: new RegExp('.' + pesquisar_livros + '.', 'i')}},
        {status: {$regex: new RegExp('.' + pesquisar_livros + '.', 'i')}},      
    ]}
        , (err, livro) => {
        if (err) {
            return resposta.status(500).send("Erro ao fazer a busca");
        }

        resposta.render("listalivros",{lista_livros: livro});

    });
});

app.get('/deletar-livro/:id', (req, res) => {
    let id = req.params.id
    Livros.deleteOne({ _id: id }, (err, livro) => {
        if (err) {
            return console.log(err)
        }
        res.redirect('/lista-livros')
    })

})

app.get('/editar/:id', (req, res) => {
    id = req.params.id

    Livros.findById({ _id: id }, (err, livro) => {
        if (err) {
            return console.log(err)
        }
        res.render('./views/pages/editar', { livro: livro })
    })
})

app.post('/editar', (req, res) =>{
    id = req.body.id
    Livros.findById({_id: id}, (err, livro) => {
        if (err){
            return console.log(err)
        }
        livro.titulo = req.body.titulo
        livro.autor = req.body.autor
        livro.isbn = req.body.isbn
        livro.editora = req.body.editora
        livro.anoPublicacao = req.body.anoPublicacao
        livro.edicao = req.body.edicao
        livro.localizacao = req.body.localizacao

        livro.save( err => {
            if(err){
                console.log(err)
                return res.redirect('/errocadastro')
            }
            res.redirect('/lista-livros')
        })
    })
})

app.listen(PORT, () => {
    console.log("Servidor rodando na porta " + PORT)
})




