# Gatewayd Basic Admin Webapp

Deployed at [http://gatewayd.org/tools/basic](http://gatewayd.org/tools/basic)

The gatewayd basic admin webapp allows administrators to log in to their gateway remotely. Features:
- Monitor incoming/outgoing ripple transactions in real time
- Check transaction details
- Clear incoming transactions
- Send payments to a ripple address or ripple name

## How To Use:

1. [Start up your gateway](https://ripple.com/build/gatewayd/#gatewayd-usage).
2. To get your API key, in the terminal:

    ```
    $ bin/gateway get_key
    ```
3. Visit the gateway's host url in the browser to trust and accept the security authorization.

    ```
    "Advanced" => "Proceed anyway"
    ```
4. Visit to the [gatewayd basic admin webapp](http://gatewayd.org/tools/basic).

5. Enter gatewayd username (*admin@example.com* by default*), host url, and API key.

6. Navigate links to filter between payment types.

7. Click on Ripple Graph link to see a graphical representation of the transaction.

8. Click on payment to see payment details.

9. Click [+] in the top right to open form for sending payments.
10. Payments will be constantly refreshed while gateway app tab/window is activ
e/open.

_* If admin@example.com does not work as the username, check_ **/config/config.json** _or_ **/config/environment.js** _in gatewayd and append admin@ with the value of the DOMAIN property._

## Developers - Getting Started:

1. Clone webapp repo from [Github](https://github.com/hserang/gatewayd-admin-seeds):

    ```
    $ git clone git@github.com:hserang/gatewayd-admin-seeds.git
    ```
2. Navigate to directory and npm install:

    ```
    $ npm install
    ```
3. Run gulp build process/live reload server:

    ```
    npm run dev
    ```
    If you get an EMFILE error, you need to increase the maximum number of files than can be opened and processes that can be used:

    ```
    $ ulimit -n 1000
    $ ulimit -u 1000
    ```
4. In your browser, access the local webapp via the default url:

    ```
    http://localhost:8080
    ```
5. This application uses [React](http://facebook.github.io/react/docs/tutorial.html) views and [Backbone stores](http://www.toptal.com/front-end/simple-data-flow-in-react-applications-using-flux-and-backbone?utm_source=javascriptweekly&utm_medium=email) within the [Flux architecture](http://facebook.github.io/flux/docs/overview.html). [React Router](https://github.com/rackt/react-router) is used for client-side routing. It also has Bootstrap styling supported with [React Bootstrap](http://react-bootstrap.github.io/).
6. You can find the root of the of app at:

    ```
    /app/scripts/main.jsx
    ```
