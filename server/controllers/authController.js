const bcrypt = require('bcryptjs')

module.exports = {
    login: async (req, res) => {
        const {username, password} = req.body
        let db = req.app.get('db')

        let userResponse = await db.get_user(username)
        let user = userResponse[0]

        if(!user){
           return res.status(401).send('email doesnt exist')
        }
        const isAuthenticated = bcrypt.compareSync(password, user.hash)

        if(!isAuthenticated) {
            return res.status(403).send('incorrect password')
        }
        delete user.hash

        req.session.user = {isAdmin: user.isadmin, id: user.id, username: user.username}
        return res.send(req.session.user)
        // req.session.user = user
        // res.status(200).send(req.session.user)
    },
    register: async (req, res) => {
    const { username, password, isAdmin } = req.body;
    const existingUser = await req.app.get('db').check_existing_user([username]);
    if (existingUser[0]) {
      return res.status(409).send('Username taken');
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const createdUser = await req.app.get('db').register_user([isAdmin, username, hash]);
    const user = createdUser[0];
    req.session.user = { isAdmin: user.isadmin, id: user.id, username: user.username };
    return res.status(200).send(req.session.user);
  },
  
  logout: (req, res) => {
      req.session.destroy()
      res.sendStatus(200)
    }
    
    
    
    // register: async (req, res) => {
    //     const {username, password, isAdmin} = req.body
        
    //     let userResponse = await db.check_existing_user([username])
    //     let user = userResponse[0]
        
    //     if (user) {
    //         return res.status(409).send('username taken')
    //     }
        
    //     const salt = bcrypt.genSaltSync(10)
    //     const hash = bcrypt.hashSync(password, salt)
        
    //     let newUser = await db.register_user([isAdmin, username, hash])
        
    //     let createdUser = newUser[0] 
        
    //     req.session.user = createdUser
    //     return res.send(req.session.user)
    // },
}

