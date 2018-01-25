import mongoose from 'mongoose';
import config from './config';

export default callback => {
    
  mongoose.Promise = global.Promise;
  let db = mongoose.connect(config.mongoURL, {
    useMongoClient: true,

  });
  db.then(callback(db)).catch(err => { // we will not be here...
    console.error('Failed to connect to MongoDB '+err.stack);//, err.stack);
    process.exit(1);    
});
}
