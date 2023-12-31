const userData = require('../../schemas/userData')

module.exports = async (polaris, message) => {
    try {
        let user = await userData.findOneAndUpdate(
            { id: message.author.id },
            {}, 
            {
              new: true, 
              upsert: true, 
            }
           );
           
           if (!user.bank_balance) {
            user.bank_balance = 0;
            await user.save();
           }
           if(!user.purse_balance) {
            user.purse_balance = 0;
            await user.save()
           }    
    } catch (error) {
        console.log(error)
    }
}