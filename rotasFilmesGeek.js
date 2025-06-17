// Arquivo: rotasFilmesGeek.js
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

//Codigo personalizado
/*export default function rotasFilmesGeek(server, db) {

    server.get('/filmes_geek', (req, res) => {
        let filmes = db.get("/filmes_geek")
        res.status(200).json(filmes)
    });
    
    server.post('/filmes_geek', (req, res) => {
        let id = db.newID("FILMEGEEK-")
        let data = { id, ...req.body }
        db.set("/filmes_geek/" + data.id, data)
        res.status(201).json({ msg: "Inserção ok.", data })
    });
    
    server.put('/filmes_geek/:id', (req, res) => {
        let id = req.params.id;
        let filme = db.get("/filmes_geek/" + id)
        if (filme == null) {
            res.status(400).json({ msg: "Filme não existe." })
            return
        }
        let data = { id, ...req.body }
        db.set("/filmes_geek/" + data.id, data)
        res.status(201).json({ msg: "Alteração ok.", data })
    });
    
    server.delete('/filmes_geek/:id', (req, res) => {
        let id = req.params.id;
        let filme = db.get("/filmes_geek/" + id)
        if (filme == null) {
            res.status(400).json({ msg: "Filme não existe." })
            return
        }
        db.set("/filmes_geek/" + id, null)
        res.status(201).json({ msg: "Exclusão ok." })
    });

}*/
//Codigo Original
/*export default function rotasFilmes(server, db) {

    server.get('/filmes', (req, res) => {
        let filmes = db.get("/filmes")
        res.status(200).json(filmes)
    });
    
    server.post('/filmes', (req, res) => {
        let id = db.newID("FILME-")
        let data = { id, ...req.body }
        db.set("/filmes/"+data.id, data)
        res.status(201).json({ msg: "Inserção ok.", data })
    });
    
    server.put('/filmes/:id', (req, res) => {
        let id = req.params.id;
        let filme = db.get("/filmes/"+id);
        if(filme == null) {
            res.status(400).json({ msg: "Filme não existe." })
            return
        }
        let data = { id, ...req.body }
        db.set("/filmes/"+data.id, data)
        res.status(201).json({ msg: "Alteração ok.", data })
    });
    
    server.delete('/filmes/:id', (req, res) => {
        let id = req.params.id;
        let filme = db.get("/filmes/"+id);
        if(filme == null) {
            res.status(400).json({ msg: "Filme não existe." })
            return
        }
        db.set("/filmes/"+id, null)
        res.status(201).json({ msg: "Exclusão ok." })
    });
    

}*/