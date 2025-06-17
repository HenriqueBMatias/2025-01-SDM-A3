import jwt from "jsonwebtoken"
import { SimpleCrypto } from "simple-crypto-js"
import * as dotenv from 'dotenv'
dotenv.config()

const SECRET = process.env.SECRET
const isAUTH = process.env.AUTH

if (isAUTH) {
    console.log(`🔥 server using AUTH!`);
}

function getToken(email, role) {
    let token = jwt.sign({ email, role }, SECRET, { expiresIn: '1h' })
    return token
}

const auth = {

    init(server, db) {
        server.post('/auth', function (req, res) {
            if (req.body) {
                let email = req.body.email
                let senha = req.body.senha
                let users = db.get("/usuarios")

                for (let key in users) {
                    const user = users[key];
                    if (user.email == email) {
                        let cryptpass = user.senha
                        const simpleCrypto = new SimpleCrypto(SECRET)
                        let pass_decrypted = simpleCrypto.decrypt(cryptpass)
                        
                        if (pass_decrypted == senha) {
                            const role = user.role || 'user';
                            let token = getToken(email, role)
                            res.status(200).json({ msg: "token generated", token })
                            return
                        }
                    }
                }
                res.status(401).json({ error: true, msg: "Email ou senha incorretos" })
            } else {
                res.status(400).json({ error: true, msg: "Email e senha ausentes" })
            }
        })
    },

    middlewareAuth(req, res, next) {
        if (!isAUTH) {
            next()
            return
        }
        let headerText = req.headers.authorization
        if (headerText == undefined) {
            return res.status(401).json({ msg: 'Token não encontrado.' })
        }
        let parts = headerText.split(" ")
        let token = parts[1]
        jwt.verify(token, SECRET, (err, tokenDecoded) => {
            if (err) {
                return res.status(401).json({ msg: 'Token inválido ou expirado. ' + err })
            } else {
                req.user_role = tokenDecoded.role;
                next()
            }
        })
    },

    // A função que estava faltando ou estava fora do objeto 'auth'
    middlewareAdmin(req, res, next) {
        if (!isAUTH) {
            next()
            return
        }
        let headerText = req.headers.authorization
        if (headerText == undefined) {
            return res.status(401).json({ msg: 'Token não encontrado.' })
        }
        let parts = headerText.split(" ")
        let token = parts[1]
        jwt.verify(token, SECRET, (err, tokenDecoded) => {
            if (err) {
                return res.status(401).json({ msg: 'Token inválido ou expirado. ' + err })
            } else {
                if (tokenDecoded.role === 'admin') {
                    next()
                } else {
                    return res.status(403).json({ msg: 'Acesso negado. Requer privilégios de administrador.' })
                }
            }
        })
    }
}

export default auth;