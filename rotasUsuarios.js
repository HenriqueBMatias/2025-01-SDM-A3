import { SimpleCrypto } from "simple-crypto-js";
import * as dotenv from 'dotenv';
dotenv.config();

const SECRET = process.env.SECRET;

export default function rotasUsuarios(server, db, auth) {

    server.get('/usuarios', auth.middlewareAuth, (req, res) => {
        let lista = db.get("/usuarios");
        
        for (const key in lista) {
            if (lista.hasOwnProperty(key)) {
                delete lista[key].senha;
            }
        }
        
        res.status(200).json(lista);
    });
    
    server.post('/usuarios', auth.middlewareAdmin, (req, res) => {
        let id = db.newID("USER-");
        let data = { id, ...req.body };
        
        const simpleCrypto = new SimpleCrypto(SECRET);
        data.senha = simpleCrypto.encrypt(data.senha);

        data.role = data.role || 'user';
        
        db.set("/usuarios/" + data.id, data);
        
        delete data.senha;
        
        res.status(201).json({ msg: "Usuário criado com sucesso.", data });
    });
    
    server.put('/usuarios/:id', auth.middlewareAdmin, (req, res) => {
        const id = req.params.id;
        const elem = db.get("/usuarios/" + id);
        
        if (elem == null) {
            return res.status(404).json({ msg: "Usuário não encontrado." });
        }

        let data = { ...elem, ...req.body, id };

        if (req.body.senha) {
            const simpleCrypto = new SimpleCrypto(SECRET);
            data.senha = simpleCrypto.encrypt(req.body.senha);
        }
        
        db.set("/usuarios/" + id, data);

        delete data.senha;

        res.status(200).json({ msg: "Usuário alterado com sucesso.", data });
    });
    
    server.delete('/usuarios/:id', auth.middlewareAdmin, (req, res) => {
        const id = req.params.id;
        const elem = db.get("/usuarios/" + id);
        
        if (elem == null) {
            return res.status(404).json({ msg: "Usuário não encontrado." });
        }
        
        db.set("/usuarios/" + id, null);
        
        res.status(200).json({ msg: "Usuário excluído com sucesso." });
    });
}