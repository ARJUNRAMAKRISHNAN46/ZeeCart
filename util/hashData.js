const bcrypt = require('bcrypt');

const hashData = async (data,saltRounds = 10) => {
    try {
        const hashedData = await bcrypt.hash(data,saltRounds);
        return hashData;
    } catch (error) {
        throw error;
    }
}

const verifyHashedData = async (unhashed,hashed) => {
    try {
        const match = await bcrypt.compare(unhashed,hashed);
        return match;

    } catch (error) {
        
    }
}


module.exports = { 
    hashData,
    verifyHashedData
 };