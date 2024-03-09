import express from 'express';
import morgan from 'morgan';

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.get('/', (_, res) => res.send('running'));

let port = 4000;

app.listen(port, async () => {
  console.log(`Server running at http://localhost:${port}`);

  //   AppDataSource.initialize()
  //   .then(async () => {
  //     console.log('Inserting a new user into the database...');
  //     const user = new User();
  //     user.firstName = 'Timber';
  //     user.lastName = 'Saw';
  //     user.age = 25;
  //     await AppDataSource.manager.save(user);
  //     console.log('Saved a new user with id: ' + user.id);

  //     console.log('Loading users from the database...');
  //     const users = await AppDataSource.manager.find(User);
  //     console.log('Loaded users: ', users);

  //     console.log(
  //       'Here you can setup and run express / fastify / any other framework.'
  //     );
  //   })
  //   .catch((error) => console.log(error));
});
