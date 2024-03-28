### Query params in Express

```js
const express = require('express');
const app = express();
const port = 5000;

const { products } = require('./data');

// app.get('/', (req, res) => {
//     res.json([{name: 'Skyy'}, {name: 'Soumadip'}])
// });
// app.get('/', (req, res) => {
//    res.json(products)
// });

app.get('/', (req, res) => {
	res.send('<h1>Home Page</h1> <a href="/api/products">Products</a>');
});

//All prodcts without desc
app.get('/api/products', (req, res) => {
	const newProducts = products.map((product) => {
		const { id, name, image } = product;
		return { id, name, image };
	});
	res.json(newProducts);
});

//Single product
app.get('/api/products/:productID', (req, res) => {
	// console.log(req);
	// console.log(req.params);
	const { productID } = req.params;
	const singleProduct = products.find(
		(product) => product.id === Number(productID),
	);
	if (!singleProduct) {
		return res.status(404).send('<h3>Oops! Product does not exist ❌</h3>');
	}
	return res.json(singleProduct);
});

app.get('/api/products/:productID/reviews/:reviewID', (req, res) => {
	// console.log(req);
	console.log(req.params);
	res.send('Hello World');
});

//! More complex params
app.get('/api/v1/query', (req, res) => {
	//http://localhost:5000/api/v1/query?name=john&id=4&age=28 or something
	let sortedProducts = [...products];
	const { search, limit } = req.query;
	// console.log(req.query);
	//! Filtering
	if (search) {
		sortedProducts = sortedProducts.filter((product) => {
			return product.name.startsWith(search);
		});
	}

	if (limit) {
		sortedProducts = sortedProducts.slice(0, Number(limit));
	}
	if (sortedProducts.length < 1) {
		//res.status(200).send(`<h2>No products matched your search! :/</h2>`);
		//! We can do anything we want:
		return res.status(200).json({ success: true, data: [] });
	}
	res.status(200).json(sortedProducts);
	//res.send('Complex Query')
});

app.listen(port, () => {
	console.log(`App listening on port: ${port}...`);
});
```

### Middleware(s) in Express

In Express, middleware functions are functions that have access to the request object (`req`), the response object (`res`), and the next middleware function in the application’s request-response cycle. Middleware functions can perform the following tasks:

1. Execute any code.
2. Make changes to the request and response objects.
3. End the request-response cycle.
4. Call the next middleware function in the stack.

Middleware functions are essential in Express applications as they allow you to modularize your code and add various functionalities to your application's request-response pipeline.

Here's how middleware works in Express:

1. **Middleware Stack**: In an Express application, middleware functions are executed in the order they are defined. When a request is made to the server, Express processes the request through a stack of middleware functions, each handling a specific aspect of the request-response cycle.

2. **Request Phase**: As the request travels through the middleware stack, each middleware function can perform tasks such as logging, parsing request bodies, authenticating users, or validating input data. These middleware functions can modify the request object (`req`) or perform operations based on the request data.

3. **Next Function**: Middleware functions can pass control to the next middleware function in the stack by calling the `next()` function. This allows the request to continue its journey through the middleware stack.

4. **Response Phase**: Once the request has passed through all middleware functions, it reaches the route handler, where the main logic of the application resides. The route handler generates the response and sends it back to the client. Middleware functions can also intercept the response before it is sent and perform tasks such as error handling, compression, or adding headers to the response.

Here's an example of how middleware functions are defined and used in an Express application:

```javascript
const express = require('express');
const app = express();

// Custom middleware function
const loggerMiddleware = (req, res, next) => {
	console.log(`Request received: ${req.method} ${req.url}`);
	next(); // Pass control to the next middleware function
};

// Middleware function to parse JSON bodies
app.use(express.json());

// Middleware function to log requests
app.use(loggerMiddleware);

// Route handler
app.get('/api/users', (req, res) => {
	res.json({ message: 'List of users' });
});

// Error-handling middleware
app.use((err, req, res, next) => {
	console.error(err);
	res.status(500).json({ error: 'Internal server error' });
});

// Start the server
app.listen(3000, () => {
	console.log('Server is running on port 3000');
});
```

In this example:

- `loggerMiddleware` is a custom middleware function that logs the details of each incoming request.
- `express.json()` is built-in middleware that parses incoming JSON requests.
- Middleware functions are attached to the application using the `app.use()` method.
- The route handler for `/api/users` sends back a JSON response.
- An error-handling middleware function is defined to handle errors that occur during request processing.

Overall, middleware functions provide a flexible and powerful mechanism for adding functionality to Express applications and handling requests and responses in a modular and organized manner.

# Baisc Middleware Setup

```js
const express = require('express');
const app = express();
const port = 5000;

// req => middleware => res
const logger = (req, res, next) => {
	const { method, url } = req;
	const time = new Date().getFullYear();
	console.log(method, url, time);
	//res.send(`Testing`); //<== either this
	next(); //!imp.. <== Or this
};

app.get('/', logger, (req, res) => {
	res.send('<h2>Home</h2>');
});

app.get('/about', logger, (req, res) => {
	res.send('<h2>About</h2>');
});

app.listen(port, () => {
	console.log(`App listening on port: ${port}...`);
});
```

# Multiple Middlewares

```js
//autorize.js
//74.multiple middlewares
const authorize = (req, res, next) => {
	const { user } = req.query;
	if (user === 'john') {
		req.user = { name: 'John', id: 4 };
		next();
	} else {
		res.status(401).send('<h2>Unauthorized!</h2>');
	}
	// console.log('authorize');
	// next();
};

module.exports = authorize;

//logger.js
//Middleware 73

// req => middleware => res
const logger = (req, res, next) => {
	const { method, url } = req;
	const time = new Date().getFullYear();
	console.log(method, url, time);
	//res.send(`Testing`); //<== either this
	next(); //!imp.. <== Or this
};

module.exports = logger;

//app.js

const express = require('express');
const app = express();
const port = 5000;
const logger = require('./logger');
const authorize = require('./authorize');

app.use([logger, authorize]);

app.get('/', (req, res) => {
	res.send('<h2>Home</h2>');
});

app.get('/about', (req, res) => {
	res.send('<h2>About</h2>');
});

app.get('/api/products', (req, res) => {
	res.send('<h2>Products</h2>');
});

app.get('/api/items', [logger, authorize], (req, res) => {
	console.log(req.user);
	res.send('<h2>Items</h2>');
});

app.listen(port, () => {
	console.log(`App listening on port: ${port}...`);
});

//3rd party middleware example:
//npm i morgan
const morgan = require('morgan');
app.use(morgan('tiny'));
```

### Http Methods in Express

In Express.js, HTTP methods are used to define the behavior of routes in handling different types of HTTP requests. Each HTTP method corresponds to a specific action that a client can perform on the server. Express provides methods for handling all standard HTTP methods such as GET, POST, PUT, DELETE, etc. Here's an in-depth explanation of commonly used HTTP methods in Express.js:

1. **GET**: The GET method is used to request data from a specified resource. It retrieves data from the server without modifying anything on the server side. In Express, you define a route to handle GET requests using the `app.get()` method. For example:

   ```javascript
   app.get('/users', (req, res) => {
   	// Handle GET request to retrieve users
   });
   ```

2. **POST**: The POST method is used to submit data to be processed to a specified resource. It is commonly used when you want to create a new resource on the server. In Express, you define a route to handle POST requests using the `app.post()` method. For example:

   ```javascript
   app.post('/users', (req, res) => {
   	// Handle POST request to create a new user
   });
   ```

3. **PUT**: The PUT method is used to update data on the server. It replaces the entire resource with the new data provided in the request. In Express, you define a route to handle PUT requests using the `app.put()` method. For example:

   ```javascript
   app.put('/users/:id', (req, res) => {
   	// Handle PUT request to update a user with a specific ID
   });
   ```

4. **DELETE**: The DELETE method is used to delete a specified resource from the server. It removes the resource identified by the given URL. In Express, you define a route to handle DELETE requests using the `app.delete()` method. For example:

   ```javascript
   app.delete('/users/:id', (req, res) => {
   	// Handle DELETE request to delete a user with a specific ID
   });
   ```

5. **PATCH**: The PATCH method is used to apply partial modifications to a resource. It is typically used when you want to update only specific fields of a resource. In Express, you define a route to handle PATCH requests using the `app.patch()` method.

6. **OPTIONS**: The OPTIONS method is used to describe the communication options for the target resource. It is often used in conjunction with Cross-Origin Resource Sharing (CORS) to determine whether the actual request is safe to send. In Express, you can handle OPTIONS requests using the `app.options()` method.

These are some of the commonly used HTTP methods in Express.js. They allow you to define different routes in your application to handle various types of client requests and perform corresponding actions on the server.

# Get-Method

```js
const express = require('express');
const app = express();
const port = 5000;

let { people } = require('./data');

app.get('/api/people', (req, res) => {
	res.status(200).json({ success: true, data: people });
});

app.listen(port, () => {
	console.log(`App listening on port: ${port}...`);
});

//o/p:
/* {
"success": true,
"data": [
{
"id": 1,
"name": "john"
},
{
"id": 2,
"name": "peter"
},
{
"id": 3,
"name": "susan"
},
{
"id": 4,
"name": "anna"
},
{
"id": 5,
"name": "emma"
}
]
}
*/
```

# Post - Method (Form example)

```html
<!-- front end part -->
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<link rel="stylesheet" href="./normalize.css" />
		<link rel="stylesheet" href="./styles.css" />
		<title>Traditional</title>
	</head>
	<body>
		<nav>
			<div class="nav-center">
				<h5>HTTP Methods</h5>
				<div>
					<a href="index.html">regular </a>
					<a href="javascript.html">javascript </a>
				</div>
			</div>
		</nav>
		<main>
			<form action="/login" method="POST">
				<h3>Traditional Form</h3>
				<div class="form-row">
					<label for="name"> enter name </label>
					<input type="text" name="name" id="name" autocomplete="false" />
				</div>
				<button type="submit" class="block">submit</button>
			</form>
		</main>
	</body>
</html>
```

```js
// first example
//app.js
const express = require('express');
const app = express();
const port = 5000;

let { people } = require('./data');

// static assets
app.use(express.static('./methods-public'));

//parse form-data
app.use(express.urlencoded({ extended: false }));

app.get('/api/people', (req, res) => {
	res.status(200).json({ success: true, data: people });
});

app.post('/login', (req, res) => {
	console.log(req.body);
	const { name } = req.body;
	if (name) {
		return res.status(200).send(`<h3>Welcome ${name} 🤗</h3>`);
	} else {
		return res.status(401).send(`<h3>Please provide credentials! ☹️</h3>`);
	}
});

app.listen(port, () => {
	console.log(`App listening on port: ${port}...`);
});
```

# Post - Method (JS example)

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<link rel="stylesheet" href="./normalize.css" />
		<link rel="stylesheet" href="./styles.css" />
		<title>Javascript</title>
	</head>
	<body>
		<nav>
			<div class="nav-center">
				<h5>HTTP Methods</h5>
				<div>
					<a href="index.html">regular </a>
					<a href="javascript.html">javascript </a>
				</div>
			</div>
		</nav>
		<main>
			<section>
				<form>
					<h3>Javascript Form</h3>
					<div class="form-row">
						<label for="name"> enter name </label>
						<input
							type="text"
							name="name"
							id="name"
							class="form-input"
							autocomplete="false"
						/>
						<small class="form-alert"></small>
					</div>
					<button type="submit" class="block submit-btn">submit</button>
				</form>
				<div class="result"></div>
			</section>
		</main>
		<script
			src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.21.1/axios.min.js"
			integrity="sha512-bZS47S7sPOxkjU/4Bt0zrhEtWx0y0CRkhEp8IckzK+ltifIIE9EMIMTuT/mEzoIMewUINruDBIR/jJnbguonqQ=="
			crossorigin="anonymous"
		></script>
		<script>
			const result = document.querySelector('.result');

			const fetchPeople = async () => {
				try {
					const { data } = await axios.get('/api/people');

					const people = data.data.map((person) => {
						return `<h5>${person.name}</h5>`;
					});
					result.innerHTML = people.join('');
				} catch (error) {
					result.innerHTML = `<div class="alert alert-danger">Can't Fetch Data</div>`;
				}
			};
			fetchPeople();
			// submit form
			const btn = document.querySelector('.submit-btn');
			const input = document.querySelector('.form-input');
			const formAlert = document.querySelector('.form-alert');
			btn.addEventListener('click', async (e) => {
				e.preventDefault();
				const nameValue = input.value;

				try {
					const { data } = await axios.post('/api/people', { name: nameValue });
					const h5 = document.createElement('h5');
					h5.textContent = data.person;
					result.appendChild(h5);
				} catch (error) {
					// console.log(error.response)
					formAlert.textContent = error.response.data.msg;
				}
				input.value = '';
			});
		</script>
	</body>
</html>
```

```js
const express = require('express');
const app = express();
const port = 5000;

let { people } = require('./data');

// static assets
app.use(express.static('./methods-public'));
//parse form-data
app.use(express.urlencoded({ extended: false }));
//parse json
app.use(express.json());

//get/read
app.get('/api/people', (req, res) => {
	res.status(200).json({ success: true, data: people });
});

//post/send
app.post('/api/people', (req, res) => {
	const { name } = req.body;
	if (!name) {
		return res
			.status(400)
			.json({ success: false, msg: 'Please provide name-value!' });
	}
	res.status(201).json({ success: true, person: name });
});

app.post('/login', (req, res) => {
	console.log(req.body);
	const { name } = req.body;
	if (name) {
		return res.status(200).send(`<h3>Welcome ${name} 🤗</h3>`);
	} else {
		return res.status(401).send(`<h3>Please provide credentials! ☹️</h3>`);
	}
});

app.listen(port, () => {
	console.log(`App listening on port: ${port}...`);
});
```

# - installation of POSTMAN

# Put - Method

```js
const express = require('express');
const app = express();
const port = 5000;

let { people } = require('./data');

//PUT
app.put('/api/people/:id', (req, res) => {
	const { id } = req.params;
	const { name } = req.body;

	const person = people.find((person) => person.id === Number(id));
	if (!person) {
		return res
			.status(404)
			.json({ success: false, msg: `No person with id ${id} found!👎🏻` });
	}

	const newPeople = people.map((person) => {
		if (person.id === Number(id)) {
			person.name = name;
		}
		return person;
	});

	res.status(200).json({ success: true, data: newPeople });
});

app.listen(port, () => {
	console.log(`App listening on port: ${port}...`);
});
```

# Delete - Method

```js
const express = require('express');
const app = express();
const port = 5000;

let { people } = require('./data');

//delete
app.delete('/api/people/:id', (req, res) => {
	const { id } = req.params;
	const person = people.find((person) => person.id === Number(id));
	if (!person) {
		return res
			.status(404)
			.json({ success: false, msg: `No person with id ${id} found!👎🏻` });
	}
	const newPeople = people.filter((person) => person.id !== Number(id));
	return res.status(200).json({ success: true, data: newPeople });
});

app.listen(port, () => {
	console.log(`App listening on port: ${port}...`);
});
```

### Express Router
In Express.js, a router is a middleware that helps you to group the route handlers for a particular part of your site together and access them using a common route-prefix. This makes your code more modular and easier to maintain, especially as your application grows.

Express provides a built-in router object, `express.Router()`, which you can use to create modular route handlers. Here's how you can use it:

1. **Create a Router**: You create a new router by calling `express.Router()`. This returns a router instance that you can use to define routes.

```javascript
const express = require('express');
const router = express.Router();
```

2. **Define Routes**: You can define routes on the router instance using methods like `get`, `post`, `put`, `delete`, etc., similar to how you define routes on the main `app` object in Express.

```javascript
router.get('/users', (req, res) => {
    // Route handler logic
});

router.post('/users', (req, res) => {
    // Route handler logic
});
```

3. **Mount the Router**: Once you've defined your routes, you need to mount the router in your application. You can do this by using the `app.use()` method and specifying a base URL for the router.

```javascript
app.use('/api', router);
```

In this example, all routes defined on the `router` will be prefixed with `/api`.

4. **Middleware**: You can also use middleware with routers in the same way you do with the main `app` object. Middleware defined on the router will only be applied to routes defined on that router.

```javascript
router.use((req, res, next) => {
    // Middleware logic
    next();
});
```

By using routers, you can create modular and reusable route handlers, organize your code more effectively, and improve the scalability of your application. It's especially useful for larger applications with multiple routes and handlers.

# Express Router - SetUp

```js
//app.js
const express = require('express');
const app = express();
const port = 5000;

const peopleRouter = require('./routes/people');
const loginRouter = require('./routes/login');

// static assets
app.use(express.static('./methods-public'))
//parse form-data
app.use(express.urlencoded({ extended: false }))
//parse json
app.use(express.json());

app.use('/api/people', peopleRouter);
app.use('/login', loginRouter);

app.listen(port, () => {
    console.log(`App listening on port: ${port}...`);
})
```
```js
//routes/people.js
const express = require('express');
const router = express.Router();

let { people } = require('../data');

//get/read
router.get('/', (req, res) => {
    res.status(200).json({ success: true, data: people });
})

//post/send
router.post('/', (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ success: false, msg: 'Please provide name-value!' })
    }
    res.status(201).json({ success: true, person: name })
});

//PUT
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    const person = people.find((person) => person.id === Number(id));
    if (!person) {
        return res.status(404).json({ success: false, msg: `No person with id ${id} found!👎🏻` });
    }

    const newPeople = people.map(person => {
        if (person.id === Number(id)) {
            person.name = name;
        }
        return person;
    });

    res.status(200).json({ success: true, data: newPeople });
});

//delete
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const person = people.find((person) => person.id === Number(id));
    if (!person) {
        return res.status(404).json({ success: false, msg: `No person with id ${id} found!👎🏻` });
    }
    const newPeople = people.filter((person) => person.id !== Number(id));
    return res.status(200).json({ success: true, data: newPeople });
});

router.post('/postman', (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ success: false, msg: 'Please provide name-value!' })
    }
    res.status(201).json({ success: true, data: [...people, name] })
})

module.exports = router;
```
```js
//routes/login.js
const express = require('express');
const router = express.Router();
//login or auth.js, naming depends on us
router.post('/', (req, res) => {
    console.log(req.body);
    const { name } = req.body
    if (name) {
        return res.status(200).send(`<h3>Welcome ${name} 🤗</h3>`)
    } else {
        return res.status(401).send(`<h3>Please provide credentials! ☹️</h3>`)
    }

})
module.exports = router;
```
# Express Router - Controllers
In Express.js, routers and controllers are essential components for structuring and organizing your application's routes and logic. Let's delve into each of these components in great depth:

### Express Router:
Express Router is a middleware that allows you to define and group routes in a modular and organized manner. It provides a way to create mini-applications within your main Express application, enabling better code organization, separation of concerns, and scalability.

#### Key Concepts and Features:
1. **Modularity**: Routers enable you to modularize your application's routes based on specific functionalities or resources. Each router can handle a set of related routes, making it easier to manage and maintain your codebase.

2. **Route Prefixing**: Routers support route prefixing, allowing you to define a common base URL for all routes within the router. This helps in organizing routes for a particular feature or API version.

3. **Middleware Support**: Like the main Express application, routers can use middleware functions to handle common tasks such as authentication, logging, error handling, etc. Middleware can be applied to all routes within the router or specific routes as needed.

4. **Nested Routers**: Routers can be nested within each other, allowing for hierarchical route structures. This is useful for creating complex API endpoints or organizing routes into subcategories.

5. **Mounting Routers**: Routers can be mounted at specific paths within the main Express application using the `app.use()` method. This allows you to define a modular route hierarchy and integrate it seamlessly with the main application.

#### Example:
```javascript
// routes/users.js
const express = require('express');
const router = express.Router();

// GET /users/
router.get('/', (req, res) => {
    res.send('Get all users');
});

// POST /users/
router.post('/', (req, res) => {
    res.send('Create a new user');
});

module.exports = router;
```

### Controllers:
Controllers are JavaScript modules responsible for handling the business logic and request processing for specific routes or groups of routes. They encapsulate the functionality associated with each route, keeping route handlers clean and focused on request/response handling.

#### Key Concepts and Features:
1. **Separation of Concerns**: Controllers promote separation of concerns by keeping route handlers lightweight and focused on request/response processing. Business logic, data manipulation, and interaction with external services are handled within controllers.

2. **Reusability**: Controllers facilitate code reuse by encapsulating common logic that may be shared across multiple routes or endpoints. This makes it easier to maintain and extend your application's functionality.

3. **Testability**: Controllers are highly testable as they represent the core business logic of your application. By isolating this logic into separate modules, you can write unit tests to ensure the correctness and reliability of your code.

4. **Promotes MVC Architecture**: Controllers play a key role in the Model-View-Controller (MVC) architectural pattern commonly used in web development. They serve as the intermediary between the routes (Views) and the data/model layer, facilitating communication and data flow.

#### Example:
```javascript
// controllers/usersController.js
const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.createUser = async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        res.status(201).json({ success: true, data: newUser });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
```

### Integration:
In an Express application, routers and controllers are often used together to create a structured and maintainable codebase. Routers define the route hierarchy and delegate requests to appropriate controller functions for processing. Controllers, in turn, encapsulate the business logic and interact with data models or external services as needed to fulfill the request.

#### Example:
```javascript
// routes/users.js
const express = require('express');
const router = express.Router();
const { getAllUsers, createUser } = require('../controllers/usersController');

router.get('/', getAllUsers);
router.post('/', createUser);

module.exports = router;
```

In this example, the router delegates `GET` and `POST` requests for the `/users` route to the `getAllUsers` and `createUser` controller functions, respectively. This separation of concerns allows for better organization, maintainability, and scalability of the application codebase.
