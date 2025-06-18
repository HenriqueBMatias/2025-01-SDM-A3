export default function rotasLivrosFantasia(server, db, auth) {

    server.get('/livros_fantasia_medieval', auth.middlewareAuth, (req, res) => {
        const livros = db.get("/livros_fantasia_medieval");
        res.status(200).json(livros);
    });

    server.post('/livros_fantasia_medieval', auth.middlewareAuth, (req, res) => {
        const id = req.body.nome.toLowerCase().replace(/\s+/g, '_');
         if (db.get(`/livros_fantasia_medieval/${id}`)) {
            return res.status(409).json({ msg: "Um livro com este nome já existe.", id });
        }
        const data = { id, ...req.body };
        db.set(`/livros_fantasia_medieval/${id}`, data);
        res.status(201).json({ msg: "Livro inserido com sucesso.", data });
    });

    server.put('/livros_fantasia_medieval/:id', auth.middlewareAdmin, (req, res) => {
        const id = req.params.id;
        const livro = db.get(`/livros_fantasia_medieval/${id}`);
        if (livro == null) {
            return res.status(404).json({ msg: "Livro não encontrado." });
        }
        const data = { ...livro, ...req.body, id };
        db.set(`/livros_fantasia_medieval/${id}`, data);
        res.status(200).json({ msg: "Livro alterado com sucesso.", data });
    });

    server.delete('/livros_fantasia_medieval/:id', auth.middlewareAdmin, (req, res) => {
        const id = req.params.id;
        const livro = db.get(`/livros_fantasia_medieval/${id}`);
        if (livro == null) {
            return res.status(404).json({ msg: "Livro não encontrado." });
        }
        db.set(`/livros_fantasia_medieval/${id}`, null);
        res.status(200).json({ msg: "Livro excluído com sucesso." });
    });
}