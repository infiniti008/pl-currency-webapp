// JWT USSAGE
import jwt from 'jsonwebtoken';
app.use((req, res, next) => {
  try {
    if (!req.cookies.key) {
      console.log('SET Key to Cookies');
      res.cookie('key', process.env.publicKey);
    }

    if (!req.cookies.token && req.method.toUpperCase() === 'GET' && !req.path.includes('/api/subscription/settings') && req.path.includes('/api')) {
      console.log('Need To Set Token to Cookies');
      console.log(req.params);

      const settings = {
        defaultCountry: 'pl'
      };
      const token = jwt.sign(settings, new Buffer.from(process.env.secretKey, 'base64'), { algorithm: 'RS256' });
      res.cookie('token', token);

      // const veryfied = jwt.verify(token, new Buffer.from(process.env.publicKey, 'base64'), { algorithm: 'RS256' });
      // console.log('veryfied', veryfied);
    }
  } catch(err) {
    console.log(err);
  }

  next();
});