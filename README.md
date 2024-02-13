# Contentful API Project
This app provides information about Products (items) from Contentful API.

Key features:
- Get available items every hour from Contentful API and save it to a SQL database (Postgres)
- See all items available in the database
- See specific item by its id in the database
- Delete specific item by its id in the database
- See reports about:
   - % of deleted items
   - % of specific items filtered by certain parameters (includes active items only)
   - \# of items by brand (includes active items only)

## Prerequisites to run the app

Docker (version 20 or higher)

Node (version 20 or higher)

## Running the app

Navigate to the root directory of the project and run the following command to start the project:

    docker compose up -d

Once the process is complete, the application will be accessible at port 3000 (http://localhost:3000). See [below](#endpoints) for more information about the endpoints.

If this is your first time spinning up the database, you should run all migrations before proceeding:

    npm ci && npm run migration:run

After that, you must tell the server to populate the database:

    curl -X POST http://localhost:3000/populate # mac/linux
    curl -Method POST http://localhost:3000/populate # windows

## Endpoints
### Public
> GET -> localhost:3000/item | Retrieves data from all items in the database.

> GET -> localhost:3000/item/:id | Retrieves data from the specified item.

> DELETE -> localhost:3000/item/:id | Deletes the specified item.  Returns an object informing the affected rows (1 if the item was found or deleted, 0 if no items were deleted).

### Private
In order to access the private endpoints you will need an authentication. Access */auth/login* endpoint before trying to access the others.

>POST -> localhost:3000/auth/login | Retrieves your **JWT token**. Pass the required parameters to authenticate: username and password.

>GET -> localhost:3000/private/reports/deleted | Retrieves an object containing information about the % of deleted items in the database.
Headers: Authorization = **JWT token**

>GET -> localhost:3000/private/reports/active | Retrieves an object containing information about the % of active items based on the parameters passed. The parameters available are: startDate, endDate, minPrice, maxPrice.
Parameters:
*startDate* and *endDate* should follow the YYYY-MM-DD format (eg.: 2024-12-31).
*minPrice*, *maxPrice* should be numbers (eg.: 1, 2, 3,..)
Headers: Authorization = **JWT token**

## Testing
    npm run test
The coverage threshold is set to min. 30% (statements).
