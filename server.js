const app = require('./config/app');
const { sequelize } = require('./models/index')

const port = process.env.PORT;

(async ()=> {
try {

  await sequelize.authenticate();
  console.log('Connection has been established successfully.');

  await sequelize.sync({alter:true});

  app.listen(port,()=>{
    console.log('Server listening on port: ' + port);

    // Debug: list registered routes
    if (app && app._router && app._router.stack) {
      console.log('Registered routes:');
      app._router.stack.forEach((mw) => {
        if (mw.route) {
          const methods = Object.keys(mw.route.methods).join(',').toUpperCase();
          console.log(`${methods} ${mw.route.path}`);
        } else if (mw.name === 'router' && mw.handle && mw.handle.stack) {
          mw.handle.stack.forEach((h) => {
            if (h.route) {
              const methods = Object.keys(h.route.methods).join(',').toUpperCase();
              console.log(`${methods} ${h.route.path}`);
            }
          });
        }
      });
    }
  })
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

})();

