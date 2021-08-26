const { 
        User, 
        Developer, 
        Address, 
        Social, 
        Title, 
        devSkills, 
        devBasic,
        devProjects 
    } = require('../models')

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
        let developer, social, titles;
        await Promise.all([User.getDeveloperById(id), Social.getByUserId(id), Title.all()])
                .then(values => {  
                    developer = values[0][0]
                    social = values[1][0] ? values[1][0] : {};
                    titles = values[2]
                 });
        res.render('admin/developer/edit',{id, developer, social, titles})
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

    /**
     * Adding developer social
     */
    async addSocial(req, res){ 
        let id = req.params.id;
        let record = Social.add({user_id: id, ...req.body});
        res.redirect('back')
     }


    /**
     * Update developer social
     */
    async updateSocial(req, res){
        let {id, socialId} = req.params; 
        let record = await Social.updateById(socialId, req.body); 
        if(record.serverStatus !== 2) {
            res.send(req.body)
        }
        res.redirect('back')
     }

     /**
      * 
      * @param {*} req 
      * @param {*} res 
      */
     async addbasicInfo(req, res) {
         let { id } = req.params;
         let record = await devBasic.ifExists({user_id: id}); 
         if(!record.length) await devBasic.add({user_id: id, ...req.body});
         res.redirect('back');
     }
    
     /**
      * Add skills to developer social
      * @param Request req
      * @param Response res
      * @return 
      */
     async addSkillsToDevelopers(req, res) {
        let { id } = req.params;
        let { skill  } = req.body; 
        Object.keys(skill).forEach(async function(k)  { 
             console.log('fill', skill[k])
            let exists = await devSkills.ifExists({user_id: id, skill_id: skill[k].id}).then(data => data.length ? true: false).catch(err => false); 
            if( !exists ) await devSkills.add({user_id: id, skill_id: skill[k].id, fill: skill[k].fill})
        })
        res.redirect('back')
     }

    /**
     * Add project details to the developer
     */
    async addProject(req, res) {
        let { id } = req.params;
        console.log(req.body, req.files)
        res.redirect('back')
    }
}

module.exports = new developer