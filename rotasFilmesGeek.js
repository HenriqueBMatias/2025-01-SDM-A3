export default function rotasFilmesGeek(server, db, auth) {

    server.get('/filmes_geek', auth.middlewareAuth, (req, res) => {
        const filmes = db.get("/filmes_geek");
        res.status(200).json(filmes);
    });

    server.post('/filmes_geek', auth.middlewareAuth, (req, res) => {
        let id = db.newID("FILMEGEEK-");
        let data = { id, ...req.body };
        db.set("/filmes_geek/" + data.id, data);
        res.status(201).json({ msg: "Inserção ok.", data });
    });

    server.put('/filmes_geek/:id', auth.middlewareAdmin, (req, res) => {
        const id = req.params.id;
        const filme = db.get("/filmes_geek/" + id);
        if (filme == null) {
            return res.status(404).json({ msg: "Filme não encontrado." });
        }
        const data = { ...filme, ...req.body, id };
        db.set("/filmes_geek/" + id, data);
        res.status(200).json({ msg: "Alteração ok.", data });
    });

    server.delete('/filmes_geek/:id', auth.middlewareAdmin, (req, res) => {
        const id = req.params.id;
        const filme = db.get("/filmes_geek/" + id);
        if (filme == null) {
            return res.status(404).json({ msg: "Filme não encontrado." });
        }
        db.set("/filmes_geek/" + id, null);
        res.status(200).json({ msg: "Exclusão ok." });
    });
}