const userAuth = (req, res, next) => {
    const token = 'abc';
    const isUser = token === 'abc';
    if (!isUser) {
        res.status(401).send('Unauthorized');
    }
    else {
        next();
    }
}

const adminAuth = (req, res, next) => {
    const token = 'aabc';
    const isAdmin = token === 'aabc';
    if (!isAdmin) {
        res.status(401).send('Unauthorized');
    }
    else {
        next();
    }

}
module.exports = {
    userAuth,
    adminAuth
}