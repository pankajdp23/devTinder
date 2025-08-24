const authenticate = (req, res, next) => {

    const token = 'xys';

    if (token === 'xys') {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }       
}

module.exports = authenticate;