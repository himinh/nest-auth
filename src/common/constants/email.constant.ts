export const transEmail = {
  template: (title: string, description: string, url: string, text: string) => `
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link
        href="https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap"
        rel="stylesheet"
      />
      <title>Account Activation</title>
      <style>
        body {
          background-color: #333333;
          height: 100vh;
          font-family: "Roboto", sans-serif;
          color: #fff;
          position: relative;
          text-align: center;
        }
        .container {
          max-width: 700px;
          width: 100%;
          height: 100%;
          margin: 0 auto;
        }
        .wrapper {
          padding: 0 15px;
        }
        .card {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
        }
        span {
          color: #ffc107;
        }
        button {
          padding: 1em 6em;
          border-radius: 5px;
          border: 0;
          background-color: hsl(45, 100%, 51%);
          transition: all 0.3s ease-in;
          cursor: pointer;
        }
        button:hover {
          background-color: hsl(45, 70%, 51%);
          transition: all 0.3s ease-in;
        }
        .spacing {
          margin-top: 2rem;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="wrapper">
          <div class="card">
            <h1>${title}</h1>
            <p>${description}</p>
            <a href=${url}><button>${text}</button></a>
            <p class="spacing">
              If the button above does not work, please navigate to the link
              provided below 👇🏻
            </p>
            <div>${url}</div>
          </div>
          <div class="spacing">If you believe this email is mistaken, ignore it. Best regards!</div>
        </div>
      </div>
    </body>
  </html>`,
};
