const { User, Developer, Address } = require('../models')

class developer {
    async index(req, res) {
        let developers = await User.getDevelopers();
        res.render('admin/developer', {developers});
    }

    /**
     * Edit developer view
     * @param {} error 
     */
    async edit(req, res) {
        let id = req.params.id; 
        if(!id) {
            return res.redirect('/404')
        }
        let developer = await User.getDeveloperById(id); console.log(developer)
        
        res.render('admin/developer/edit',{id, developer,})
    }

    sendErrorResponse(error) {
        return res.status(400).send({ error: error ? error : 'Not able to add information' }) 
    }

    async addDeveloper(req, res) {
        let {
            first_name,
            last_name, 
            email, 
            dob, 
            website, 
            membertype, 
            number,
            address
        } = req.body
        let file = req.file;
        let payload = {first_name, last_name, role_id: 2, email, profile_image: file ? file.filename : '', password: 'password'};
        //Save user
        var user = await User.add(payload);
        if (!user) {
            return this.sendErrorResponse('Not able to add user.')
        }
        let user_id = user.insertId;
        //payload to create a developer
        let payload2 = {user_id , dob, phone: number, website, freelancer: membertype == 0 ? 1 : 0 };
       
        var developer = await Developer.add(payload2);
        if(!developer) {
            return this.sendErrorResponse('Not able to add information')          
        } 
        //Add address
        let devAddress = await Address.add({user_id, ...address }) 
        if(!devAddress){
            return this.sendErrorResponse('Developer address not added.')
        }
        res.redirect('back')
        
    }
}

module.exports = new developer