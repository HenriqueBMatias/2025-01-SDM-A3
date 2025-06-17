
//codigo personalizado
// Arquivo: rotasGamesIndie.js
export default function rotasGamesIndie(server, db, auth) {

    server.get('/games_indie', auth.middlewareAuth, (req, res) => {
        const games = db.get("/games_indie");
        res.status(200).json(games);
    });

    server.post('/games_indie', auth.middlewareAuth, (req, res) => {
        const id = req.body.nome.toLowerCase().replace(/\s+/g, '_');
        if (db.get(`/games_indie/${id}`)) {
            return res.status(409).json({ msg: "Um jogo com este nome já existe.", id });
        }
        const data = { id, ...req.body };
        db.set(`/games_indie/${id}`, data);
        res.status(201).json({ msg: "Jogo inserido com sucesso.", data });
    });

    server.put('/games_indie/:id', auth.middlewareAdmin, (req, res) => {
        const id = req.params.id;
        const game = db.get(`/games_indie/${id}`);
        if (game == null) {
            return res.status(404).json({ msg: "Jogo não encontrado." });
        }
        const data = { ...game, ...req.body, id };
        db.set(`/games_indie/${id}`, data);
        res.status(200).json({ msg: "Jogo alterado com sucesso.", data });
    });

    server.delete('/games_indie/:id', auth.middlewareAdmin, (req, res) => {
        const id = req.params.id;
        const game = db.get(`/games_indie/${id}`);
        if (game == null) {
            return res.status(404).json({ msg: "Jogo não encontrado." });
        }
        db.set(`/games_indie/${id}`, null);
        res.status(200).json({ msg: "Jogo excluído com sucesso." });
    });
}
//Codigo Original
/*export default function rotasFrutas(server, db, auth) {

    server.get('/frutas', auth.middlewareAuth, (req, res) => {
        let frutas = db.get("/frutas")
        res.status(200).json(frutas)
    });
    
    server.post('/frutas', (req, res) => {
        let id = db.newID("FRUTA-")
        let data = { id, ...req.body }
        db.set("/frutas/"+data.id, data)
        res.status(201).json({ msg: "Inserção ok.", data })
    });
    
    server.put('/frutas/:id', (req, res) => {
        let id = req.params.id;
        let fruta = db.get("/frutas/"+id);
        if(fruta == null) {
            res.status(400).json({ msg: "Fruta não existe." })
            return
        }
        let data = { id, ...req.body }
        db.set("/frutas/"+data.id, data)
        res.status(201).json({ msg: "Alteração ok.", data })
    });
    
    server.delete('/frutas/:id', (req, res) => {
        let id = req.params.id;
        let fruta = db.get("/frutas/"+id);
        if(fruta == null) {
            res.status(400).json({ msg: "Fruta não existe." })
            return
        }
        db.set("/frutas/"+id, null)
        res.status(201).json({ msg: "Exclusão ok." })
    });
    

}*/