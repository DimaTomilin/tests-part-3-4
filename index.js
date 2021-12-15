const app = require('./app');
const mongoose = require('mongoose');
const config = require('./utils/config');

const port = config.PORT || 3003;

// starting the server
mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('connected to MongoDB ');
    app.listen(port, () =>
      console.log(`app listening at http://localhost:${port}`)
    );
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
  });
