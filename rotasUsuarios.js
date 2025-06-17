//Codigo personalizado
import { SimpleCrypto } from "simple-crypto-js";
import * as dotenv from 'dotenv';
dotenv.config();

const SECRET = process.env.SECRET;

// A assinatura da função agora aceita 'auth' para usar os middlewares
export default function rotasUsuarios(server, db, auth) {
    /**
     * Rota GET /usuarios
     * Protegida para qualquer usuário autenticado.
     * Remove o campo 'senha' da resposta para segurança.
     */
    server.get('/usuarios', auth.middlewareAuth, (req, res) => {
        let lista = db.get("/usuarios");
        
        // Boa prática: nunca retorne as senhas, mesmo criptografadas.
        for (const key in lista) {
            if (lista.hasOwnProperty(key)) {
                delete lista[key].senha;
            }
        }
        
        res.status(200).json(lista);
    });
    
    /**
     * Rota POST /usuarios
     * Protegida apenas para administradores.
     * Criptografa a senha e atribui um cargo padrão 'user'.
     */
    server.post('/usuarios', auth.middlewareAdmin, (req, res) => {
        let id = db.newID("USER-");
        let data = { id, ...req.body };
        
        // Criptografa a nova senha antes de salvar
        const simpleCrypto = new SimpleCrypto(SECRET);
        data.senha = simpleCrypto.encrypt(data.senha);

        // Atribui o cargo 'user' por padrão se nenhum for especificado
        data.role = data.role || 'user';
        
        db.set("/usuarios/" + data.id, data);
        
        delete data.senha; // Não retorna a senha na resposta
        
        res.status(201).json({ msg: "Usuário criado com sucesso.", data });
    });
    
    /**
     * Rota PUT /usuarios/:id
     * Protegida apenas para administradores.
     * Re-criptografa a senha se ela for alterada.
     */
    server.put('/usuarios/:id', auth.middlewareAdmin, (req, res) => {
        const id = req.params.id;
        const elem = db.get("/usuarios/" + id);
        
        if (elem == null) {
            // Usar 404 Not Found é mais apropriado para recurso não encontrado
            return res.status(404).json({ msg: "Usuário não encontrado." });
        }
        
        // Mescla os dados existentes com os novos para não perder campos
        let data = { ...elem, ...req.body, id };

        // Se uma nova senha foi enviada no corpo da requisição, criptografa-a
        if (req.body.senha) {
            const simpleCrypto = new SimpleCrypto(SECRET);
            data.senha = simpleCrypto.encrypt(req.body.senha);
        }
        
        db.set("/usuarios/" + id, data);

        delete data.senha; // Não retorna a senha na resposta
        
        // Usar 200 OK é mais comum para updates bem-sucedidos
        res.status(200).json({ msg: "Usuário alterado com sucesso.", data });
    });
    
    /**
     * Rota DELETE /usuarios/:id
     * Protegida apenas para administradores.
     */
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
//Codigo Original
/*import { SimpleCrypto } from "simple-crypto-js"
import * as dotenv from 'dotenv'
dotenv.config()

const SECRET = process.env.SECRET

export default function rotasUsuarios(server, db) {

    server.get('/usuarios', (req, res) => {
        let lista = db.get("/usuarios")
        res.status(200).json(lista)
    });
    
    server.post('/usuarios', (req, res) => {
        let id = db.newID("USER-")
        let data = { id, ...req.body }
        const simpleCrypto = new SimpleCrypto(SECRET)
        data.senha = simpleCrypto.encrypt(data.senha)
        db.set("/usuarios/"+data.id, data)
        res.status(201).json({ msg: "Inserção ok.", data })
    });
    
    server.put('/usuarios/:id', (req, res) => {
        let id = req.params.id;
        let elem = db.get("/usuarios/"+id);
        if(elem == null) {
            res.status(400).json({ msg: "Usuário não existe." })
            return
        }
        let data = { id, ...req.body }
        db.set("/usuarios/"+data.id, data)
        res.status(201).json({ msg: "Alteração ok.", data })
    });
    
    server.delete('/usuarios/:id', (req, res) => {
        let id = req.params.id;
        let elem = db.get("/usuarios/"+id);
        if(elem == null) {
            res.status(400).json({ msg: "Usuario não existe." })
            return
        }
        db.set("/usuarios/"+id, null)
        res.status(201).json({ msg: "Exclusão ok." })
    });
    

}*/