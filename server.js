import { server, db, PORT } from "./initServer.js"
import auth from "./auth.js"
import rotasFilmesGeek from "./rotasFilmesGeek.js";
import rotasGamesIndie from "./rotasGamesIndie.js"
import rotasLivrosFantasiaMedieval from "./rotasLivrosFantasiaMedieval.js"
import rotasUsuarios from "./rotasUsuarios.js";

server.get('/', (req, res) => {
    res.send('🙋‍♂️ Hello...route /');
});

auth.init(server,db)
rotasUsuarios(server,db, auth)
rotasGamesIndie(server, db, auth)
rotasLivrosFantasiaMedieval(server,db, auth)
rotasFilmesGeek(server,db, auth)

//async function middlewareTeste(req, res, next) {
//    console.log('Eu sou um middleware!!!!!')
//    if(parseInt(Math.random()*2) == 0) {
//        next()
//    } else {
//        res.send('PROBLEMA!')
//    }
//}
//
//server.get('/teste', middlewareTeste, (req, res) => {
//    res.send('🔥🔥🔥 ROTA /teste acessada!')
//})

server.listen(PORT, () => {
    console.log('Server is running on port '+PORT);
});